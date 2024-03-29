# 缓存

> 是数据交换的缓冲区（cache），是一个临时存储数据的地方，一般读写性能较高，将数据存到redis数据库中来实现缓存。

## 基本概念

### 作用

- 降低后端负载
- 提高读写效率、降低响应时间

### 成本

- 数据一致性成本
- 运维成本

## 缓存更新策略

### 内存淘汰

#### 基本概念

redis内部机制，当redis判断当前内存不足时会触发，该机制会淘汰掉部分数据。

#### 一致性

一致性较差，因为每次触发改机制所淘汰的数据由redis自己决定，可能会存在部分数据一直未被淘汰的情况，此时这部分数据可能与存储介质中数据差距很大了。

#### 维护成本

因为改机制为redis内部机制，基本没有什么维护成本

### 超时删除

#### 基本概念

给数据添加TTL，时间到期后自动删除。

#### 一致性

一致性较内存淘汰高，但是也是一般

#### 维护成本

TTL是存放数据时人为设置的，维护成本很低

### [主动更新](./主动更新.md) 

#### 基本概念

编写逻辑，在更改介质中的数据时，同时更新缓存中的数据

#### 一致性

一致性较超时删除高

#### 维护成本

需要编写一定的同步逻辑，维护成本较高

### 应用场景

- 低一致性场景下，紧靠内存淘汰机制即可
- 高一致性场景下，通过主动更新，并辅以超时删除进行兜底（如果主动更新失败，还可以通过超时删除数据，防止缓存中的数据长时间不更新）



## [缓存穿透](./缓存穿透.md) 

## [缓存雪崩](./缓存雪崩.md) 

## [缓存击穿](./缓存击穿.md) 