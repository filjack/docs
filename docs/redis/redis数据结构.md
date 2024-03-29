# Redis数据结构

## [字符串](./redis常用命令.md##字符串) 

```shell
"hello world"
```

字符串类型，是`redis`中最简单的数据类型。存储形式为键值对，键与值可以是普通文字数据，也可以是图片、视频、音频、压缩文件等更为复杂的二进制数据。值的常用类型可以分为3类

- string：普通字符串，例如`"hello"`
  redis中，每个字符串都是一串字节数组，所以每个字符串都是有下标索引的，从前往后，索引从0开始；从后往前，索引从-1开始。
- int：整数类型，可以做自增、自减操作，例如 1
  redis中，新增一个键值对时，如果值能够使用C语言的`long long int`类型进行存储，则被解释为整数。在大多数系统中，这种类型存储的都是64位长度的有符号整数，取值范围介于`-9223372036854775808`和`9223372036854775807`之间
- float：浮点类型，可以做自增、自减操作，例如 9.78
  redis中，新增一个键值对时，如果值能够使用C语言的`long double`类型进行存储，则被解释为浮点数。在大多数系统中，这种类型存储的都是128位长度的有符号浮点数，取值范围介于`3.36210314311209350626e-4932`和`1.18973149535723176502e+4932L`之间

每种格式底层都是字节数组形式进行存储，只不过编码方式不同。字符串类型的最大空间不能超过`512M`。

如果给定键不存在，则返回空值（`nil`）

在redis数据库中，键的存储顺序是无序的。

## [散列](./redis常用命令.md##散列) 

```shell
"article:10086" : {
	"title": "greeting",
	"content": "hello world",
	"author": "peter",
	"created_at": "1442744762.631885"
}
```

redis的散列键会将一个键和一个散列在数据库中关联起来，用户可以在散列中为任意多个字段（field）设置值。散列的字段和值既可以是文本数据，也可以是二进制数据。通过使用散列，用户可以把相关联的多项数据存储到同一个散列里面，以便对这些数据进行管理，或针对它们执行批量操作。

散列包含的字段在底层是以无序方式存储的。

## [列表](./redis常用命令.md##列表) 

```shell
["one","two","three","four"]
```



是一种线性的有序结构，可以按照元素被推入列表中的顺序来存储元素，这些元素既可以是文字数据，也可以是二进制数据，并且列表中的数据可以重复出现。

Redis列表包含的每个元素都有与之对应的正数索引和负数索引，其中正数索引从列表的左端开始，向右端依次递增，起始为0，末尾为N-1；负数索引从列表的最右端开始，向左端依次递减，起始为-1，末尾为-N。

## [集合](./redis常用命令.md##集合)  

```shell
{"redis","MongoDB","CouchDB","MySQL", "Oracle"}
```

Set允许用户将多个各不相同的元素存储到集合中，这些元素既可以是文本数据，也可以是二进制数据。与列表的区别在于

1. 列表可以存储重复元素，集合不允许，集合会忽略置入的重复元素
2. 列表以有序方式存储，集合以无序方式进行存储

### 注意

1. 当对集合进行交、并、差运算时，会消耗大量的资源，所以应该尽量使用带STORE的命令来保存中间结果，防止二次计算
2. 当Redis服务器在进行交、并、差计算时，可能会被阻塞，应该采用使用从服务器来运算，确保主服务器可以正常处理客户端请求。

## [有序集合](./redis常用命令.md##有序集合) 

```shell
{
	"peter": 3500,
	"bob": 3800,
	"jack": 4500,
	"tom": 5000,
	"mary": 5500
}
```



有序集合中，每个元素都由一个成员值与一个与该值相关联的分值组成，成员值以字符串方式存储，分值以64位双精度浮点数格式存储。有序集合按照分值进行排序，虽然集合中不会出现成员值相同的情况，但是会出现分值相同的情况，此时，根据成员值的英文字典顺序排序。

### 注意

1. 分数可以为负值

## [HyperLogLog](./redis常用命令.md##HyperLogLog) 

是一个专门为了计算集合的基数而创建的概率算法，底层基于字符串实现。对于以一个给定的集合，HyperLogLog可以计算出该集合的近似基数（误差处于一个合理的范围之内），一些不需要知道实际基数或者因为条件限制而无法计算出实际基数的程序可以将近似基数当做实际基数使用。

HyperLogLog计算近似基数所需的内存不会因为集合的大小而改变，无论集合包含的元素有多少个，它进行计算所需的内存总是固定的，并且是非常少的。

Redis的每个HyperLogLog只需要使用12kb内存空间，就可以对接近2<sup>64</sup> 个元素进行计数，算法的标准误差仅为`0.81%`，所以它计算出的近似基数是相当可信的。

## [位图](./redis常用命令.md##位图) 

```shell
> 0 1 2 3 4 5 6 7 # 索引
> 1 0 0 1 0 1 0 0 # 位
```



bitmap，是由多个二进制位组成的数组，数组中的每个二进制位都有与之对应的偏移量（也成索引），用户可以通过这些偏移量对位图中指定的一个或多个二进制位进行操作。

Redis中的位图是在字符串的基础上实现的，所以它会把位图的键看做是一个字符串键，可以使用字符串相关操作来操作位图。但是此时返回的不是位图的二进制代码，而是转义的字符串。

## [地理坐标](./redis常用命令.md##地理坐标) 

是Redis在3.2版本新增加的特性，通过这一特性，用户可以将经纬度格式的地理坐标存储到Redis中，并对这些坐标执行距离计算、范围查找等操作。

Redis使用有序集合存储GEO数据，一个位置集合实际上就是一个有序集合。当用户调用GEO命令对位置集合进行操作时，这些命令实际上是在操作一个有序集合。

例如：当使用GEOADD命令添加位置坐标时

```shell
GEOADD Guangdong-cities 113.2099647 23.593675 Qingyuan
```

Redis会把给定的经纬度转换成数字形式的Geohash值`4046597933543051`，然后调用ZADD命令，将位置名及其Geohash值添加到有序集合中

```shell
ZADD Guangdong-cities 4046597933543051 Qingyuan
```

所以，可以使用有序集合命令来操作位置集合。

## [流](./redis常用命令.md##流)  

```shell
visits: [
	{
		ID: "110000000-0",
		{
			name: "peter",
			location: "/book/10086",
			duration: 150
		}
	},
	{
		ID: "120000000-0",
		{
			name: "tom",
			location: "/book/77842",
			duration: 300
		}
	}
]
```



是redis5.0版本中新增的数据结构，是使用redis实现消息队列应用的最佳选择。流是一个包含零个或任意多个流元素的**有序队列**，队列中的每个元素都包含一个ID和任意多个键值对，这些元素会根据ID的大小在流中有序地进行排列。

流中的每个元素可以包含一个或者任意多个键值对，并且同一个流中的不同元素可以包含不同数量的键值对，比如其中一个元素可以包含3个键值对，而另一个元素可以包含5个键值对等等。

与散列以无序方式存储键值对的做法不同，流元素会以有序方式存储用户给定的键值对，即用户在创建元素时以什么顺序给定键值对，它们在被取出的时候就是什么顺序。

### 流的ID

流元素的ID由毫秒时间（millisecond）和顺序编号（sequence number）两部分组成，其中使用UNIX时间戳声明毫秒时间部分，用来标识与元素相关联的时间；顺序编号部分以0为起始值，用来区分同一时间内产生的多个不同的元素。

毫秒时间和顺序编号都使用64位的非负整数，整个流ID的总长度为128位，Redis在接受输入的流ID以及展示流ID时会使用“-”分隔符来分割时间与编号这两部分。用户输入流ID时，可以只输入时间部分，编号部分Redis会默认为0。

流中所有元素的ID是不能相同的，且新增加的元素的ID一定是大于所有原有元素的ID的。这样在逻辑上Redis就将流变成了一种只能进行追加操作的数据结构。

### 消费者组（consumer group）

Redis流的消费者组允许用户将一个流从逻辑上划分为多个不同的流，并让消费者组属下的消费者去处理组中的消息。

同一个流中的消息在不同的消费者组之间是共享的，也就是说，同一个消息可以被多个不同组的消费者读取，并且来自不同消费者组的读取操作不会对其他消费者组的读取操作产生任何影响。

但是同一个消费者组中的每条消息只能有一个消费者。

消费者组在创建之后就会跟踪并维护一系列信息和数据结构，包括：

- 该组属下的消费者名单
- 一个队列，记录了该组目前处于“待处理”状态的所有消息，简称待处理消息队列
- 该组最后递送的消息的ID，刚创建的消费者组，该ID为创建时设置的起始ID

当用户调用XREADGROUP命令对消费者组进行读取之后，命令就会按需更新上述3项信息。

例如：如果用户执行以下命令

```shell
> XREADGROUP GROUP g1 c1 STREAMS msgs 0
```

并且读出了一条ID为10086的消息，那么命令将对消费者组的相关信息执行以下更新：

1. 如果消费者c1是第一次读取这个消费者组，那么将该消费者添加到该组的消费者名单中
2. 将被读取的消息添加到该组的待处理消息队列中
3. 将10086设置为该组的最后递送消息ID



### 消费者

从逻辑上讲，消费者是负责处理消息的客户端。消费者不需要显式地创建，用户只要在执行XREADGROUP命令时给定消费者的名字，Redis就会自动为新出现的消费者创建相应的数据结构。

消费者也会维护一个属于自己的待处理消息队列；每当用户使用XREADGROUP命令读取一条消息，并将这条消息指派给一个消费者处理时，该消费者就会把所指派的消息添加到自己的待处理消息队列中。

### 消息的状态转换

当消费者处理完一条消息后，需要向Redis发送一条针对该消息的XACK命令，当Redis接收到消费者发来的XACK命令之后，就会从消费者组的待处理队列以及消费者的待处理消息队列中移除指定的消息，如此，这些消息的状态就会从“待处理”转换为“已确认”，以此来表示消费者已经处理完这些消息了。

### 注意

1. 消费者组的待处理消息队列以及消费者的待处理消息队列保证了消费者组不会将同一条消息传给同一个消费者；最后递送消息ID的存在保证了消费者组只会向消费者传递新出现的消息。
