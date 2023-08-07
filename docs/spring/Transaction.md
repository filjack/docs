# 事务

## 事务概念

事务是数据库操作最基本的单元，是逻辑上的一组操作，要么都成功，如果有一个操作失败则所有的都失败。

## 事务特性

### 原子性

一组操作要么都成功，要么都失败

### 一致性

操作之前和操作之后，事物的总量是不变的

### 隔离性

多事务并发操作，操作之间是隔离的，互不影响的

### 持久性

事务只有提交之后，事物才会真正发生变化

## Spring中进行事务管理

### 相关API

```java
PlatformTransactionManager
```



### 编程式

按照开启事务，业务操作，提交事务，发生异常回滚事务的顺序来一步一步编程实现的方式

### 声明式

底层使用了AOP的原理

#### 参数配置

1. propagation，事务传播行为，当一个事务的方法被另一个事务的方法调用时候
   - required：方法B上标注了事务B，方法A上标注了事务A，当在方法A中调用方法B时，方法A、B都在事务A中执行。
   - required_new：方法B上标注了事务B，方法A上标注了事务A，当在方法A中调用方法B时，方法A在事务A中执行，方法B在新开启的事务B中执行。
   - supports：方法B上标注了事务B（supports），方法A上标注了事务A，当在方法A中调用方法B时，方法A、B都在事务A中执行，当单独调用方法B时，方法B可以不再任何事务中运行。
   - not_supports：以非事务运行， 存在事务则将事务挂起。就是不用事务
   - never：以非事务方式运行， 就是不用事务， 如果当前存在事务则抛出异常
   - nested：如果当前存在事务，则在嵌套事务内执行。如果当前没有事务,则新建一个事务。
   - mandatory：支持当前事务， 如果当前没有事务，就抛出异常。
2. isolation，事务隔离级别，多事务操作之间不会互相影响。不考虑隔离级别会产生脏读、不可重复读、幻读等问题。
   - read_uncommitted（读未提交）：三个问题都未解决
   - read_committed（读已提交）：解决了脏读
   - repeatable_read（可重复读）：解决了脏读、不可重复读
   - serializable（串行化）：三个问题都解决了
3. timeout，超时时间，事务必须在规定的时间内进行提交，否则进行回滚，默认值未-1（永不超时），可以自己设置（以秒为单位）
4. readOnly，是否只读，默认值是false，设置成true时，禁止对数据进行修改操作
5. rollbackFor，回滚，设置事务中出现哪些异常进行事务回滚
6. norollbackFor，不回滚，设置事务中出现哪些异常不进行事务回滚

#### 基于注解

```java
package com.tx.conf;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

/**
 * @author xpf
 * @since 2023/7/25
 */
@ComponentScan(basePackages = "com.tx")
@Configuration
@EnableTransactionManagement // 开启事务
public class TranConf {

    @Bean
    public DruidDataSource getDruidDataSource() {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        druidDataSource.setUrl("jdbc:mysql://127.0.0.1:3306/test?allowPublicKeyRetrieval=true&useSSL=false&useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC");
        druidDataSource.setUsername("root");
        druidDataSource.setPassword("lqh24786");
        return druidDataSource;
    }

    @Bean
    public JdbcTemplate getJdbcTemplate(DataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        jdbcTemplate.setDataSource(dataSource);
        return jdbcTemplate;
    }

    @Bean
    public DataSourceTransactionManager getDataSourceTransactionManager(DataSource dataSource) {
        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource(dataSource);
        return transactionManager;
    }

}
```

```java
@Service
public class UserServiceImpl {

    @Autowired
    private UserDao userDao;

    @Transactional
    public void trans() {
        userDao.increase(100, "1");
        userDao.decrease(100, "2");
    }

}
```



#### 基于XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
	http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd
	http://www.springframework.org/schema/tx https://www.springframework.org/schema/tx/spring-tx.xsd
	http://www.springframework.org/schema/aop  https://www.springframework.org/schema/aop/spring-aop.xsd
">

    <context:component-scan base-package="com.tx"/>

    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url"
                  value="jdbc:mysql://127.0.0.1:3306/test?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;useUnicode=true&amp;characterEncoding=UTF-8&amp;serverTimezone=UTC"/>
        <property name="username" value="root"/>
        <property name="password" value="lqh24786"/>
    </bean>

    <!--1. 配置事务-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <tx:annotation-driven transaction-manager="transactionManager"/>
    <!--2. 配置通知-->
    <tx:advice id="txAdvice">
        <tx:attributes>
            <!--指定哪种规则的方法上面添加事务-->
            <tx:method name="trans" no-rollback-for="java.lang.ArithmeticException"/>
        </tx:attributes>
    </tx:advice>

    <!--3. 配置切入点和切面-->
    <aop:config>
        <!--配置切入点-->
        <aop:pointcut id="tr" expression="execution(* com.tx.service.UserServiceImpl.trans(..))"/>
        <!--配置切面-->
        <aop:advisor advice-ref="txAdvice" pointcut-ref="tr"/>
    </aop:config>
</beans>
```



