# SQL优化

## 插入数据

### insert优化

1. 批量插入，一次性插入语句大概500-1000比较合适，过多的话可以拆分为多条批量插入语句
   ```sql
   insert into tb_user values(1, 'Tom'),(2, 'Cat'), (3, 'Jerry');
   ```

2. 手动事务提交，由于MySQL事务提交方式是自动提交，那么意味着执行一条插入语句前，自动开始事务，执行完毕后自动提交；执行第二条再开启事务，执行结束自动提交，这样会频繁地开启/提交事务
   ```sql
   start transaction;
   insert into tb_user values(1, 'Tom'),(2, 'Cat'), (3, 'Jerry');
   insert into tb_user values(1, 'Tom'),(2, 'Cat'), (3, 'Jerry');
   insert into tb_user values(1, 'Tom'),(2, 'Cat'), (3, 'Jerry');
   commit;
   ```

3. 主键顺序插入

4. 大批量插入数据，可以使用MySQL提供的load指令进行插入
   ```sql
   # 客户端连接服务器时，加上参数 --local-infile
   mysql -local-infile -u root -p;
   # 设置全局参数local_infile为1，开启从本地加载文件导入数据的开关
   set global local_infile = 1;
   # 执行load指令将准备好的数据，加载到表结构中
   load data load infile '/root/sql.log' into table 'tb_user' fields terminated by ',' lines terminated by '\n';
   ```

   按照主键顺序插入性能更佳

## 主键优化

### 数据组织方式

在InnoDB存储引擎中，表数据都是根据主键顺序组织存放的，这种存储方式的表称为索引组织表（index organized table IOT）。

### 页分裂

页可以为空，也可以填充一半，也可以填满。每个页包含了2-N行数据，根据主键排列。

<img :src="$withBase='/img/sql-pk-1.png'" class="align-center" />

<img :src="$withBase='/img/sql-pk-2.png'" class="align-center" />

一般是50%的位置

<img :src="$withBase='/img/sql-pk-3.png'" class="align-center" />

<img :src="$withBase='/img/sql-pk-4.png'" class="align-center" />

### 页合并

当删除一行记录时，实际上记录并没有被物理删除，只是记录被标识（flaged）为删除并且它的空间变得允许被其他记录声明使用。

当页中删除的记录达到MERGE_THRESHOLD（默认为页的50%），InnoDB开始寻找最靠近的页（前或后）看看是否可以将两个页合并以优化空间使用

> MERGE_THRESHOLD: 合并页的阈值，可以自己设置，在创建表或者创建索引时指定

<img :src="$withBase='/img/sql-pk-merge-1.png'" class="align-center" />

<img :src="$withBase='/img/sql-pk-merge-2.png'" class="align-center" />

<img :src="$withBase='/img/sql-pk-merge-3.png'" class="align-center" />

<img :src="$withBase='/img/sql-pk-merge-4.png'" class="align-center" />

### 主键设计原则

1. 满足业务需求的情况下，尽量降低主键的长度。因为二级索引叶子节点存储的是主键，如果二级索引很多，主键过长，很占用空间
2. 插入数据时，尽量选择顺序插入，选择使用AUTO_INCREMENT自增主键
3. 尽量不要使用UUID做主键或者是其他自然主键，如身份证号
4. 业务操作时，避免对主键的修改

## order by优化

> Using filesort：通过表的索引或全表扫描，读取满足条件的数据行，然后在排序缓冲区sort_buffer中完成排序操作，所有不是通过索引直接返回排序结果的排序都叫filesort排序
>
> Using index：通过有序索引顺序扫描直接返回有序数据，这种情况即为using index，不需要额外排序，操作效率高。

### order by设计原则

1. 根据排序字段建立合适的索引，所字段排序时，也遵循最左前缀法则

2. 尽量使用覆盖索引

3. 多字段排序，一个升序，一个降序，此时需要注意联合索引在创建时的规则
   ```sql
   create index idx_user_phone_age on tb_user (phone desc, age asc);
   ```

4. 如果不可避免的出现filesort，大数据量排序时，可以适当增大排序缓冲区大小sort_buffer_size，默认时256k。

## group by优化

1. 在分组操作时，可以根据分组列建立索引来提升效率
2. 在分组时，索引的使用也是满足最左前缀法则

## limit 优化

当数据总量比较大时，页数越大查询越慢，此时可以通过**覆盖索引 + 子查询**的方式来优化

```sql
select s.* from tb_sku a, (select id from tb_sku order by id limit 2000000,10) b where a.id = b.id;
```



## count优化

- MyISAM引擎把一个表的总行数存在了磁盘上，因此执行count(*)的时候会直接返回这个数，效率很高，前提是没有where子句
- InnoDB引擎在执行count(*)的时候，需要把数据一行一行地从引擎里面读出来，然后累计技术

### 优化思路

1. 自己计数，借助缓存等工具

### count常用用法

1. count(主键)
   InnoDB引擎会遍历整张表，把每一行的主键id值都取出来，返回给服务层，服务层拿到主键后，直接按行进行累加（主键不可能为null）
2. count(字段)
   - 没有not null约束，InnoDB引擎会遍历整张表把每一行的字段取出来，返回给服务层，服务层判断是否为null，不为null，计数累加
   - 有not null约束，InnoDB引擎会遍历整张表把每一行字段值取出来，返回给服务层，直接按行进行累加
3. count(1)
   InnoDB引擎遍历整张表，但不取值。服务层对于返回的没一行，放一个数字1进去，直接按行进行累加
4. count(*)
   InnoDB引擎并不会把全部字段取出来，而是专门做了优化，不取值，服务层直接按行进行累加

按照效率排序，`count(字段)<count(主键)<count(1)≈count(*)`，所以尽量使用`count(*)` 

## update优化

InnoDB的行锁是针对索引加的锁，不是针对记录加的锁，所以更新时一定要以索引为条件进行更新，否则会升级为表锁。并且更新时索引不能失效，否则也会升级为表锁。