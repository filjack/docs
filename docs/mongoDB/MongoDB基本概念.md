# 基本概念

MongoDB是由C++编写的，一个基于分布式文件存储的高扩展的、高可用的开源数据库系统。MongoDB将数据存储为一个文档，数据结构由键值对组成。MongoDB文档类似于JSON对象，属性值类型可是文档、数组、文档数组等。

```json
{
    name: "sue",
    age: 26,
    status: "A",
    groups: ["news", "sports"]
}
```

类比于关系型数据库表结构

| id   | user_name     | email           | age  | city        |
| ---- | ------------- | --------------- | ---- | ----------- |
| 1    | Mark Hanks    | mark@abc.com    | 25   | Los Angeles |
| 2    | Richard Peter | richard@abc.com | 31   | Dallas      |

mongoDB结构如下：

```json
{
    "_id": ObjectId("5146bb52d8524270060001f3"),
    "age": 25,
    "city": "Los Angeles",
    "email": "mark@abc.com",
    "user_name": "Mark Hanks"
},
{
    "_id": ObjectId("5146bb52d8524270060001f2"),
    "age": 31,
    "city": "Dallas",
    "email": "richard@abc.com",
    "user_name": "Richard Peter"
}
```



## [数据库](./数据库操作.md) 

单实例的mongoDB中也可以建立多个数据库，默认数据库是`db`，该数据库存储在data目录中。每个数据库都有自己的集合和权限，不同数据库放置在不同的文件中。

## [集合](./集合操作.md) 

集合是文档组，也就是文档的集合。没有固定的结构，所以可以在集合中插入不同格式和类型的数据，但是通常情况下我们插入的数据都有一定的关联性。

当第一个文档插入时，集合就会被创建。

集合的命令规则如下：

- 不能是空字符串
- 不能含有`\0`（空字符）,这个字符表示集合名的结尾
- 不能以`system.`开头，这是为系统集合保留的前缀
- 用户创建的集合名字不建议含有保留字符。（有些驱动程序的确支持在集合名中包含保留字符，这是因为某些系统生成的集合中包含该字符，除非你要访问这种系统创建的集合，否则尽量不要在名字中出现保留字符）

## 文档

文档是一组有序键值对（BSON）。键是字符串类型，值可以是所有BSON数据类型，包括文档（不能是本文档）、数组、文档数组等等。

MongoDB文档区分类型和大小写，且文档中不能有重复的键

对于键的名字有以下要求：

- `_id`被保留用作主键，值在集合中必须是唯一的、不可变的，类型要求除数组以外的所有类型。如果`_id`有子字段，子字段的名字不能以`$`开头
- 键不能含有`\0`（空字符），该字符用来表示键的结尾
- 服务器允许存储包含点(`.`)和美元符号(`$`)的字段名，但是这两个符号具有特别含义，只有在特定场景下才会使用

## 域

## 索引

## 主键

## 元数据（数据库系统信息）

数据库的相关信息都存储在 `<dbname>.system.*`命名空间中，该命名空间下包含多种系统信息的特殊集合

| 集合命令空间             | 描述                                      |
| ------------------------ | ----------------------------------------- |
| dbname.system.namespaces | 列出所有名字空间。                        |
| dbname.system.indexes    | 列出所有索引。                            |
| dbname.system.profile    | 包含数据库概要(profile)信息。             |
| dbname.system.users      | 列出所有可访问数据库的用户。              |
| dbname.local.sources     | 包含复制对端（slave）的服务器信息和状态。 |

 对于修改系统集合中的文档有如下限制：

- 在{{system.indexes}}插入数据，可以创建索引。但除此之外该表信息是不可变的(特殊的drop index命令将自动更新相关信息)。

- {{system.users}}是可修改的。
-  {{system.profile}}是可删除的。

## 数据类型



