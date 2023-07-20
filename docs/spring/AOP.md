# AOP

## AOP基本概念

AOP（面向切面编程），利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

通俗来讲，就是不通过修改源代码方式，在主干功能里面添加新功能。

## AOP底层原理

AOP底层使用动态代理

### 有接口情况

使用JDK动态代理，创建该接口实现类的代理对象，在其中去做增强

```java
Proxy.newProxyInstance()
```



### 没有接口情况

使用CGLIB动态代理，创建当前类的子类的代理对象，在其中做增强

## AOP术语

### 连接点

类中可以被增强的方法，叫做连接点。

### 切入点

实际被增强的方法叫做切入点

### 通知（增强）

实际增强的逻辑（添加的逻辑部分）叫做通知

- 前置通知：方法执行之前通知
- 后置通知：方法执行之后通知
- 环绕通知：方法执行之前，之后都执行通知
- 异常通知：方法抛出异常后执行通知
- 最终通知：类似与try finally，不管方法是否异常，都执行通知

### 切面

将通知应用到切入点的过程叫做切面

## AOP操作

Spring框架中一般都是基于AspectJ实现AOP操作。AspectJ不是Spring组成部分，独立于Spring框架。一般把AspectJ和Spring框架一起使用，进行AOP操作。

### 切入点表达式

便于知道对哪个类里面的哪个方法进行增强

语法结构：

```java
execution([权限修饰符][返回类型][类全路径][方法名称]([参数列表]))
    返回修饰符一般都是省略不写
```

示例

```java
// 对com.xpf.UserDao中的add(int a,int b)方法进行增强
execution(* com.xpf.UserDao.add(..));

// 对com.xpf.UserDao中所有方法进行增强
execution(* com.xpf.UserDao.*(..));

// 对com.xpf包中所有类的所有方法进行增强
execution(* com.xpf.*.*(..));
```



### 基于XML配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context
		https://www.springframework.org/schema/context/spring-context.xsd
		http://www.springframework.org/schema/aop
		https://www.springframework.org/schema/aop/spring-aop.xsd
">
<!--配置对象    -->
  <bean id="food" class="com.aspectJ.ann.Food"></bean>
  <bean id="foodProxy" class="com.aspectJ.ann.FoodProxy"></bean>
<!--配置aop-->
  <aop:config>
<!--配置切入点-->
      <aop:pointcut id="p" expression="execution(* com.aspectJ.ann.Food.add(..))"/>
<!--配置切面-->
      <aop:aspect id="a" ref="foodProxy">
<!--配置增强方法,并绑定切入点-->
          <aop:before method="before" pointcut-ref="p"/>
      </aop:aspect>
  </aop:config>
</beans>
```

```java
public class SpringTest {

    @Test
    public void testAspectJ() {
        ApplicationContext context = new ClassPathXmlApplicationContext("aspectJ.xml");
        Food food = context.getBean("food", Food.class);
        food.add();
    }

}
```



### 基于注解方式实现

#### AspectJSpringConfig.java

```java
@Configuration
@EnableAspectJAutoProxy
@ComponentScan(basePackages = {"com.aspectJ"})
public class AspectJSpringConfig {
}
```

#### Food.java

```java
@Component
public class Food {

    public void add() {
        System.out.println("add....");
        int i = 10 / 0;
    }

}
```

#### FoodProxy.java

```java
@Aspect
@Component
public class FoodProxy {


    // 前置通知
    @Before(value = "execution(* com.aspectJ.ann.Food.add(..))")
    public void before() {
        System.out.println("before...");
    }

    // 后置通知
    @AfterReturning("execution(* com.aspectJ.ann.Food.add(..))")
    public void afterReturning() {
        System.out.println("afterReturning...");
    }

    // 环绕通知
    @Around("execution(* com.aspectJ.ann.Food.add(..))")
    public void around(ProceedingJoinPoint point) throws Throwable {
        System.out.println("before around...");
        point.proceed();
        System.out.println("after around...");
    }

    // 异常通知
    @AfterThrowing("execution(* com.aspectJ.ann.Food.add(..))")
    public void afterThrowing() {
        System.out.println("afterThrowing...");
    }

    // 最终通知
    @After(value = "execution(* com.aspectJ.ann.Food.add(..))")
    public void after() {
        System.out.println("after...");
    }
    
}
```

#### SpringTest.java

```java
public class SpringTest {

    @Test
    public void testAspectJ() {
        ApplicationContext context = new AnnotationConfigApplicationContext(AspectJSpringConfig.class);
        Food food = context.getBean("food", Food.class);
        food.add();
    }

}
```

#### 切入点抽取

```java
@Aspect
@Component
public class FoodProxy {


    // 前置通知
    @Before(value = "add()")
    public void before() {
        System.out.println("before...");
    }

    // 后置通知
    @AfterReturning("add()")
    public void afterReturning() {
        System.out.println("afterReturning...");
    }

    // 环绕通知
    @Around("add()")
    public void around(ProceedingJoinPoint point) throws Throwable {
        System.out.println("before around...");
        point.proceed();
        System.out.println("after around...");
    }

    // 异常通知
    @AfterThrowing("add()")
    public void afterThrowing() {
        System.out.println("afterThrowing...");
    }

    // 最终通知
    @After(value = "add()")
    public void after() {
        System.out.println("after...");
    }

    @Pointcut(value = "execution(* com.aspectJ.ann.Food.add(..))")
    public void add() {

    }

}
```

#### 多个增强类

使用@Order注解

```java
@Component
@Aspect
@Order(1)
public class FoodProxy2 {


    @Before(value = "add1()")
    public void before() {
        System.out.println("FoodProxy2 before...");
    }

    @Pointcut(value = "execution(* com.aspectJ.ann.Food.add(..))")
    public void add1() {

    }

}
```

