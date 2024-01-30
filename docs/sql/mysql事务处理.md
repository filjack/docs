## 事务处理

事务是一组操作的集合，是一个不可分割的工作单位，事务会把所有操作作为一个整体一起向系统提交或撤销操作请求。

事务处理，可以用来维护数据库的完整性，保证成批的 `mysql` 操作要么完全执行，要么完全不执行。

 ***`MyISAM` 不支持明确的事务处理管理， `InnoDB` 支持。*** 

事务（`transaction`）：指一组 `sql` 语句。
回退（`rollback`）：指撤销指定 `sql` 语句的过程。
提交（`commit`）：指将未存储的 `sql` 语句结果写入数据库表。
保留点（`savepoint`）：指事务处理中设置的临时占位符，你可以对他发布回退（与退回整个事务处理不同）。

```sql
start transaction; # 开始事务，在事务处理块中，提交不回隐含的提交，必须使用commit
rollback; # 回退，insert update delete
commit; # 提交事务
# 当使用完 rollback 或 commit 后，事务自动关闭，以后的修改会隐含提交

savepoint delete1; # 放置保留点，应该多多放置保留点
rollback delete1; # 回退到保留点，在执行完一条rollback或者commit语句后自动释放保留点，也可以使用
release savepoint delete1; # 明确释放保存点delete1
```

例如：

```sql
delimiter //
select * from ordertotals;
start transaction;
delete from ordertotals;
select * from ordertotals;
rollback;
select * from ordertotals//
+-----------+---------+
| order_num | total   |
+-----------+---------+
|     20005 |  158.86 |
|     20006 |   58.30 |
|     20007 | 1060.00 |
|     20008 |  132.50 |
|     20009 |   40.78 |
|     20009 |   40.78 |
+-----------+---------+
6 rows in set (0.00 sec)

Query OK, 0 rows affected (0.01 sec)

Query OK, 6 rows affected (0.01 sec)

Empty set (0.01 sec)

Query OK, 0 rows affected (0.01 sec)

+-----------+---------+
| order_num | total   |
+-----------+---------+
|     20005 |  158.86 |
|     20006 |   58.30 |
|     20007 | 1060.00 |
|     20008 |  132.50 |
|     20009 |   40.78 |
|     20009 |   40.78 |
+-----------+---------+
6 rows in set (0.01 sec)
```

更改默认提交行为

```sql
select @@autocommit;
set @@autocommit = 0; # 不自动提交更改
set @@autocommit = 1; # 自动提交更改
# autocommit标志是针对连接而不是服务器使用的
```

## ACID特性

> 原子性、隔离性、持久性是手段，一致性是目的，事务的目的是为了保证一组操作前后数据的一致性。

### 原子性（Atomicity）

事务是不可分割的最小操作单元，要么全部成功，要么全部失败。

### 隔离性（Isolation）

数据库系统提供的隔离机制，保证事务在不受到外部并发操作影响的独立环境下运行

### 持久性（Durability）

事务一旦提交，它对数据库中数据的改变就是永久的。

### 一致性（Consistency）

事务完成时，必须使得数据从一个正确的状态转变为另一个正确的状态。一致性换句话说是我们使用事务的目的，期望我们的应用数据在经过一些列操作处理之后，从一个我们从应用层面来看是正确的状态转变为另一个我们从应用层面来看也是正确的状态。

## 事务的隔离级别

### 读未提交（read uncommited）

允许读取事务未提交数据。可能会产生脏读的问题

### 读已提交（read commited）

只允许读取事务已提交数据。可能会产生不可重复读问题。即一个事务内两次读取同一个数据的时候，该数据中间被另一个事务修改并提交事务了，导致事务内读取到的同一个数据不一致。

### 可重复读（repeatable read）（mysql默认）

只允许读取事务已提交数据，并且开启事务后，读取的数据不允许其他事务进行修改，直到本事务关闭（提交或者回滚）。可能会产生幻读问题，因为事务开始后读取的数据是不允许其它事务修改的，但是无法控制其它事务进行新增数据，这会导致相同的读取条件下（查询条件下），可能读取到的数据总数是不同的。

### 串行化（serializable）

事务串行化执行，可以避免脏读、不可重复读、幻读问题，但是这种隔离级别下执行效率极低，比较消耗数据库性能，一般不使用。

### 设置隔离级别

```sql
select @@transaction_isolation;

set [session|global] transaction isolation level [read UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE]
```

