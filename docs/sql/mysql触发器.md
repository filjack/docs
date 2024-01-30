# 触发器

## 优点和缺点

### 优点

- `SQL`触发器提供了检查数据完整性的替代方法。
- `SQL`触发器可以捕获数据库层中业务逻辑中的错误。
- `SQL`触发器提供了[运行计划任务](http://www.yiibai.com/mysql/triggers-working-mysql-scheduled-event.html)的另一种方法。通过使用`SQL`触发器，您不必等待运行计划的任务，因为在对表中的数据进行更改之前或之后自动调用触发器。
- `SQL`触发器对于审核表中数据的更改非常有用。

### 缺点

- `SQL`触发器只能提供扩展验证，并且无法替换所有验证。一些简单的验证必须在应用层完成。 例如，您可以使用JavaScript或服务器端使用服务器端脚本语言(如[`JSP`](http://www.yiibai.com/jsp/)，[`PHP`](http://www.yiibai.com/php/)，`ASP.NET`，[`Perl`](http://www.yiibai.com/perl/)等)来验证客户端的用户输入。
- 从客户端应用程序调用和执行`SQL`触发器不可见，因此很难弄清数据库层中发生的情况。
- `SQL`触发器可能会增加数据库服务器的开销。

## `MySQL5.7.2` 版本对比

在*`MySQL5.7.2`*版本之前，每个表最多可以定义六个触发器。

- `BEFORE INSERT` - 在数据插入表之前被激活触发器。
- `AFTER INSERT` - 在将数据插入表之后激活触发器。
- `BEFORE UPDATE` - 在表中的数据更新之前激活触发器。
- `AFTER UPDATE` - 在表中的数据更新之后激活触发器。
- `BEFORE DELETE` - 在从表中删除数据之前激活触发器。
- `AFTER DELETE` - 从表中删除数据之后激活触发器。

但是，从*`MySQL 5.7.2+`*版本开始，可以为相同的触发事件和动作时间定义多个触发器。

## `MySQL`触发存储

`MySQL`在数据目录中存储触发器，例如：`/data/yiibaidb/`,并使用名为`tablename.TRG`和`triggername.TRN`的文件：

- `tablename.TRG`文件将触发器映射到相应的表。
- `triggername.TRN`文件包含触发器定义。

可以通过将触发器文件复制到备份文件夹来备份`MySQL`触发器。

## `MySQL`触发限制

- 不能使用在`SHOW`，`LOAD DATA`，`LOAD TABLE`，[BACKUP DATABASE](http://www.mysqltutorial.org/mysql/how-to-backup-database-using-mysqldump.aspx)，`RESTORE`，`FLUSH`和`RETURN`语句之上。
- 不能使用隐式或明确提交或回滚的语句，如`COMMIT`，`ROLLBACK`，`START TRANSACTION`，[LOCK/UNLOCK TABLES](http://www.mysqltutorial.org/mysql-table-locking.html)，`ALTER`，`CREATE`，`DROP`，[RENAME](http://www.mysqltutorial.org/mysql-rename-table.html)等。
- 不能使用[准备语句](http://www.mysqltutorial.org/mysql-prepared-statement.aspx)，如`PREPARE`，`EXECUTE`等
- 不能使用动态`SQL`语句。
- 从*`MySQL 5.1.4`*版本开始，触发器可以调用[存储过程](http://www.mysqltutorial.org/mysql-stored-procedure-tutorial.aspx)或存储函数，在这之前的版本是有所限制的。

## 创建语法

```mysql
CREATE TRIGGER trigger_name trigger_time trigger_event
 ON table_name
 FOR EACH ROW
 BEGIN
 ...
 END;
```

- 将触发器名称放在`CREATE TRIGGER`语句之后。触发器名称应遵循命名约定`[trigger_time]_[table_name]_[trigger_event]`，例如before_employees_update。
- 触发激活时间可以在之前或之后。必须指定定义触发器的激活时间。如果要在更改之前处理操作，则使用`BEFORE`关键字，如果在更改后需要处理操作，则使用`AFTER`关键字。
- 触发事件可以是`INSERT`，`UPDATE`或`DELETE`。此事件导致触发器被调用。 触发器只能由一个事件调用。要定义由多个事件调用的触发器，必须定义多个触发器，每个事件一个触发器。
- 触发器必须与特定表关联。没有表触发器将不存在，所以必须在`ON`关键字之后指定表名。
- 将`SQL`语句放在`BEGIN`和`END`块之间。这是定义触发器逻辑的位置。

```mysql
DELIMITER $$
CREATE TRIGGER before_employee_update 
    BEFORE UPDATE ON employees
    FOR EACH ROW 
BEGIN
    INSERT INTO employees_audit
    SET action = 'update',
     employeeNumber = OLD.employeeNumber,
        lastname = OLD.lastname,
        changedat = NOW(); 
END$$
DELIMITER ;
```

在为[INSERT](http://www.yiibai.com/mysql/insert-statement.html)定义的触发器中，可以仅使用`NEW`关键字，`在before insert` 触发器中，new 中的值也可以被更新（即，允许修改被插入的值）；对于 `auto_increment`列，new 在 insert 执行之前包含0，执行之后包含新的自动生成值。不能使用`OLD`关键字。但是，在为`DELETE`定义的触发器中，没有新行，因此您只能使用`OLD`关键字，并且 `old` 中的值全部都是只读的，不能进行更新。在[UPDATE](http://www.yiibai.com/mysql/update-data.html)触发器中，`OLD`是指更新前的行（只读），而`NEW`是更新后的行（可更新）。

通常 before 用于数据验证和净化（目的是保证插入表中的数据确实是需要的数据）。 



如果表中有相同事件有多个触发器，`MySQL`将按照创建的顺序调用触发器。要更改触发器的顺序，需要在`FOR EACH ROW`子句之后指定`FOLLOWS`或`PRECEDES`。

- `FOLLOWS`选项允许新触发器在现有触发器之后激活。
- `PRECEDES`选项允许新触发器在现有触发器之前激活。

```mysql
DELIMITER $$
CREATE TRIGGER  trigger_name
[BEFORE|AFTER] [INSERT|UPDATE|DELETE] ON table_name
FOR EACH ROW [FOLLOWS|PRECEDES] existing_trigger_name
BEGIN
…
END$$
DELIMITER ;
```

## 查看触发器

触发器作为纯文本文件存储在以下数据库文件夹中：

```sql
/data_folder/database_name/table_name.trg
```

```mysql
show triggers; # 查看当前数据库下所有触发器

show triggers from database_name; # 查看特定数据库中触发器信息

SHOW TRIGGERS FROM yiibaidb WHERE `table` = 'employees'; # 查看特定表的触发器，表名用反引号（table为关键字）
```

返回如下信息：

- `Trigger`：存储触发器的名称，例如`before_employee_update`触发器。
- `Event`：指定事件，例如，调用触发器的`INSERT`，`UPDATE`或`DELETE`。
- `Table`：指定触发器与例如相关联的表,如`employees`表。
- `Statement`：存储调用触发器时要执行的语句或复合语句。
- `Timing`：接受两个值：`BEFORE`和`AFTER`，它指定触发器的激活时间。
- `Created`：在创建触发器时记录创建的时间。
- `sql_mode`：指定触发器执行时的SQL模式。
- `Definer`：记录创建触发器的帐户。

```mysql
select trigger_name,action_order from information_schema.triggers # 查看触发器名称，以及相同事件触发器触发的顺序
```

## 删除触发器

```mysql
DROP TRIGGER table_name.trigger_name;
```

## 修改触发器

先删后新增

## 注意

- 当使用不是`INSERT`，`DELETE`或`UPDATE`语句更改表中数据的语句时，不会调用与表关联的触发器。 例如，[TRUNCATE](http://www.yiibai.com/mysql/truncate-table.html)语句删除表的所有数据，但不调用与该表相关联的触发器。
- 有些语句使用了后台的`INSERT`语句，如[REPLACE语句](http://www.yiibai.com/mysql/replace.html)或[LOAD DATA语句](http://www.yiibai.com/mysql/import-csv-file-mysql-table.html)。如果使用这些语句，则调用与表关联的相应触发器。
- 触发器仅支持在表上建立，视图以及临时表都不支持。
- 如果 `before` 触发器失败，则 `sql` 不会执行，如果 `before` 触发器或者是 `sql` 本身失败，则 `after` 触发器不回执行。