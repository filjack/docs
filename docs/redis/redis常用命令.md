# 常用命令

## 字符串

- SET key value
  为字符串键设置值
- GET key
  获取字符串键的值
- GETSET key new_value
  获取旧值并设置新值
- DEL key [key ...]
  删除字符串键及值
- MSET key value [key value ...]
  一次为多个字符串键设置值
- MGET key [key ...]
  一次获取多个字符串键的值
- MSETNX key value [key value ...]
  只在键不存在的情况下，一次为多个字符串键设置值
- STRLEN key
  获取字符串值的字节长度
- GETRANGE key start end
  获取字符串值指定索引范围上的内容
- SETRANGE key index substitute
  对字符串值的指定索引范围进行设置
- APPEND key suffix
  追加新内容到值的末尾
- INCRBY key increment
  对整数值进行加法操作
- DECRBY key decline
  对整数值进行减法操作
- INCR key
  对整数值执行加1操作
- DECR key
  对整数值执行减1操作
- INCRBYFLOAT key increment
  对数字值执行浮点数加法或减法操作（小数位不超过17位，超过部分将被截断）

## 散列

- HSET hash field value
  为散列中的字段设置值或者更新值
- HSETNX hash field value
  只在字段不存在时为它设置值
- HGET hash field
  获取字段的值
- HINCRBY hash field increment
  对字段存储的整数值执行加法或减法操作
- HINCRBYFLOAT hash field increment
  对字段存储的数字值执行浮点数加法或减法操作
- HSTRLEN hash field
  获取字段值的字节长度
- HEXISTS hash field
  检查字段是否存在
- HDEL hash field
  删除字段
- HLEN hash
  获取散列包含的字段数量
- HMSET hash field value [field value ...]
  一次性为多个字段设置值，或者一次为多个字段赋新值
- HMGET hash field [field ...]
  一次获取多个字段的值
- HKEYS hash
  获取所有字段
- HVALS hash
  获取所有值
- HGETALL hash
  获取所有字段和值

## 列表

- LPUSH list item [item item ...]
  将一个或多个元素推入列表左端
- RPUSH list item [item item ...]
  将一个或多个元素推入列表右端
- LPUSHX list item
  将一个元素推入一个已存在的列表的左端
- RPUSHX list item
  将一个元素推入一个已存在的列表的右端
- LPOP list
  弹出列表最左端的元素
- RPOP list
  弹出列表最右端的元素
- RPOPLPUSH source target
  将source右端弹出一个元素并放入target的最左端，允许source与target是同一个列表
- LLEN list
  获取列表的长度
- LINDEX list index
  获取指定索引上的元素
- LRANGE list start end
  获取指定索引范围上的元素，包括起始位置上的元素
- LSET list index new_element
  为指定索引设置新元素
- LINSERT list BEFORE|AFTER target_element new_element
  将新元素插入到目标元素的前面或者后面
- LTRIM list start end
  移除列表中起止索引之外的所有元素，不包括起止索引位置
- LREM list count element
  从列表中移除指定元素
  - `count = 0`，移除列表中所有该元素
  - `count > 0`，从列表最左端开始，移除前count个目标元素
  - `count < 0`，从列表最右端开始，移除前`abs(count)`个目标元素 
- BLPOP list [list ...] timeout
  接收一个秒级精度的超时时限、多个列表作为参数，阻塞式地按照列表从左至右的顺序LPOP该列表，如果都为空，则阻塞执行该命令的客户端timeout秒，或者中途有某个列表被推入了数据。
- BRPOP list [list ...] timeout
- BRPOPLPUSH source target timeout
  阻塞式地从source列表中RPOP然后LPUSH到target，如果source为空，则等待数据推入sorce，或等待timeout时间。

## 集合

- SADD set element [element ...]
  将一个或多个元素添加到集合中，会忽略重复元素
- SREM set element [element ...]
  从集合中移除一个或多个元素，会忽略不存在元素
- SMOVE source target element
  将元素从source集合移动到target集合，忽略不存在元素，覆盖已存在元素。
- SMEMBERS set
  获取集合中所有的元素
- SCARD set
  获取集合包含的元素数量
- SISMEMBER set element
  检查给定的元素是否存在于集合中
- SRANDMEMBER set [count]
  随机获取集合中的元素，如果count不传，默认一个。如果传了count：当count为正数时，返回count个不重复的要素，如果count大于集合大小，返回整个集合；如果count为负数，则返回绝对值个允许重复的元素，及会重复返回某个元素，此时如果绝对值大于set大小，也会返回绝对值个元素。
- SPOP set [count]
  随机从集合中移除指定数量的元素。count必须为正数。
- SINTER set [set ...]
  对集合进行交集运算
- SINTERSTORE destination_set set [set ..]
  对集合进行交集运算，并将结果存储到destination_set中，如果结果中的某个元素已存在，则会先删除已存在元素。
- SUNION set [set ...]
  对集合进行并集运算
- SUNIONSTORE destination_set set [set ...]
  对集合进行并集运算，并将结果以覆盖方式存放到destination_set中
- SDIFF set [set ...]
  对集合进行差集运算
- SDIFFSTORE destination_set  set [set...]
  对集合进行差集运算，并将结果以覆盖的形式存储到destination_set中

## 有序集合

- ZADD sorted_set [xx|nx|ch] sore member [score member ...]
  向有序集合中添加成员变量或者更新成员变量的分值。当指定XX的情况，只更新已存在的值的分值，不新增元素；当指定NX的情况，只新增元素，不更新已存在的元素的分值。当指定CH的情况，返回被修改（新添加以及被更新的）的成员的数量，否则默认返回新添加的成员的数据。
- ZREM sorted_set member [member...]
  移除指定的成员
- ZSCORE sorted_set member
  获取指定成员的分值
- ZINCRBY sorted_set increment member
  对指定元素的分数进行自增或自减指定值的操作
- ZCARD sorted_set
  获取有序集合的大小
- ZRANK sorted_set member
  获取成员在有序集合中的排名，升序排序
- ZREVRANK sorted_set member
  获取成员在有序集合中的排名，降序排列
- ZRANGE sorted_set start end [withscores]
  升序顺序下，从有序集合中获取指定索引形成的闭区间上的内容（可以配置是否返回分数）
- ZREVRANGE sorted_set start end [withscores]
  降序顺序下，从有序集合中获取指定索引形成的闭区间上的内容（可以配置是否返回分数）
- ZRANGEBYSCORE sorted_set min max [withscores] [limit offset count]
  升序排序下，获取指定分数范围内（包含指定分数）的成员，可以配置是否返回分数，也可以配置返回的个数，其中offset表示需要跳过前n个，count表示需要返回n个。在min或max前加`(`可以表示不包含。也可以使用 `+inf、-inf`表示正无穷和负无穷
- ZREVRANGEBYSCORE sorted_set max min [withscores] [limit offset count]
  降序排序下，获取指定分数范围内（包含指定分数）的成员，可以配置是否返回分数，也可以配置返回的个数，其中offset表示需要跳过前n个，count表示需要返回n个。在min或max前加`(`可以表示不包含。也可以使用 `+inf、-inf`表示正无穷和负无穷
- ZCOUNT sorted_set min max
  统计指定分值范围内的成员数量，可以使用开区间（加`(`）或使用`+inf、-inf`
- ZREMRANGEBYRANK sorted_set start end
  从升序排列的有序集合中移除位于指定排名范围内（索引范围）的成员，并返回移除的数量
- ZREMRANGEBYSCORE sorted_set min max
  从有序集合中移除位于指定分数范围内的成员，并返回被移除的数量，支持开区间和正负无穷表示
- ZUNIONSTORE destination numbers sorted_set [sorted_set ...] [WEIGHTS weight [weight ...]]  [AGGREGATE SUM|MIN|MAX] 
  计算有序集合的并集，numbers参数用于指明参与计算的有序集合的个数，计算结果存储到destination中，使用权重，来指定每个有序集合按什么比例的分数进行运算，使用aggregate来指定分数的聚合方式。也可以使用普通集合作为输入，此时，该普通集合被视作一个每位成员的分数都是1的有序集合。
- ZINSERTSTORE destination numbers sorted_set [sorted_set ...] [WEIGHTS weight [weight ...]]  [AGGREGATE SUM|MIN|MAX] 
  计算有序集合的交集
- ZRANGEBYLEX sorted_set min max [LIMIT offset count]
  从字典序排列的有序集合中获取位于字典序指定范围内的成员。其中min、max的取值如下
  1. 带有`[`符号的值，表示在结果中包含与给定值具有同等字典序大小的成员
  2. 带有`(`符号的值，表示在结果中不包含与给定值具有同等字典序大小的成员
  3. 加号`+`表示无穷大
  4. 减号`-`表示无穷小
- ZREVRANGEBYLEX sorted_set max min [LIMIT offset count]
  已字典逆序的方式返回指定范围内的成员
- ZLEXCOUNT sorted_set min max
  统计位于字典序指定范围内的成员数量
- ZREMRANGEBYLEX sorted_set min max
  移除位于字典序指定范围内的成员
- ZPOPMAX sorted_set [count]
  移除并返回有序集合中分值最大的N个元素
- ZPOPMIN sorted_set [count]
  移除并返回有序集合中分值最小的N个元素
- BZPOPMAX sorted_set [sorted_set ...] timeout
  阻塞式弹出所给的有序集合中第一个不为空的集合的分值最大的一个元素，如果都没有，则阻塞执行命令的客户端timeout秒
- BZPOPMIN sorted_set [sorted_set ...] timeout
  阻塞式弹出所给的有序集合中第一个不为空的集合的分值最小的一个元素，如果都没有，则阻塞执行命令的客户端timeout秒

## HyperLogLog

- PFADD key element [element ...]
  使用给定的key对给定的一个或多个集合元素进行计数。如果给定的所有元素都已经进行过计数，返回0，表示HyperLogLog计算出的近似基数没有发生变化。如果给定的元素中出现了至少一个之前没有进行过计数的元素，导致HyperLogLog计算出的近似基数发生了变化，返回1。
- PFCOUNT key [key ...]
  获取key为集合计算出的近似基数，当有多个key时，对所给定的多个key执行并集计算，并返回对结果集的近似基数的计算值，具体过程如下：
  1. 内部调用PFMERGE命令，并将结果并集保存在一个临时的HyperLogLog中
  2. 对临时的HyperLogLog执行PFCOUNT命令
  3. 删除临时HyperLogLog
  4. 向客户端返回PFCOUNT命令得到的近似基数
- PFMERGE destination key [key ...]
  对多个给定的key执行并集运算，然后把计算得出的并集保存在指定的键中。



## 位图

- SETBIT bitmap offset value
  为位图指定偏移量上的二进制位设置值，并返回旧值。如果offset比当前位图的大小要大，那么会对位图进行扩展，Redis对位图的扩展是以字节为单位的，且会将所有未被设置值的二进制位初始化为0。位图的偏移量只能为正数。
- GETBIT bitmap offset
  获取二进制位的值，如果offset超出位图大小，则返回0
- BITCOUNT key [start end]
  统计位图中被设置为1的二进制位数量，可以指定范围，该范围为字节偏移量，不是二进制位偏移量。
- BITPOS bitmap value [start end]
  在位图中查找第一个被设置为指定值的二进制位，返回该偏移量，可以指定范围，该范围为字节偏移量，不是二进制位偏移量。
- BITOP operation result_key bitmap [bitmap ...]
  对一个或多个位图执行指定的二进制位运算，并将运算结果存储到指定的键中。运算可以是 AND、OR、XOR、NOT中的任意一个。前三个可以使用任意数量的位图作为输入，NOT只能使用一个位图作为输入。当输入的位图长度不一时，短的位图不存在的位置补0
- BITFIELD
  在位图中存储整数值

## 地理坐标

- GEOADD location_set longitude latitude name [longitude latitude name ...] 
  将给定的一个或多个经纬度坐标存储到位置集合中，并为这些坐标设置相应的名字。
- GEOPOS location_set name [name...] 
  获取位置集合中指定名字的经纬度信息
- GEODIST location_set name1 name2
  计算位置集合中地名1与地名2的直线距离
- GEORADIUS location_set longitude latitude radius unit [WITHDIST] [WITHCOORD] [WITHHASH] [ASC|DESC] [COUNT n]
  指定一个经纬度作为中心，查找位置集合中位于中心点指定半径范围内的其他位置
  - location_set：指定执行查找操作的位置集合
  - longitude：经度
  - latitude：纬度
  - radius：指定查找半径
  - unit：指定查找半径的单位，值为{m（米）、km（千米）、mi（英里）、ft（英尺）}
  - WITHDIST：配置该参数，不仅返回位置名称，还会返回距离中心点的距离
  - WITHCOORD：配置该参数，不仅返回位置名称，还会返回位置的经纬度
  - WITHHASH：配置该参数，不仅返回位置名称，还会返回位置的经纬度的GeoHash值（数字形式）
  - ASC|DESC：配置该参数，返回的结果会按照距离中心点的距离排序，asc由近到远，desc由远到近。
  - COUNT：限制返回的数量
- GEORADIUSBYMEMBER location_set name radius unit [WITHDIST] [WITHCOORD] [WITHHASH] [ASC|DESC] [COUNT n]
  指定位置集合中的一个位置作为中心点，查找位置集合中位于指定中心点指定半径范围内的其他位置，包括指定的中心位置。
- GEOHASH  location_set name [name ...]
  根据传入的位置集合以及集合中的一个或者多个位置名称计算并返回这些位置对应的经纬度坐标的GeoHash值。与WITHHASH选项不同的是，该命令返回的是被解释成字符串形式的Geohash值，WITHHASH返回的是被解释成数字的GeoHash值，但是这两个值的底层的二进制位是完全相同的。

## 流

- XADD stream [MAXLEN len] id field value [field value ...]
  该命令将一个带有指定ID以及包含指定键值对的元素追加到流的末尾，如果流不存在，则创建一个流。id可以为`*`，Redis会自动生成一个符合规范的ID。

  - MAXLEN：配置该参数，用来在新增元素之后，限制流的读不能超过指定长度，如果超过了，则会删除最早进入流中的元素（先进先出规则）。

- XTRIM stream MAXLEN len
  将流修剪至指定长度，先进先出原则。

- XDEL stream [id id ....]
  该命令接受一个流以及任意多个元素ID作为输入，并从流中移除ID对应的元素。

- XLEN stream
  获取流中包含的元素的数量

- XRANGE stream start-id end-id [count n]
  读取从指定stream中的起始ID开始，到结束ID，包括起始ID和结束ID，配置count，返回有限个元素。

- XREVRANGE stream end-id start-id [count n]
  逆序读取，从指定stream中的结束ID开始，到起始ID，包括起始ID和结束ID，配置count，返回有限个元素。

- XREAD [BLOCK ms] [COUNT n] STREAMS stream1 stream2 ... id1 id2 ...
  从给定的所有流中取出所有比给定ID大的元素，如果配置了COUNT，则限制取出元素个数；配置BLOCK选项，则进入阻塞执行模式：

  1. 如果给定的流中，存在能够获取数据的流，则无论是否所有流都满足，该命令不阻塞

  2. 如果给定的所有流都不存在可获取数据，则进入阻塞状态，如果在阻塞时间内，有任意一个流中出现了一个可获取的元素，则该命令将该元素推送给所有因此而阻塞的客户端，并解除阻塞，此时只推送这一个元素，不受COUNT的限制

  3. 如果阻塞时间结束还没能获取元素，则返回空

  4. 可以使用`$`符号占用ID位置，这样该命令会返回执行该阻塞模式命令后新增加的元素
     ```shell
     XREAD BLOCK 100000 STREAMS bs1 bs2 $ $
     ```

- XGROUP CREATE stream group start_id
  在流中创建一个消费者组

  - stream：指定的流
  - group：消费者组名
  - start_id：指定的起始元素ID（不包含指定元素ID）

- XGROUP SETID stream group id
  为消费者组设置新的最后递送的消息ID

- XGROUP DELCONSUMER stream group consumer
  删除某个消费者组下的指定消费者，在删除消费者时，消费者正在处理的消息也会被删除，这些消息可能还未处理完，所以需要谨慎删除消费者。

- XGROUP DESTROY stream group
  删除消费者组

- XREADGROUP GROUP group consumer [COUNT n] [BLOCK ms] STREAMS stream [stream ...] id [id ...]
  指定消费者consumer读取消费者组group的消息
  
- XREADGROUP GROUP group consumer [COUNT n] STREAMS stream >
  获取stream流的消费者组group的最后递送消息的ID
  
- XPENDING stream group [start stop count] [consumer]
  获取指定流的指定消费者组目前的待处理消息的相关信息
  
  - start：指定消息ID的最小值，可以使用`-`表示最小值
  - stop：指定消息ID的最大值，可以使用`+`表示最大值
  - count：指定返回的限制数量
  - consumer：指定哪个消费者的待处理消息
  
- XACK stream group id [id ...]

  将消费者组中的指定消息标记为已处理，被标记的消息将从当前消费者的待处理消息队列中移除，之后执行的XREADGROUP命令再也不会再读取这些消息。

- XCLAIM stream group new_consumer max_pending_time id [id ...] [JUSTID]
  将指定消息的归属权从一个消费者转向另一个消费者

  - stream：指定消息所在的流
  - group：指定消息所在的消费者组
  - new_consumer：指定消息的新消费者
  - max_pending_time：指定执行归属权转移操作所需的最大消息处理时限（从消费者组将消息送到原消费者开始，到XCLAIM命令执行为止，所用的时间总长）
    1. 如果XCLAIM命令执行时，消息原来的消费者用在处理该消息上的时间已经超过了指定的时限，那么归属权转移操作就会被执行
    2. 如果为超过，或者该消息已经被原消费者确认，那么归属权转移操作将被放弃执行
  - JUSTID：该配置标识执行成功后只返回消息ID

- XINFO CONSUMERS stream gropu-name
  打印指定消费者组的所有消费者，以及这些消费者的相关信息，包括消费者的名字，正在处理的消息数量以及消费者的闲置时长

- XINFO GROUPS stream
  打印与给定流相关的所有消费者组以及这些消费者组的相关信息，包括消费者组的名字，拥有的消费者数量，组中正在处理消息的数量以及该组最后递送消息的ID

- XINFO STREAM stream
  打印给定流的相关信息