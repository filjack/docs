# Spring

## Spring基本概念

- 轻量级的开源JAVAEE框架
- 用来解决企业应用开发的复杂性
- 核心的两个组成部分 IoC（控制反转，把创建对象的过程交给框架管理），AOP（面向切面，不修改源代码进行功能增强）
- 特点：
  1. 方便解耦，简化开发
  2. AOP编程支持
  3. 方便程序测试（整合JUnit）
  4. 方便集合其他框架（Mybatis等）
  5. 方便进行事务操作
  6. 降低API开发难度

## IoC容器

控制反转，把对象的创建和对象之间的调用过程，交给框架管理。使用IoC可以降低耦合度。

### IoC底层原理

使用xml解析、工厂模式、反射技术实现。

- 传统创建对象过程：
  通过 `new` 关键字创建对象。
- IoC创建对象过程：
  通过一个工厂，在工厂中实现通过xml文件配置类（bean）信息，通过xml解析技术，提取类的基本信息，通过反射技术根据类的信息生成该类的对象并返回。

### IoC接口

> IoC思想基于IoC容器完成，IoC容器底层就是对象工厂

Spring提供IoC容器实现的两种方式：

#### BeanFactory

> 加载配置文件时不会创建对象，而是在获取对象时，才会去创建对象

IoC容器的基本实现，是Spring内部使用的接口，开发人员一般不直接使用该接口

#### ApplicationContext

> 在加载配置文件时就会对对象进行创建

BeanFactory接口的子接口，提供了更多更强大的功能，开发人员一般使用该接口开发

### Bean管理

#### Bean作用域

- 单实例（singleton）
  在加载xml配置文件时就会创建单实例对象
- 多实例（prototype）
  在加载xml配置文件时不创建对象，在调用`getBean`方法时创建多实例对象。

#### Bean生命周期

1. 创建Bean实例
2. 为Bean属性赋值，对其他Bean引用赋值
3. 将Bean传输到Bean后置处理器进行初始化之前的配置
4. 调用Bean的初始化方法（需要进行一些配置）
5. 将Bean传输到Bean后置处理器进行初始化之后的配置
6. 使用Bean（对象已获取）
7. 当容器关闭时，调用Bean的销毁方法（需要配置销毁的方法）

#### Spring两种类型的Bean

- 普通Bean

  在xml配置文件中，定义的类型就是Bean的类型

- 工厂Bean（FactoryBean）
  在xml配置文件中，定义的类型与返回的Bean类型可以不同

> DI：IoC这一思想的一种具体实现，表示依赖注入，就是注入属性

指的是**Spring创建对象**、**Spring注入属性**两个操作。

#### Spring注入属性的实现

1. setter方法注入
2. 构造方法注入

#### 基于xml配置文件方式实现

##### 自动装配（autowire）

1. byName
2. byType
   - 要求同一类型的Bean不能有多个id属性不同的xml配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">    
	<bean id="user" class="com.xpf.model.User" scope="singleton" init-method="init" destroy-method="destroy" autowire="byName">
        <property name="name">
            <value><![CDATA[<<南京>>]]></value>
        </property>
        <property name="age" value="18"/>
    </bean>
</beans>
```

##### 外部属性配置

通过读取外部properties文件来为bean的属性赋值。

```properties
prop.driverClassLoader=com.alibaba.druid.pool.DruidDataSource
prop.url=jdbc:mysql.cj
prop.username=root
prop.password=root
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
		https://www.springframework.org/schema/context/spring-context.xsd
">
    
    <context:property-placeholder location="classpath:jdbc.properties" />
    
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassLoader" value="${prop.driverClassLoader}"/>
        <property name="url" value="${prop.url}"/>
        <property name="username" value="${prop.username}"/>
        <property name="password" value="${prop.password}"/>
    </bean>
</beans>
```



#### 基于注解方式实现