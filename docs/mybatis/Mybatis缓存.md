# 缓存

## 一级缓存

> 也叫做本地缓存，默认启用并且不能控制

- ①、一级缓存存在于整个`SqlSession`声明周期中，在同一个`SqlSession`中**查询**时，会把执行的方法和参数通过某种算法生成缓存的键，将键与查询结果存入一个Map中

- ②、基于①可知，在同一个`SqlSession`中，多次调用同一个方法进行参数相同的查询时，返回的对象一直是同一个

- ③、禁用一级缓存，`flushCache="true"`会清空当前的一级缓存
  ```xml
      <select id="selectById" flushCache="true" resultMap="userMap">
          select id,user_name,user_password,user_email,user_info,head_img,create_time from sys_user
          where id = #{id}
      </select>
  ```

- ④、同一个`SqlSession`中，任何insert、update、delete方法都会清空当前`SqlSession`的一级缓存

## 二级缓存

> 存在于`SqlSessionFactory`的生命周期中，且与`SqlSessionFactory`对象绑定。当存在多个`SqlSessionFactory`对象时，每个对象绑定的缓存各不相通。只有当`SqlSession`关闭的时候，该`SqlSession`才会将查询到的数据保存到二级缓存中

1. 二级缓存与对应的Mapper接口或XML绑定，且不同的接口或XML间缓存不互通。
2. 引用其他Mapper的缓存，被引用的Mapper必须配置开启缓存（不支持传递依赖，如A、B、C三个mapper，C配置开启缓存，A引入B，B引用C，这种写法会直接报错，提示B没有配置开启缓存）
3. 如果一个mapper，既配置了开启缓存，有配置了引用缓存，则优先使用引用缓存

### 配置缓存

需要再configuration配置中设置

```xml
    <settings>
        <setting name="cacheEnabled" value="true"/>
    </settings>
```

默认是开启的，如果改为关闭，则无论下面怎么配置二级缓存，都不会生效。

在同一个`SqlSessionFactory`对象的生命周期中，`Mybatis`的**二级缓存与命名空间**是绑定的。

#### `xml`配置

需要使用`<cache/>`标签

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="tk.mybatis.simple.mapper.SysRoleMapper">
    <cache/>
</mapper>
```

- eviction（回收策略）
  1. LRU（最近最少使用）
  2. FIFO（先进先出）
  3. SOFT（软引用）：移除基于垃圾回收器状态和软引用规则的对象
  4. WEAK（弱引用）：更积极地移除基于垃圾回收器状态和软引用规则的对象
- flushInterval（刷新间隔），正整数，代表毫秒。默认不设置，仅仅在调用语句时刷新
- size（引用数目）
- readOnly（只读）

#### 注解配置

需要使用@`CacheNamespace`注解

```java
@CacheNamespace
public interface SysUserMapper {
    
}
```

#### 注意

1. 可以在接口中使用`@CacheNamespaceRef(value = SysUserMapper.class)`表示引用其他接口或XML配置的缓存，也可以在XML中使用`<cache-ref namespace="tk.mybatis.simple.mapper.SysUserMapper"/>`来引用接口或者其他XML配置的缓存
2. 对于只存在于接口中的方法（接口上使用注解的方式进行数据库操作），要想使用二级缓存，需要在接口上使用相应注解；反之，对于只存在于XML中的方法，亦然。（不可能一个方法同时存在于接口和XML中，因为命名空间相同，id相同，则该方法的唯一key就是相同的）
3. 对于部分方法存在于接口中（使用注释形式），部分方法存在于XML中，则接口和XML需要一个配置开启缓存，另一个配置引用缓存
4. 对应的接口和XML，只能有一个配置了缓存，即，如果接口使用`@CacheNamespace`，XML中禁止使用`<cache/>`标签。
5. 配置可读写缓存，意味着每次获取缓存的数据是独立的一份，Mybatis采用序列化与反序列化来实现每次获取缓存得到一个新的对象（要求实体对象实现了序列化接口（`Serializable`））
6. 配置只读缓存，Mybatis采用Map进行存储，每次读出的缓存的对象是同一个实例

### 作用

1. 配置了二级缓存的映射文件或接口中，所有的SELECT语句会被缓存
2. 配置了二级缓存的映射文件或接口中，所有的UPDATE、INSERT、DELETE语句会刷新缓存