# Mybatis

Mybatis是一款支持自定义SQL查询、存储过程和高级映射的持久层框架。

## 特点

1. 消除了几乎所有的JDBC代码和参数的手动设置以及结果集的检索。
2. 可以使用XML或注解进行配置和映射
3. 通过将参数映射到配置的SQL中，形成最终执行的SQL，并将执行结果映射成java对象返回
4. 支持声明式数据缓存。当一条SQL语句被标记为“可缓存”后，首次执行它时从数据库获取的所有数据会被存储到高速缓存中，后面再执行这条语句时就会从高速缓存中读取结果，而不是再次命中数据库。

## 对比其他ORM框架

Mybatis没有将java对象与数据库表关联起来，而是将java方法与SQL语句关联。这样方便用户充分利用数据库的各种功能（例如，存储过程、视图、复杂查询语句以及数据库的专有特性）。

> 如果要对遗留数据库、不规范的数据库进行操作，或是要完全控制SQL的执行，Mybatis很实用

## 对比JDBC

1. 简化相关代码
2. 提供了一个映射引擎，声明式地将SQL语句的执行结果与对象树映射起来
3. 使用内建的类XML表达式语言，SQL语句可以被动态地生成

## 缓存

### 实现方式

> 提供了默认情况下基于HashMap，以及用于与OSCache、Ehcache、Hazelcast、Memcached连接的默认连接器，同时还提供了API供其他缓存实现使用

## 配置

### XML配置方式

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
</configuration>
```

## SQL执行原理

### v2.0

使用`SqlSession`通过命名空间调用Mybatis方法，首先需要用到命令空间和方法id组成的字符串来调用相应的方法。当参数多余1个的时候，需要将所有的参数放到一个Map对象中来传递。

```xm
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="tk.mybatis.simple.mapper.CountryMapper">
    <select id="selectAll" resultType="Country">
        select id,countryname,countrycode from country
    </select>
</mapper>
```

单独使用xml的方式，`CountryMapper`没有对应的接口类。在调用时，需要提供相应的`id`

```java
    @Test
    public void testSelectAll() {
        try (SqlSession session = sqlSessionFactory.openSession()) {
            List<Country> list = session.selectList("selectAll");
            printCountryList(list);
        }
    }
```



### v3.0

使用接口调用方式，通过利用java的动态代理可以直接通过接口来调用相应的方法，不需要提供接口的实现类，更不需要在实现类中使用`SqlSession`以通过命名空间调用。当有多个参数的时候，通过参数注解`@Param`设置参数的名字，省去了手动构建Map参数的过程。在`Spring`中使用的时候，可以配置为自动扫描所有的接口类，直接将接口注入需要用到的地方。

## 使用注意

1. mybatis对于结果的映射默认采用下划线转驼峰，所以如果数据库字段是下划线，那么对应的实体类应该是驼峰格式

2. 由于java中对于基本类型会有默认值，例如`private int age`默认值是0，所有在动态SQL里面的 `age != null`判断永远不成立，要注意。

3. 在对查询结果进行映射时，对于不常用的类型建议指定`jdbcType`，例如`BLOB`，这个类型一般对应`java`中的`byte[]`。插入时也是
   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
   <mapper namespace="tk.mybatis.simple.mapper.SysUserMapper">
       <insert id="insert">
           insert into sys_user(id,user_name,user_password,user_email,user_info,head_img,create_time)
           values(#{id}, #{userName}, #{userPassword}, #{userEmail}, #{userInfo}, #{headImg, jdbcType=BLOB}, #{createTime, jdbcType=TIMESTAMP})
       </insert>
   </mapper>
   ```

   
