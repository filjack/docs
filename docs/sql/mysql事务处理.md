## 事务处理

事务处理，可以用来维护数据库的完整性，保证成批的 `mysql` 操作要么完全执行，要么完全不执行。

 ***`MyISAM` 不支持明确的事务处理管理， `InnoDB` 支持。*** 

事务（transaction）：指一组 `sql` 语句。
回退（rollback）：指撤销指定 `sql` 语句的过程。
提交（commit）：指将未存储的 `sql` 语句结果写入数据库表。
保留点（savepoint）：指事务处理中设置的临时占位符，你可以对他发布回退（与退回整个事务处理不同）。

```mysql
start transaction; # 开始事务，在事务处理块中，提交不回隐含的提交，必须使用commit
rollback; # 回退，insert update delete
commit; # 提交事务
# 当使用完 rollback 或 commit 后，事务自动关闭，以后的修改会隐含提交

savepoint delete1; # 放置保留点，应该多多放置保留点
rollback delete1; # 回退到保留点，在执行完一条rollback或者commit语句后自动释放保留点，也可以使用
release savepoint # 明确释放
```

例如：

```mysql
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

```mysql
set autocommit = 0; # 不自动提交更改
set autocommit = 1; # 自动提交更改
# autocommit标志是针对连接而不是服务器使用的
```

