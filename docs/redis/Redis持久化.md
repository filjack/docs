# Redis持久化

## RDB

> Redis Database Backup file（Redis数据备份文件），也叫Redis数据快照。简单来说就是把内存中的所有数据都记录到磁盘中，当Redis实例故障重启之后，从磁盘读取快照文件，恢复数据。

快照文件称为RDB文件，默认是保存在当前运行的目录。通过`SAVE`命令执行，是由Redis主进程来执行的，会阻塞所有命令。

也可以使用`bgsave`，该命令开启一个子进程执行RDB，避免主进程受到影响。

Redis在正常停机（如使用`ctrl + C`停止服务器）会自动备份。也可以通过`redis.conf`配置自动备份策略。

## AOF

> Append Only File（追加文件）。Redis处理的每一个写命令都会记录在AOF文件中，可以看做是命令日志文件。

AOF默认关闭，可以通过配置`redis.conf`来开启并进行配置。

因为AOF记录命令，文件会比RDB文件大的多。而且AOF会记录对同一个key的多次写操作，但只有最后一次写操作才有意义。通过执行`bgrewriteaof`命令，可以让AOF文件执行重写功能，用最少得命令达到最大的效果。