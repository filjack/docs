# 存储引擎

## 体系结构

<img :src="$withBase='/img/sql-1.png'" class="align-center" />

### 连接层

接收客户端的连接，完成一些连接的处理以及认证授权的相关操作、安全方案，是否超过最大连接数等等校验操作

### 服务层

绝大部分的核心功能都是在服务层完成的，例如SQL接口、查询解析器、查询优化器、查询缓存等，以及所有跨存储引擎的实现。

### 引擎层

放置许多内置的存储引擎，接收自实现引擎。引擎负责控制数据存储和提取的方式，服务器通过API来和引擎进行交互。**索引**是在存储引擎层实现的，不同的存储引擎索引的结构是不一样的。

### 存储层

存储数据库的相关数据到文件系统中，例如日志等

## 存储引擎是什么

是存储数据、建立索引、更新/查询数据等技术的实现方式。存储引擎是基于表的，而不是基于库的，所以存储引擎也可以称为表类型。

## 怎么使用存储引擎

在创建表的时候，在语句的最后指定 `ENGINE=InnoDB`

```sql
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(256) NOT NULL COMMENT '用户名',
  `userAccount` varchar(256) NOT NULL COMMENT '用户账号',
  `avatarUri` varchar(256) DEFAULT NULL COMMENT '头像',
  `gender` tinyint DEFAULT NULL COMMENT '性别',
  `userPassword` varchar(256) NOT NULL COMMENT '密码',
  `phone` varchar(128) DEFAULT NULL COMMENT '电话',
  `email` varchar(512) DEFAULT NULL COMMENT '邮箱',
  `userStatus` int DEFAULT NULL COMMENT '用户状态',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDeleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  `userRole` int NOT NULL DEFAULT '0' COMMENT '角色 0-普通 1-管理员',
  `planetCode` varchar(60) DEFAULT NULL COMMENT '星球编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表'
```

## 分类

### `InnoDB`

是一种兼顾高可靠性和高性能的通用存储引擎，5.5之后是默认的存储引擎

**特点：**

- DML操作遵循ACID模型，支持事务
- 行级锁，提高并发访问性能
- 支持外检FOREIGN KEY约束，保证数据的完整性和正确性

**文件：**

xxx.ibd：其中xxx代表表名，innoDB引擎的每张表都会对应这样一个表空间文件，存储该表的表结构（frm、sdi）、数据和索引

innodb_file_per_table开关，打开代表每张表对应一个表空间。

```sql
SHOW VARIABLES LIKE 'innodb_file_per_table'
```

查看ibd文件，doc命令窗口打开

```shell
ibd2sdi xxx.ibd
```

<img :src="$withBase='/img/sql-2.png'" class="align-center" />

### MyISAM

是早期MySQL的默认存储引擎

**特点：**

- 不支持事务，不支持外键
- 支持表锁，不支持行锁
- 访问速度快

**文件：**

- `.MYD`：存放数据
- `.MYI`：存放索引
- `.sdi`：存放表结构信息

### Memory

该引擎的表数据都存放在内存中，由于收到硬件问题、或断电问题的影响，只能将这些表作为临时表或缓存使用

**特点：**

- 内存存放，存取速度快
- 支持hash索引（默认）

**文件：**

`.sdi`：存放表结构信息

### InnoDB vs MyISAM vs Memory

<img :src="$withBase='/img/sql-3.png'" class="align-center" />

## 使用选择

### InnoDB

是MySQL默认引擎，支持事务、外键。如果应用对事务的完整性有比较高的要求，在并发条件下要求数据的一致性，数据操作除了插入和查询之外，还包含很多的更新、删除操作，那么innoDB比较合适

### MyISAM

如果应用是以读操作和插入操作为主，只有很少的更新和删除操作，并且对事务的完整性、并发性要求不是很高，那么MyISAM比较合适（不过目前都是使用MongoDB替代）

### MEMORY

将所有数据保存在内存中，访问速度快，通常用于临时表及缓存。缺点是对表的大小有限制，太大的表无法缓存在内存中，而且无法保证数据的安全性（目前用redis替代）