# Spring-Boot-Test

## 需要注入依赖的使用方法

### 2.2版本之前

2.2版本之前，类上需要标注`@SpringBootTest`、`@RunWith(SpringRunner.class)`注解，在测试方法上需要使用`junit`的`@Test`注解。且测试类需要与项目启动类的路径一致（指的是全限定路径）

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


@SpringBootTest
@RunWith(SpringRunner.class)
public class ApplicationTest {

    @Autowired
    private Mapper mapper;
    
	@Test
    public void test() {
        List<String> ids = new ArrayList<String>() {{
            add("0A92B6048E804BF2B63508A3D01FF728");
            add("5C5B28758B034E159FD808E48FB8A73E");
            add("8DD87F66671E4C7E8045EB52A2F88D46");
            add("36BFA2464AA1418984A373ACC8ABD744");
        }};
       
        List list = mapper.selectByIdList(ids);
        System.out.println(list.size());
    }
}

```

### 2.2版本之后

2.2版本之后，类上只需要使用`@SpringBootTest`主键，在测试方法上使用`jupiter`的`@Test`注解即可

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ApplicationTest {

    @Autowired
    private Mapper mapper;
    
	@Test
    public void test() {
        List<String> ids = new ArrayList<String>() {{
            add("0A92B6048E804BF2B63508A3D01FF728");
            add("5C5B28758B034E159FD808E48FB8A73E");
            add("8DD87F66671E4C7E8045EB52A2F88D46");
            add("36BFA2464AA1418984A373ACC8ABD744");
        }};
       
        List list = mapper.selectByIdList(ids);
        System.out.println(list.size());
    }
}
```

## 测试Web应用

- `@WebMvcTest`
  spring-boot提供的可以让标注该注解的测试类能够在`SpringMVC`应用上下文执行。提供Spring环境支持，可以配置`MockMvc`来模拟请求发送
  
  ```java
  package com.taco.controller;
  
  import org.hamcrest.Matchers;
  import org.junit.jupiter.api.Test;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
  import org.springframework.test.web.servlet.MockMvc;
  import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
  import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
  
  /**
   * @author xpf
   * @since 2023/10/26
   */
  @WebMvcTest(controllers = {HomeController.class})
  public class HomeControllerTest {
  
      @Autowired
      private MockMvc mockMvc;
  
      @Test
      public void testHomePage() throws Exception {
          mockMvc.perform(MockMvcRequestBuilders.get("/"))
                  .andExpect(MockMvcResultMatchers.status().isOk())
                  .andExpect(MockMvcResultMatchers.view().name("home"))
                  .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("Welcome to...")))
                  ;
      }
  
  }
  
  ```
  

## 事务注解

spring-boot-test提供了`@RollBack`和`@Commit`注解在使用了`@Transactional`的测试方法（或测试类）上使用。

## 常用注解使用

- `@ActiveProfiles("cs")`
  该注解用来声明测试类启用哪一个配置文件，常用于有多个配置文件的项目中，其中value属性标注所要使用的配置文件的后缀
- **@Test :**表示方法是测试方法。但是与JUnit4的@Test不同，他的职责非常单一不能声明任何属性，拓展的测试将会由Jupiter提供额外测试
- **@ParameterizedTest :**表示方法是参数化测试，下方会有详细介绍
- **@RepeatedTest :**表示方法可重复执行，下方会有详细介绍
- **@DisplayName :**为测试类或者测试方法设置展示名称
- **@BeforeEach :**表示在每个单元测试之前执行
- **@AfterEach :**表示在每个单元测试之后执行
- **@BeforeAll :**表示在所有单元测试之前执行
- **@AfterAll :**表示在所有单元测试之后执行
- **@Tag :**表示单元测试类别，类似于JUnit4中的@Categories
- **@Disabled :**表示测试类或测试方法不执行，类似于JUnit4中的@Ignore
- **@Timeout :**表示测试方法运行如果超过了指定时间将会返回错误
- **@ExtendWith :**为测试类或测试方法提供扩展类引用

## 断言方法

### 简单断言

| 方法            | 说明                                 |
| --------------- | ------------------------------------ |
| assertEquals    | 判断两个对象或两个原始类型是否相等   |
| assertNotEquals | 判断两个对象或两个原始类型是否不相等 |
| assertSame      | 判断两个对象引用是否指向同一个对象   |
| assertNotSame   | 判断两个对象引用是否指向不同的对象   |
| assertTrue      | 判断给定的布尔值是否为 true          |
| assertFalse     | 判断给定的布尔值是否为 false         |
| assertNull      | 判断给定的对象引用是否为 null        |
| assertNotNull   | 判断给定的对象引用是否不为 null      |

```java
@Test
@DisplayName("simple assertion")
public void simple() {
     assertEquals(3, 1 + 2, "simple math");
     assertNotEquals(3, 1 + 1);

     assertNotSame(new Object(), new Object());
     Object obj = new Object();
     assertSame(obj, obj);

     assertFalse(1 > 2);
     assertTrue(1 < 2);

     assertNull(null);
     assertNotNull(new Object());
}
```

### 数组断言

```java
@Test
@DisplayName("array assertion")
public void array() {
 assertArrayEquals(new int[]{1, 2}, new int[] {1, 2});
}
```



### 组合断言

```java
@Test
@DisplayName("assert all")
public void all() {
 assertAll("Math",
    () -> assertEquals(2, 1 + 1),
    () -> assertTrue(1 > 0)
 );
}
```

### 异常断言

```java
@Test
@DisplayName("异常测试")
public void exceptionTest() {
    ArithmeticException exception = Assertions.assertThrows(
           //扔出断言异常
            ArithmeticException.class, () -> System.out.println(1 % 0));

}
```



### 超时断言

```java
@Test
@DisplayName("超时测试")
public void timeoutTest() {
    //如果测试方法时间超过1s将会异常
    Assertions.assertTimeout(Duration.ofMillis(1000), () -> Thread.sleep(500));
}
```

### 快速失败

```java
@Test
@DisplayName("fail")
public void shouldFail() {
 fail("This should fail");
}
```

## 前置条件

JUnit 5 中的前置条件（**assumptions【假设】**）类似于断言，不同之处在于**不满足的断言会使得测试方法失败**，而不满足的**前置条件只会使得测试方法的执行终止**。

```java
@DisplayName("前置条件")
public class AssumptionsTest {
 private final String environment = "DEV";
 
 @Test
 @DisplayName("simple")
 public void simpleAssume() {
    assumeTrue(Objects.equals(this.environment, "DEV"));
    assumeFalse(() -> Objects.equals(this.environment, "PROD"));
 }
 
 @Test
 @DisplayName("assume then do")
 public void assumeThenDo() {
    assumingThat(
       Objects.equals(this.environment, "DEV"),
       () -> System.out.println("In DEV")
    );
 }
}
```

## 嵌套测试

使用`@Nested`注解，标注在测试类中的内部类上，由于嵌套测试是利用java内部类机制实现，所以，外围类中的@Test方法不能调用内部类的方法（外围类测试方法不能享受到声明在内部类的`@BeforeEach`方法），但是内部类中的方法可以调用外部类的方法（内部类的普通测试方法可以享受到外围类的`@BeforeEach`方法）。

```java
@DisplayName("A stack")
class TestingAStackDemo {

    Stack<Object> stack;

    @Test
    @DisplayName("is instantiated with new Stack()")
    void isInstantiatedWithNew() {
        new Stack<>();
        assertNotNull(stack); // 测试失败，stack为null
    }

    @Nested
    @DisplayName("when new")
    class WhenNew {

        @BeforeEach
        void createNewStack() {
            stack = new Stack<>();
        }

        @Test
        @DisplayName("is empty")
        void isEmpty() {
            assertTrue(stack.isEmpty()); // 测试成功，因为BeforeEach方法已经初始化了
        }

        @Test
        @DisplayName("throws EmptyStackException when popped")
        void throwsExceptionWhenPopped() {
            assertThrows(EmptyStackException.class, stack::pop);
        }

        @Test
        @DisplayName("throws EmptyStackException when peeked")
        void throwsExceptionWhenPeeked() {
            assertThrows(EmptyStackException.class, stack::peek);
        }

        @Nested
        @DisplayName("after pushing an element")
        class AfterPushing {

            String anElement = "an element";

            @BeforeEach
            void pushAnElement() {
                stack.push(anElement);
            }

            @Test
            @DisplayName("it is no longer empty")
            void isNotEmpty() {
                assertFalse(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when popped and is empty")
            void returnElementWhenPopped() {
                assertEquals(anElement, stack.pop());
                assertTrue(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when peeked but remains not empty")
            void returnElementWhenPeeked() {
                assertEquals(anElement, stack.peek());
                assertFalse(stack.isEmpty());
            }
        }
    }
}
```

## 参数化测试

> 只需要去实现**ArgumentsProvider**接口，任何外部文件都可以作为它的入参。

参数化测试是JUnit5很重要的一个新特性，它使得用不同的参数多次运行测试成为了可能，也为我们的单元测试带来许多便利。



利用**@ValueSource**等注解，指定入参，我们将可以使用不同的参数进行多次单元测试，而不需要每新增一个参数就新增一个单元测试，省去了很多冗余代码。



**@ValueSource**: 为参数化测试指定入参来源，支持八大基础类以及String类型,Class类型

**@NullSource**: 表示为参数化测试提供一个null的入参

**@EnumSource**: 表示为参数化测试提供一个枚举入参

**@CsvFileSource**：表示读取指定CSV文件内容作为参数化测试入参

**@MethodSource**：表示读取指定方法的返回值作为参数化测试入参(注意方法返回需要是一个流)

```java
@ParameterizedTest
@ValueSource(strings = {"one", "two", "three"})
@DisplayName("参数化测试1")
public void parameterizedTest1(String string) {
    System.out.println(string);
    Assertions.assertTrue(StringUtils.isNotBlank(string));
}


@ParameterizedTest
@MethodSource("method")    //指定方法名
@DisplayName("方法来源参数")
public void testWithExplicitLocalMethodSource(String name) {
    System.out.println(name);
    Assertions.assertNotNull(name);
}

static Stream<String> method() {
    return Stream.of("apple", "banana");
}
```

