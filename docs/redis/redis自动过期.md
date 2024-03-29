# 自动过期

Redis提供的自动的键过期功能，用户可以让特定的键在指定的时间之后自动被移除。

## 常用命令

### 设置生存时间

```shell
EXPIRE key seconds
```

设置秒级精度的生存时间，让键在指定的秒数之后自动被移除。当键存在生存时间时，则是更新该键的生存时间

```shell
PEXPIRE key milliseconds
```

设置毫秒级的生存时间，让键在指定的毫秒数后自动被移除。当键存在生存时间时，则是更新该键的生存时间

可以单独使用`SET`命令来完成上述两个命令

```shell
SET key value [EX seconds] [PX milliseconds]
```

直接使用带有EX或PX配置的SET命令，不仅不用将SET和EXPIRE/PEXPIRE命令组合起来使用，提高了程序的执行速度；同时也保证了操作的原子性，这样就不会出现，我们执行了SET命令，但是在执行EXPIRE命令之前，该服务器因故障下线导致命令未能执行，那么这个键将可能长期存在。

### 设置过期时间

```shell
EXPIREAT key seconds_timestamp
```

设置一个秒级精度的UNIX时间戳，当系统的当前UNIX时间超过命令指定的UNIX时间时，该键会被移除。当键已有过期时间时，该命令会更新键的过期时间。

```shell
PEXPIREAT key milliseconds_timestamp
```

设置一个毫秒级精度的UNIX时间戳，当系统的当前UNIX时间超过命令指定的UNIX时间时，该键会被移除。当键已有过期时间时，该命令会更新键的过期时间。



### 获取键的剩余生存时间

在设置了键的生存时间或者过期时间之后，可以查看该键的剩余生存时间。

```shell
TTL key
```

该命令将以秒级单位返回键的剩余生存时间。使用该命令时，可能会出现返回0的情况，这是由于该命令的时间精度为秒级，如果剩余生存时间不足一秒，则返回0。

```shell
PTTL key
```

该命令将以毫秒级单位返回键的剩余生存时间

如果给定键不存在，则返回-2，如果给定键存在，但是未设置生存时间或者过期时间，则返回-1。



## 使用注意

1. 自动过期，只能对整个键进行设置，无法对键中的某个元素进行设置。比如只能对整个散列或者集合的键设置自动过期，但是无法对散列的某个Field或者集合的某个元素进行设置