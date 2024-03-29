# 事件

MySQL事件是基于预定义的时间表运行的任务，因此有时它被称为预定事件。MySQL事件也被称为“时间触发”，因为它是由时间触发的，而不是像[触发器](http://www.yiibai.com/mysql/triggers.html)一样更新表来触发的。MySQL事件类似于UNIX中的cron作业或Windows中的任务调度程序。

您可以在许多情况下使用MySQL事件，例如优化数据库表，清理日志，归档数据或在非高峰时间生成复杂的报告。

## MySQL事件调度器配置

MySQL使用一个名为事件调度线程的特殊线程来执行所有调度的事件。可以通过执行以下命令来查看事件调度程序线程的状态：

```sql
SHOW PROCESSLIST;
```

执行上面查询语句，得到以下结果 - 

```shell
mysql> SHOW PROCESSLIST;
+----+------+-----------------+----------+---------+------+----------+------------------+
| Id | User | Host            | db       | Command | Time | State    | Info             |
+----+------+-----------------+----------+---------+------+----------+------------------+
|  2 | root | localhost:50405 | NULL     | Sleep   | 1966 |          | NULL             |
|  3 | root | localhost:50406 | yiibaidb | Sleep   | 1964 |          | NULL             |
|  4 | root | localhost:50407 | yiibaidb | Query   |    0 | starting | SHOW PROCESSLIST |
+----+------+-----------------+----------+---------+------+----------+------------------+
3 rows in set
```

默认情况下，事件调度程序线程未启用。 要启用和启动事件调度程序线程，需要执行以下命令：

```sql
SET GLOBAL event_scheduler = ON;
```

现在看到事件调度器线程的状态，再次执行`SHOW PROCESSLIST`命令，结果如下所示 - 

```sql
mysql> SHOW PROCESSLIST;
+----+-----------------+-----------------+----------+---------+------+------------------------+------------------+
| Id | User            | Host            | db       | Command | Time | State                  | Info             |
+----+-----------------+-----------------+----------+---------+------+------------------------+------------------+
|  2 | root            | localhost:50405 | NULL     | Sleep   | 1986 |                        | NULL             |
|  3 | root            | localhost:50406 | yiibaidb | Sleep   | 1984 |                        | NULL             |
|  4 | root            | localhost:50407 | yiibaidb | Query   |    0 | starting               | SHOW PROCESSLIST |
|  5 | event_scheduler | localhost       | NULL     | Daemon  |    6 | Waiting on empty queue | NULL             |
+----+-----------------+-----------------+----------+---------+------+------------------------+------------------+
4 rows in set
```

要禁用并停止事件调度程序线程，可通过执行`SET GLOBAL`命令将`event_scheduler`其值设置为`OFF`：

```sql
SET GLOBAL event_scheduler = OFF;
```

## 创建新的MySQL事件

创建事件与创建其他数据库对象(如存储过程或触发器)类似。事件是一个包含SQL语句的命名对象。

[存储过程](http://www.yiibai.com/mysql/stored-procedure.html)仅在直接调用时执行; [触发器](http://www.yiibai.com/mysql/triggers.html)则是在与一个表相关联的事件(例如[插入](http://www.yiibai.com/mysql/insert-statement.html)，[更新](http://www.yiibai.com/mysql/update-data.html)或[删除](http://www.yiibai.com/mysql/delete-statement.html))发生时被调用。事件，可以在一次或多次的时间间隔规则下执行。

要创建和计划新事件，请使用`CREATE EVENT`语句，如下所示：

```sql
CREATE EVENT [IF NOT EXIST]  event_name
ON SCHEDULE schedule
DO
event_body
```

下面让我们更详细地解释语法中的一些参数 -

- *首先*，在`CREATE EVENT`子句之后指定事件名称。事件名称在数据库模式中必须是唯一的。
- *其次*，在`ON SCHEDULE`子句后面加上一个表示频次或时间的定时语句。如果事件是一次性事件，则使用语法：`AT timestamp [+ INTERVAL]`，如果事件是循环事件，则使用`EVERY`子句：`EVERY interval STARTS timestamp [+INTERVAL] ENDS timestamp [+INTERVAL]`
- *第三*，将`DO`语句放在`DO`关键字之后。请注意，可以在事件主体内调用存储过程。 如果您有复合SQL语句，可以将它们放在`BEGIN END`块中。

我们来看几个创建事件的例子来了解上面的语法。

*首先*，创建并计划将一个消息插入到`messages`表中的一次性事件，请执行以下步骤：

```sql
USE testdb;
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL
);
```

*其次*，使用`CREATE EVENT`语句创建一个事件：

```sql
CREATE EVENT IF NOT EXISTS test_event_01
ON SCHEDULE AT CURRENT_TIMESTAMP
DO
  INSERT INTO messages(message,created_at)
  VALUES('Test MySQL Event 1',NOW());
```

*第三*，检查`messages`表; 会看到有`1`条记录。这意味着事件在创建时被执行。

```sql
SELECT * FROM messages;
```

执行上面查询语句，得到以下结果 - 

```shell
mysql> SELECT * FROM messages;
+----+--------------------+---------------------+
| id | message            | created_at          |
+----+--------------------+---------------------+
|  1 | Test MySQL Event 1 | 2017-08-03 04:23:11 |
+----+--------------------+---------------------+
1 row in set
```

要显示数据库(`testdb`)的所有事件，请使用以下语句：

```sql
SHOW EVENTS FROM testdb;
```

执行上面查询看不到任何行返回，因为事件在到期时自动删除。 在我们的示例中，它是一次性的事件，在执行完成时就过期了。

要更改此行为，可以使用`ON COMPLETION PRESERVE`子句。以下语句创建另一个一次性事件，在其创建时间`1`分钟后执行，执行后不会被删除。

```sql
CREATE EVENT test_event_02
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE
ON COMPLETION PRESERVE
DO
   INSERT INTO messages(message,created_at)
   VALUES('Test MySQL Event 2',NOW());
```

等待`1`分钟后，查看`messages`表，添加了另一条记录：

```sql
SELECT * FROM messages;
```

执行上面查询语句，得到以下结果 - 

```shell
mysql> SELECT * FROM messages;
+----+--------------------+---------------------+
| id | message            | created_at          |
+----+--------------------+---------------------+
|  1 | Test MySQL Event 1 | 2017-08-03 04:23:11 |
|  2 | Test MySQL Event 2 | 2017-08-03 04:24:48 |
+----+--------------------+---------------------+
2 rows in set
```

如果再次执行`SHOW EVENTS`语句，看到事件是由于`ON COMPLETION PRESERVE`子句的影响：

```sql
SHOW EVENTS FROM testdb;
```

执行上面查询语句，得到以下结果 - 

```shell
mysql> SHOW EVENTS FROM testdb;
+--------+---------------+----------------+-----------+----------+---------------------+----------------+----------------+--------+------+----------+------------+----------------------+----------------------+--------------------+
| Db     | Name          | Definer        | Time zone | Type     | Execute at          | Interval value | Interval field | Starts | Ends | Status   | Originator | character_set_client | collation_connection | Database Collation |
+--------+---------------+----------------+-----------+----------+---------------------+----------------+----------------+--------+------+----------+------------+----------------------+----------------------+--------------------+
| testdb | test_event_02 | root@localhost | SYSTEM    | ONE TIME | 2017-08-03 04:24:48 | NULL           | NULL           | NULL   | NULL | DISABLED |          0 | utf8                 | utf8_general_ci      | utf8_general_ci    |
+--------+---------------+----------------+-----------+----------+---------------------+----------------+----------------+--------+------+----------+------------+----------------------+----------------------+--------------------+
1 row in set
```

以下语句创建一个循环的事件，每分钟执行一次，并在其创建时间的`1`小时内过期：

```sql
CREATE EVENT test_event_03
ON SCHEDULE EVERY 1 MINUTE
STARTS CURRENT_TIMESTAMP
ENDS CURRENT_TIMESTAMP + INTERVAL 1 HOUR
DO
   INSERT INTO messages(message,created_at)
   VALUES('Test MySQL recurring Event',NOW());
```

请注意，使用`STARTS`和`ENDS`子句定义事件的有效期。等待个3，5分钟后再查看`messages`表数据，以测试验证此循环事件的执行。

```sql
SELECT * FROM messages;
```

执行上面查询语句，得到以下结果 - 

```shell
mysql> SELECT * FROM messages;
+----+----------------------------+---------------------+
| id | message                    | created_at          |
+----+----------------------------+---------------------+
|  1 | Test MySQL Event 1         | 2017-08-03 04:23:11 |
|  2 | Test MySQL Event 2         | 2017-08-03 04:24:48 |
|  3 | Test MySQL recurring Event | 2017-08-03 04:25:20 |
|  4 | Test MySQL recurring Event | 2017-08-03 04:26:20 |
|  5 | Test MySQL recurring Event | 2017-08-03 04:27:20 |
+----+----------------------------+---------------------+
5 rows in set
```

## 删除MySQL事件

要删除现有事件，请使用`DROP EVENT`语句，如下所示：

```sql
DROP EVENT [IF EXISTS] event_name;
```

例如，要删除`test_event_03`的事件，请使用以下语句：

```sql
DROP EVENT IF EXISTS test_event_03;
```