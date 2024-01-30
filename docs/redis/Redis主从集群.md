# Redis主从集群

从节点一般承担读取的请求，主节点一般承担写入的请求

设置主从关系，使用`slaveof`（5.0之前使用）

## 全量同步

主从第一次数据同步是全量同步（从节点第一次执行slaveof命令时）

### 第一阶段

从节点执行slaveof（replicaof）命令后，同时向主节点发送请求，请求同步数据，请求中携带replid，主节点判断是否是第一次同步，如果是则先返回主节点的数据版本信息，同时携带该master的replid，从节点保存数据版本信息。



ReplicationId：简称为replid，是数据集的标记，id一致说明是同一个数据集。每个master都有唯一的replid，slave则会继承master节点的replid

offset：偏移量，随着记录在repl_baklog中的数据增多而逐渐增大，slave完成同步时也会记录当前同步的offset。如果slave的offset小于master的offset，说明slave数据落后于master，需要更新。



### 第二阶段

主节点向从节点返回数据版本信息之后，开始执行bgsave命令，由于bgsave命令是异步的，在此期间，主节点所有新收到的写入命令会被集中存储到repl_baklog文件中。当bgsave命令执行完毕，主节点将生成的rdb文件发送至从节点，从节点清空本地数据，加载rdb文件

### 第三阶段

主节点发送repl_baklog中的命令给从节点，从节点执行接收到的命令，此时，每当主节点执行一次写入命令，都会发送到从节点并执行。



## 增量同步

主从第一次同步是全量同步，但如果slave重启后同步，则执行增量同步



### 第一阶段

从节点重启后，执行slaveof命令，同时向主节点发送请求同步数据，携带自身保存的replid以及offset，主节点判断该replid跟自身的是否一致，如果一致，则返回continue。

### 第二阶段

主节点从repl_baklog中获取offset后的数据，并发送至从节点并执行

repl_baklog大小有上限，该文件是环状数据结构，写满后会覆盖掉最早的数据。如果slave断开时间过久，导致尚未备份的数据被覆盖，则无法基于log做增量备份，只能再次做全量备份

## 优化

- 在master中配置repl-diskless-sync yes启用无磁盘复制，避免全量同步时磁盘IO，但是要求网络带宽很大，否则会导致网络阻塞
- redis单节点上的内存占用不要太大，减少rdb导致的过多磁盘io
- 适当提高repl_baklog的大小，发现slave宕机时尽快实现故障恢复，尽可能避免全量同步
- 限制一个master上的slave节点数量，如果实在有太多slave，则可以采用主-从-从链式结构，减少maser压力

