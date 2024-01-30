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

## 动态代理

Mybatis中的mapper接口利用java的动态代理机制，使得调用接口中的方法被代理为调用xml中有`namespace + id`唯一确定的sql方法。

```java
// 代理实现
package tk.mybatis.simple.proxy;

import org.apache.ibatis.session.SqlSession;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.List;

/**
 * @author xpf
 * @since 2023/8/28
 */
public class MyMapperProxy<T> implements InvocationHandler {

    private Class<T> mapperClass;
    private SqlSession session;

    public MyMapperProxy(Class<T> tClass, SqlSession session) {
        this.mapperClass = tClass;
        this.session = session;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println(mapperClass.getCanonicalName() + "." + method.getName());
        List<Object> objectList = session.selectList(mapperClass.getCanonicalName() + "." + method.getName());
        return objectList;
    }
}

```

```java
// 测试方法
package tk.mybatis.simple.proxy;

import org.apache.ibatis.session.SqlSession;
import org.junit.Test;
import tk.mybatis.simple.mapper.BaseMapperTest;
import tk.mybatis.simple.mapper.SysUserMapper;
import tk.mybatis.simple.model.SysUser;

import java.lang.reflect.Proxy;
import java.util.List;

/**
 * @author xpf
 * @since 2023/8/28
 */
public class MyMapperProxyTest extends BaseMapperTest {

    @Test
    public void testMyMapperProxy() {
        SqlSession session = getSqlSession();
        MyMapperProxy proxy = new MyMapperProxy(SysUserMapper.class, session);
        SysUserMapper instance = (SysUserMapper) Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(), new Class[]{SysUserMapper.class}, proxy);
        List<SysUser> users = instance.selectAll();
        System.out.println(users);
    }

}

```

```java
// mapper接口
public interface SysUserMapper {
	List<SysUser> selectAll();
}
```

```xml
<!--mapper对应的xml文件-->
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="tk.mybatis.simple.mapper.SysUserMapper">
    <select id="selectAll" resultType="tk.mybatis.simple.model.SysUser">
        select
        id,
        user_name userName,
        user_password userPassword,
        user_email userEmail,
        user_info userInfo,
        head_img headImg,
        create_time createTime
        from sys_user
    </select>
</mapper>
```



## [缓存](./Mybatis缓存.md)

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

### Mapper配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="tk.mybatis.simple.mapper.SysUserMapper">
</mapper>
```

## 注解使用

### @Param注解

使用该注解，该注解会将value属性当做Map的键，并将被标注的值作为Map该键的值，并以此构建Map。

```java
    List<SysRole> selectRolesByUserIdAndEnabled(@Param("userId") Long userId, @Param("enabled") Integer enabled);

```

```xml
    <select id="selectRolesByUserIdAndEnabled" resultType="tk.mybatis.simple.model.SysRole">
        select
        sr.id,
        sr.role_name roleName,
        sr.enabled,
        sr.create_by createBy,
        sr.create_time createTime
        from sys_user su
        left join sys_user_role sur on sur.user_id = su.id
        left join sys_role sr on sur.role_id = sr.id
        where su.id = #{userId} and sr.enabled = #{enabled}
    </select>
```

当使用复杂javaBean作为参数，却还需要该对象中的某个属性时，可以使用 `Object.Property`的方式

```java
    List<SysRole> selectRolesByUserAndRole(@Param("user") SysUser user, @Param("role") SysRole role);

```

```xml
    <select id="selectRolesByUserAndRole" resultType="tk.mybatis.simple.model.SysRole">
        select
        sr.id,
        sr.role_name roleName,
        sr.enabled,
        sr.create_by createBy,
        sr.create_time createTime
        from sys_user su
        left join sys_user_role sur on sur.user_id = su.id
        left join sys_role sr on sur.role_id = sr.id
        where su.id = #{user.id} and sr.enabled = #{role.enabled}
    </select>
```

#### 默认参数名

对于未使用`@Param`来标注参数的值，Mybatis取默认参数名。

1. 接口中有多个参数，并且未标注`@Param`注解，可以使用arg或param来获取，其中使用arg时，是根据参数列表倒序赋值，例如

   ```java
       List<SysRole> selectRolesByUserIdAndEnabled(Long userId, Integer enabled);
   
   ```

   ```xml
       <select id="selectRolesByUserIdAndEnabled" resultType="tk.mybatis.simple.model.SysRole">
           select
           sr.id,
           sr.role_name roleName,
           sr.enabled,
           sr.create_by createBy,
           sr.create_time createTime
           from sys_user su
           left join sys_user_role sur on sur.user_id = su.id
           left join sys_role sr on sur.role_id = sr.id
           where su.id = #{arg1} and sr.enabled = #{arg0}
       </select>
   ```

   其中arg1对应userId，arg0对应enabled，序号从0开始。
   若使用param，则根据参数列表正序排列，序号从1开始，例如

   ```xml
       <select id="selectRolesByUserIdAndEnabled" resultType="tk.mybatis.simple.model.SysRole">
           select
           sr.id,
           sr.role_name roleName,
           sr.enabled,
           sr.create_by createBy,
           sr.create_time createTime
           from sys_user su
           left join sys_user_role sur on sur.user_id = su.id
           left join sys_role sr on sur.role_id = sr.id
           where su.id = #{param1} and sr.enabled = #{param2}
       </select>
   ```

   其中param1对应userId，param2对应enabled。

2. 对于集合情况，默认都可以取arg0来获取（map是_parameter），但是也可以细分

   - List：默认是list

   - Collection（除了List）：默认是collection

   - Array：默认是array

   - Map，
     `Map<String, List<Long>>`如果不指定`@Param`，xml中collection属性值必须对应map中的键

     ```java
     List<SysUser> selectByIdMap(Map<String, List<Long>> map);
     ```

     ```java
         @Test
         public void testSelectByIdMap() {
             try (SqlSession session = getSqlSession()) {
                 SysUserMapper mapper = session.getMapper(SysUserMapper.class);
                 List<Long> ids = Arrays.asList(1L, 1001L);
                 Map<String, List<Long>> map = new HashMap<>();
                 map.put("collection", ids);
                 List<SysUser> users = mapper.selectByIdMap(map);
                 Assert.assertNotNull(users);
                 Assert.assertTrue(users.size() > 1);
             }
         }
     ```

     

     ```xml
         <select id="selectByIdMap" resultType="tk.mybatis.simple.model.SysUser">
             select * from sys_user
             where id in
             <foreach collection="collection" item="id" open="(" close=")" separator="," index="i">
                 #{id}
             </foreach>
         </select>
     ```

     `Map<String, Long>`，如果循环的整个对象是map，那么默认值是`_parameter`

     ```java
     List<SysUser> selectByIdMapForIterator(Map<String, Long> map);
     ```

     ```java
         @Test
         public void testSelectByIdMapForIterator() {
             try (SqlSession session = getSqlSession()) {
                 SysUserMapper mapper = session.getMapper(SysUserMapper.class);
                 Map<String, Long> map = new HashMap<>();
                 map.put("array", 1L);
                 map.put("collection", 1001L);
                 List<SysUser> users = mapper.selectByIdMapForIterator(map);
                 Assert.assertNotNull(users);
                 Assert.assertTrue(users.size() > 1);
             }
         }
     ```

     ```xml
         <select id="selectByIdMapForIterator" resultType="tk.mybatis.simple.model.SysUser">
             select * from sys_user
             where id in
             <foreach collection="_parameter" item="key" open="(" close=")" separator=",">
                 #{key}
             </foreach>
         </select>
     ```

   - Bean：默认和属性名一致即可
     ```java
     List<SysUser> selectByIdUseObjectWithoutNest(SelectForObjectParam param);
     ```

     ```java
     public class SelectForObjectParam {
     
         private List<Long> ids;
     
         public List<Long> getIds() {
             return ids;
         }
     
         public void setIds(List<Long> ids) {
             this.ids = ids;
         }
     }
     ```

     ```java
         @Test
         public void testSelectByIdUseObjectWithoutNest() {
             try (SqlSession session = getSqlSession()) {
                 SysUserMapper mapper = session.getMapper(SysUserMapper.class);
                 SelectForObjectParam param = new SelectForObjectParam();
                 param.setIds(Arrays.asList(1L, 1001L));
                 List<SysUser> users = mapper.selectByIdUseObjectWithoutNest(param);
                 Assert.assertNotNull(users);
                 Assert.assertTrue(users.size() > 1);
             }
         }
     ```

     ```xml
         <select id="selectByIdUseObjectWithoutNest" resultType="tk.mybatis.simple.model.SysUser">
             select * from sys_user
             where id in
             <foreach collection="ids" item="id" open="(" close=")" separator=",">
                 #{id}
             </foreach>
         </select>
     ```

     当使用`@Param`时，也可以使用`param.property`，例如`@Param("kk")`，则上述xml可以修改为`kk.ids`，也可不变。
     当使用多层嵌套时，可以多层`.`来获取

     ```java
     List<SysUser> selectByIdUseObjectWithNest(@Param("param") SelectForObjectWithNestParam param);
     ```

     ```java
     public class SelectForObjectParam {
         private List<Long> ids;
     }
     public class SelectForObjectWithNestParam {
         private SelectForObjectParam param;
     }
     ```

     ```java
         @Test
         public void testSelectByIdUseObjectWithNest() {
             try (SqlSession session = getSqlSession()) {
                 SysUserMapper mapper = session.getMapper(SysUserMapper.class);
                 SelectForObjectParam param = new SelectForObjectParam();
                 param.setIds(Arrays.asList(1L, 1001L));
                 SelectForObjectWithNestParam nestParam = new SelectForObjectWithNestParam();
                 nestParam.setParam(param);
                 List<SysUser> users = mapper.selectByIdUseObjectWithNest(nestParam);
                 Assert.assertNotNull(users);
                 Assert.assertTrue(users.size() > 1);
             }
         }
     ```

     ```xml
         <select id="selectByIdUseObjectWithNest" resultType="tk.mybatis.simple.model.SysUser">
             select * from sys_user
             where id in
             <foreach collection="param.param.ids" item="id" open="(" close=")" separator=",">
                 #{id}
             </foreach>
         </select>
     ```

     

### @Flush

当SqlSession执行器类型为批处理类型时，可以通过该注解执行一个方法，方法的返回值为`List<BatchResult>`，来刷新当前已经执行的更新语句（其实并未真正执行到数据库中），使其真正执行到数据库中区。

也可以通过调用`SqlSession#flushStatements`方法

## Provider使用

> 注意Provider类中对应的方法的参数不是必须的，只要SQL返回的正确即可。

### `@SelectProvider`

```java
public interface SysPrivilegeMapper {

    @SelectProvider(type = PrivilegeProvider.class, method = "selectById")
    SysPrivilege selectById(Long id);
}
```

```java
public class PrivilegeProvider {

    public String selectById() {
        return new SQL().SELECT("id", "privilege_name", "privilege_url")
                .FROM("sys_privilege")
                .WHERE("id = #{id}")
                .toString();
    }
}
```



## SQL执行原理

### v2.0

使用`SqlSession`通过命名空间调用Mybatis方法，首先需要用到命令空间和方法id组成的字符串来调用相应的方法。当参数多于1个的时候，需要将所有的参数放到一个Map对象中来传递。

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

## 动态SQL

> 在拼接参数时，${}拼接不能防止SQL注入问题，#{}可以

### OGNL

> 表达式中不会有空指针，所有判空条件在前在后无影响

Object-Graph Navigation Language

表达式的结果皆为true或者false，除此以外所有非0值都为true，只有0为false。经常用在Mybatis的动态SQL或`${}`形式的参数中。

#### 常见表达式

1. e1 or e2
2. e1 and e2
3. e1 == e2 或 e1 eq e2
4. e1 != e2 或 e1 neq e2
5. e1 lt e2（小于）
6. e1 lte e2（小于等于，其他表示为gt（大于）、gte（大于等于））
7. `e1 + e2`、`e1 * e2`、`e1 / e2`、`e1 - e2`、`e1 % e2`
8. !e 或 not e（取反）
9. `e.method(args)`（调用对象方法）
10. `e.property`（对象属性值）
11. e1[e2]（按索引取值，List、数组、map）
12. `@class@method(args)`（调用类的静态方法）
13. `@class@field`（调用类的静态字段）
14. 各种类型数字（包括`BigDecimal`）0与`‘’`进行不相等比较，结果都是false

### `if`

#### 在where中使用

```xml
    <select id="selectByUser" resultType="tk.mybatis.simple.model.SysUser">
        select * from sys_user
        where 1 = 1
        <if test="userName != null and userName != ''">
            and user_name like concat('%',#{userName},'%')
        </if>
        <if test="userEmail != null and userEmail != ''">
            and user_email like concat('%',#{userEmail},'%')
        </if>
    </select>
```

#### 在update中使用

```xml
    <update id="updateByUser">
        update sys_user
        set
        <if test="userName!=null and userName != ''">
            user_name = #{userName},
        </if>
        <if test="userPassword!=null and userPassword != ''">
            user_password = #{userPassword},
        </if>
        <if test="userEmail!=null and userEmail!=''">
            user_email = #{userEmail},
        </if>
        <if test="userInfo!=null and userInfo!=''">
            user_info = #{userInfo},
        </if>
        <if test="headImg != null and headImg != ''">
            head_img = #{headImg, jdbcType=BLOB},
        </if>
        <if test="createTime != null and createTime != ''">
            create_time = #{createTime, jdbcType=TIMESTAMP},
        </if>
        id = #{id}
        where id = #{id}
    </update>
```

#### 在insert中使用

```xml
    <insert id="insertByUser" useGeneratedKeys="true" keyProperty="id" keyColumn="id">
        insert into sys_user (user_name,user_password,
        <if test="userEmail != null and userEmail != ''">
            user_email,
        </if>
        user_info,head_img,create_time
        )values(#{userName},#{userPassword},
        <if test="userEmail != null and userEmail != ''">
            #{userEmail},
        </if>
        #{userInfo},#{headImg, jdbcType=BLOB},#{createTime,jdbcType=TIMESTAMP}
        )
    </insert>
```



### `choose（when、otherwise）`

```xml
    <select id="selectByIdOrUserName" resultType="tk.mybatis.simple.model.SysUser">
        select * from sys_user
        where 1 = 1
        <choose>
            <when test="id!=null">
                and id = #{id}
            </when>
            <when test="userName!=null and userName != ''">
                and user_name = #{userName}
            </when>
            <otherwise>
                and 1 = 2
            </otherwise>
        </choose>
    </select>
```



### `trim（where、set）`

#### where标签使用

```xml
    <select id="selectByUserUseWhere" resultType="tk.mybatis.simple.model.SysUser">
        select * from sys_user
        <where>
            <if test="userName != null and userName != ''">
                and user_name like concat('%',#{userName},'%')
            </if>
            <if test="userEmail != null and userEmail != ''">
                and user_email like concat('%',#{userEmail},'%')
            </if>
        </where>
    </select>
```

#### set标签使用

```xml
    <update id="updateByUserUseSet">
        update sys_user
        <set>
        <if test="userName!=null and userName != ''">
            user_name = #{userName},
        </if>
        <if test="userPassword!=null and userPassword != ''">
            user_password = #{userPassword},
        </if>
        <if test="userEmail!=null and userEmail!=''">
            user_email = #{userEmail},
        </if>
        <if test="userInfo!=null and userInfo!=''">
            user_info = #{userInfo},
        </if>
        <if test="headImg != null and headImg != ''">
            head_img = #{headImg, jdbcType=BLOB},
        </if>
        <if test="createTime != null and createTime != ''">
            create_time = #{createTime, jdbcType=TIMESTAMP},
        </if>
        id = #{id}
        </set>
        where id = #{id}
    </update>
```

使用set标签，虽然末尾逗号的问题没有了，但是如果标签内部为空，那么还是需要有个类似于 `id  = #{id}`的语句来结尾。

#### trim标签使用

```xml
    <select id="selectByUserUseTrim" resultType="tk.mybatis.simple.model.SysUser">
        select * from sys_user
        <trim prefix="where" prefixOverrides="and |or ">
            <if test="userName != null and userName != ''">
                and user_name like concat('%',#{userName},'%')
            </if>
            <if test="userEmail != null and userEmail != ''">
                and user_email like concat('%',#{userEmail},'%')
            </if>
        </trim>
    </select>
```

- prefix，当标签内内容不为空时，增加标注的前缀
- suffix，当标签内容不为空时，增加标注的后缀
- prefixOverrides，当标签内容不为空，去掉标注所匹配的前缀
- suffixOverrides，当标签内容不为空时，去掉标注所匹配的后缀

### `foreach`

#### 实现in

```java
List<SysUser> selectByIdList(List<Long> ids);
```

```java
    @Test
    public void testSelectByIdList() {
        try (SqlSession session = getSqlSession()) {
            SysUserMapper mapper = session.getMapper(SysUserMapper.class);
            List<Long> ids = Arrays.asList(1L, 1001L);
            List<SysUser> users = mapper.selectByIdList(ids);
            Assert.assertNotNull(users);
            Assert.assertTrue(users.size() > 1);
        }
    }
```

```xml
    <select id="selectByIdList" resultType="tk.mybatis.simple.model.SysUser">
        select * from sys_user
        where id in
        <foreach collection="list" item="id" open="(" close=")" separator="," index="i">
            #{id}
        </foreach>
    </select>
```

#### 实现insert

先要获取自增主键，需要在xml中配置`useGeneratedKeys`，由于批量插入返回自增主键每个数据库实现情况不一样，只有MySql目前完美实现了该规范接口。

```java
int insertList(List<SysUser> list);
```

```xml
    <insert id="insertList" useGeneratedKeys="true" keyProperty="id" keyColumn="id">
        insert into sys_user(user_name,user_password,user_email,user_info,head_img,create_time)
        values
        <foreach collection="list" item="user" separator=",">
            (#{user.userName},#{user.userPassword},#{user.userEmail},#{user.userInfo},#{user.headImg, jdbcType=BLOB},#{user.createTime, jdbcType=TIMESTAMP})
        </foreach>
    </insert>
```

```java
    @Test
    public void testInsertList() {
        SqlSession session = getSqlSession();
        try {
            SysUserMapper mapper = session.getMapper(SysUserMapper.class);
            List<SysUser> users = new ArrayList<>();
            for (int i = 0; i < 2; i++) {
                SysUser user = new SysUser();
                user.setUserName("test" + i);
                user.setUserPassword("test");
                user.setUserEmail("test@mybatis.tk");
                user.setUserInfo("test");
                user.setHeadImg(new byte[]{1});
                user.setCreateTime(new Date());
                users.add(user);
            }
            int row = mapper.insertList(users);
            Assert.assertEquals(2, row);
            for (SysUser user : users) {
                Assert.assertNotNull(user.getId());
                System.out.println(user.getId());
            }
            users = mapper.selectAll();
            System.out.println(users);
        } finally {
            session.rollback();
            session.close();
        }
    }
```

插入`List<Map>`

```java
int insertListByMap(List<Map<String, Object>> list);
```

```xml
    <insert id="insertListByMap">
        insert into sys_user(user_name,user_password,user_email,user_info,head_img,create_time)
        values
        <foreach collection="list" item="map" separator=",">
            (#{map.userName},#{map.userPassword},#{map.userEmail},#{map.userInfo},#{map.headImg, jdbcType=BLOB},#{map.createTime, jdbcType=TIMESTAMP})
        </foreach>
    </insert>
```

```java
    @Test
    public void testInsertListByMap() {
        SqlSession session = getSqlSession();
        try {
            SysUserMapper mapper = session.getMapper(SysUserMapper.class);
            List<Map<String, Object>> users = new ArrayList<>();
            for (int i = 0; i < 2; i++) {
                Map<String, Object> user = new HashMap<>();
                user.put("userName","test" + i);
                user.put("userPassword","test");
                user.put("userEmail","test@mybatis.tk");
                user.put("userInfo","test");
                user.put("headImg",new byte[]{1});
                user.put("createTime", new Date());
                users.add(user);
            }
            int row = mapper.insertListByMap(users);
            Assert.assertEquals(2, row);
            List<SysUser> sysUserList = mapper.selectAll();
            System.out.println(sysUserList);
        } finally {
            session.rollback();
            session.close();
        }
    }
```

或者可以在xml中使用两层`<foreach>`，其中，外层foreach用来循环list，内层foreach用来循环map，此时内层要注意保证键值对的有序性，即需要和insert语句声明的插入顺序一致，所以建议使用`LinkedHashMap`

```java
int insertListByMap(List<Map<String, Object>> list);
```

```xml
    <insert id="insertListByMap">
        insert into sys_user(user_name,user_password,user_email,user_info,head_img,create_time)
        values
        <foreach collection="list" item="map" separator=",">
            <foreach collection="map" open="(" close=")" item="value" separator=",">
                #{value}
            </foreach>
        </foreach>
    </insert>
```

```java
   @Test
    public void testInsertListByMap() {
        SqlSession session = getSqlSession();
        try {
            SysUserMapper mapper = session.getMapper(SysUserMapper.class);
            List<Map<String, Object>> users = new ArrayList<>();
            for (int i = 0; i < 2; i++) {
                Map<String, Object> user = new LinkedHashMap<>();
                user.put("userName","test" + i);
                user.put("userPassword","test");
                user.put("userEmail","test@mybatis.tk");
                user.put("userInfo","test");
                user.put("headImg",new byte[]{1});
                user.put("createTime", new Date());
                users.add(user);
            }
            int row = mapper.insertListByMap(users);
            Assert.assertEquals(2, row);
            List<SysUser> sysUserList = mapper.selectAll();
            System.out.println(sysUserList);
        } finally {
            session.rollback();
            session.close();
        }
    }
```

#### 实现update

使用map来进行更新，注意不要传入空map

```java
int updateByMap(Map<String, Object> map);
```

```xml
    <update id="updateByMap">
        update sys_user
        set
        <foreach collection="_parameter" item="value" index="key" separator=",">
            ${key} = #{value}
        </foreach>
        where id = #{id}
    </update>
```

```java
    @Test
    public void testUpdateByMap() {
        SqlSession session = getSqlSession();
        try {
            SysUserMapper mapper = session.getMapper(SysUserMapper.class);
            Map<String, Object> map = new HashMap<>();
            map.put("id", 1L);
            map.put("user_name", "test");
            map.put("user_info", "test");
            int row = mapper.updateByMap(map);
            SysUser user = mapper.selectById(1L);
            Assert.assertNotNull(user);
            System.out.println(user);
        } finally {
            session.rollback();
            session.close();
        }
    }
```



### `bind`

bind标签可以使用OGNL表达式创建一个变量并将其绑定到上下文中。

```xml
    <select id="selectByUserUseBind" resultType="tk.mybatis.simple.model.SysUser">
            select * from sys_user
            where 1 = 1
            <if test="userName != null and userName != ''">
                <bind name="userNameLike" value="'%' + userName + '%'"/>
                and user_name like #{userNameLike}
            </if>
    </select>
```



## 高级映射

### 一对一

#### 自动映射

> 当必须使用嵌套查询时，并且复杂SQL查询也很快时，建议使用这种自动映射

```
<select id="selectRolesWithUserByUserId" resultType="tk.mybatis.simple.model.SysRole">
    select
    sr.id,
    sr.role_name roleName,
    sr.enabled,
    sr.create_by createBy,
    sr.create_time createTime,
    su.user_name "user.userName",
    su.user_info "user.userInfo"
    from sys_user su
    left join sys_user_role sur on sur.user_id = su.id
    left join sys_role sr on sur.role_id = sr.id
    where su.id = #{id}
</select>
```

```java
public class SysRole {
    private Long id;
    private String roleName;
    private Integer enabled;
    private Long createBy;
    private Date createTime;

    private SysUser user;
}
```

#### resultMap

可以使用resultMap进行映射。（property值也是用`.`的方式）。也可以简化写法，新写一个resultMap并继承user的resultMap。

#### association

> association是关联一对一的，描述标签内返回的类型可以用javaType

1. association配置resultMap
   ```xml
   <resultMap id="userRoleMap" type="tk.mybatis.simple.model.SysUser" extends="userMap">
           <association property="role" columnPrefix="role_" javaType="tk.mybatis.simple.model.SysRole">
               <id property="id" column="id"/>
               <result property="roleName" column="role_name"/>
               <result property="enabled" column="enabled"/>
               <result  property="createBy" column="create_by"/>
               <result property="createTime" column="create_time" jdbcType="TIMESTAMP"/>
           </association>
       </resultMap>
   
       <select id="selectUserAndRoleById" resultMap="userRoleMap">
           select
           u.id,
           u.user_name,
           u.user_password,
           u.user_email,
           u.user_info,
           u.head_img,
           u.create_time,
           r.id role_id,
           r.role_name role_role_name,
           r.enabled role_enabled,
           r.create_by role_create_by,
           r.create_time role_create_time
           from sys_user u inner join sys_user_role ur on u.id = ur.user_id
           inner join sys_role r on ur.role_id = r.id
           where u.id = #{id}
       </select>
   ```

2. association配置嵌套查询语句
   ```xml
   <resultMap id="userRoleMapSelect" type="tk.mybatis.simple.model.SysUser" extends="userMap">
           <association property="role" column="{id=role_id}" select="tk.mybatis.simple.mapper.SysRoleMapper.selectRoleByIdTest"/>
       </resultMap>
       <select id="selectUserAndRoleByIdSelect" resultMap="userRoleMapSelect">
           select
           u.id,
           u.user_name,
           u.user_password,
           u.user_email,
           u.user_info,
           u.head_img,
           u.create_time,
           ur.role_id
           from sys_user u
           inner join sys_user_role ur on u.id = ur.user_id
           where u.id = #{id}
       </select>
   ```

   - 当配置的查询方法位于xml中时，不需要有对应的mapper接口

   - 当配置的查询方法位于mapper接口中时，该方法不能有方法参数
     ```java
     public interface SysRoleMapper {
         @Select({"select id,role_name roleName,enabled,create_by createBy,create_time createTime from sys_role where id = #{id}"})
         SysRole selectRoleByIdTest();
     }
     ```

   - 当配置的查询语句位于xml中，且mapper接口中也有对应的方法，则该方法可以有方法参数。

### 一对多

#### collection

> 在该标签中，javaType属性用来描述返回类型（list），ofType用来描述集合内元素的类型

```xml
    <resultMap id="userAndRolesMapUseJavaType" extends="userMap" type="tk.mybatis.simple.model.SysUser">
        <collection property="roleList" javaType="list" ofType="tk.mybatis.simple.model.SysRole" columnPrefix="role_">
            <id column="id" property="id" jdbcType="VARCHAR"/>
            <result column="role_name" property="roleName" jdbcType="VARCHAR"/>
            <result column="enabled" property="enabled" jdbcType="INTEGER"/>
            <result column="create_by" property="createBy" jdbcType="BIGINT"/>
            <result column="create_time" property="createTime" jdbcType="TIMESTAMP"/>
        </collection>
    </resultMap>
    <resultMap id="userAndRolesMap" extends="userMap" type="tk.mybatis.simple.model.SysUser">
        <collection property="roleList" javaType="list" ofType="tk.mybatis.simple.model.SysRole" columnPrefix="role_" resultMap="tk.mybatis.simple.mapper.SysRoleMapper.roleMap"/>
    </resultMap>
    <select id="selectAllUserAndRoles" resultMap="userAndRolesMap">
        select
        u.id,
        u.user_name,
        u.user_password,
        u.user_email,
        u.user_info,
        u.head_img,
        u.create_time,
        r.id role_id,
        r.role_name role_role_name,
        r.enabled role_enabled,
        r.create_by role_create_by,
        r.create_time role_create_time
        from sys_user u
        inner join sys_user_role ur on ur.user_id = u.id
        inner join sys_role r on ur.role_id = r.id
    </select>
```

## 鉴别器

`discriminator`，使用在resultMap中，内部含有case标签，可以用来判断指定的列的值，并根据不同的值使用不同的返回映射。

```xml
    <resultMap id="rolePrivilegeListMapSelect" type="tk.mybatis.simple.model.SysRole" extends="roleMap">
        <collection property="privilegeList" column="{roleId=id}" select="tk.mybatis.simple.mapper.SysPrivilegeMapper.selectPrivilegeByRoleId" fetchType="lazy"/>
    </resultMap>
<resultMap id="roleAndPrivilegeMapSelectChoose" type="tk.mybatis.simple.model.SysRole">
        <discriminator column="enabled" javaType="int">
            <case value="0" resultType="tk.mybatis.simple.model.SysRole">
                <id property="id" column="id" jdbcType="BIGINT"/>
                <result property="roleName" column="role_name" jdbcType="VARCHAR"/>
            </case>
            <case value="1" resultMap="rolePrivilegeListMapSelect"/>
        </discriminator>
    </resultMap>
    <select id="selectRoleAndPrivilegeChoose" resultMap="roleAndPrivilegeMapSelectChoose">
        select id,role_name,enabled,create_by,create_time from sys_role where id = #{id}
    </select>
```



## 存储过程

### 使用注意

1. 将statementType标签属性设置为CALLABLE

2. 使用select调用存储过程时，将useCache标签属性设置为fasle（关闭二级缓存，因为该存储过程方式不支持Mybatis二级缓存）

3. mode为out时，必须提供jdbcType，in时不用，因为此时Mybatis提供了默认值，且**out与in都要全大写**

4. `_byte`对应基本类型，byte对应Byte类型

5. 使用出参方式接收出参值时，可以使用`JavaBean`，此时要保证每一个出参都有一个对应的属性在bean中；同样，也可以使用map接收，此时没有什么限制。

6. 使用存储过程与java中调用方法一样，参数列表要一一对应。

7. 在使用又返回值的insert/delete方式调用时，返回值等于存储过程中最后一个SQL的执行结果

8. 使用insert方式调用存储过程插入数据时，无法根据keyProperty这种方式获取自增主键，只能通过出参方式给属性赋值，也可以通过selectKey方式获取。
   ```xml
       <insert id="insertUserAndRoles" statementType="CALLABLE">
           <selectKey keyProperty="user.id" keyColumn="id" resultType="long" order="AFTER">
               select last_insert_id()
           </selectKey>
           {call insert_user_and_roles(
           #{user.userName,mode=IN},
           #{user.userPassword, mode=IN},
           #{user.userEmail,mode=IN},
           #{user.userInfo,mode=IN},
           #{user.headImg,mode=IN,jdbcType=BLOB},
           #{user.createTime,mode=IN,jdbcType=TIMESTAMP},
           #{roleIds,mode=IN}
           )}
       </insert>
   ```

   ```java
       @Test
       public void testInsertUserAndRoles() {
           SqlSession session = getSqlSession();
           try {
               SysUserMapper mapper = session.getMapper(SysUserMapper.class);
               SysUser user = new SysUser();
               user.setUserName("test");
               user.setUserPassword("test123456");
               user.setUserEmail("test@mybatis.tk");
               user.setUserInfo("test");
               user.setHeadImg(new byte[]{45});
               user.setCreateTime(new Date());
   
               String roleIds = "1,2";
   
               int insertRow = mapper.insertUserAndRoles(user, roleIds);
               System.out.println(insertRow);
   
               System.out.println(user);
   
   
           } finally {
               session.rollback();
               session.close();
           }
       }
   ```


## [拦截器](./Mybatis拦截器.md) 

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

4. 对于对象中属性值的提取，Mybatis会自动调用该值的getter方法
   ```java
   public interface SysUserMapper {
       int deleteByUser(SysUser user);
   }
   ```

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
   <mapper namespace="tk.mybatis.simple.mapper.SysUserMapper">
       <delete id="deleteByUser">
           delete from sys_user where id = #{id}
       </delete>
   </mapper>
   ```

5. 为了适配不同数据库SQL语法上的差异，可以在`mapperXml`中配置`databaseId`属性，为了较少冗余SQL的编写，可以在具体某个SQL中使用if判断`_databaseId`属性。（想要使用databaseId，需要在配置xml中配置`<databaseIdProvider type="DB_VENDOR"/>`）

6. 在使用嵌套查询时，例如，user对象中包含`List<Role>`属性，此时可能会用到collection嵌套查询。这是，mybatis会根据配置的resultMap进行合并：

   - 当配置id属性时，只根据id进行比较相同则合并
   - 当未配置id属性，会根据配置的所有列是否相同来进行比较，都相同则进行合并

   当未配置id时，如果有很多个字段，且根据条件能查出来很多条，则要比较乘积次，所以，使用这种嵌套查询时，建议配置id标签。
   
7. 由于Mybatis对于**命名空间 +方法名（XML中的id属性值）**是唯一的，所以，禁止同时在接口中和XML中编写（使用注解的）方法名和XML中的id相同的方法

## 使用问题

1. 什么时候使用jdbcType、什么时候使用javaType
