# SpringBoot

- 优点
  1. 能够创建独立的Spring应用
  2. 内嵌了web服务器
  3. 提供了starter自动依赖配置，简化了构建所需依赖配置
  4. 自动配置Spring以及第三方依赖包
  5. 提供生产级别的监控、健康检查、外部化配置功能
  6. 无代码生成、无需编写XML
- 缺点
  1. 版本迭代快，需要时刻关注变化
  2. 封装太深，内部原理复杂

## [微服务](https://martinfowler.com/microservices/) 

## 依赖管理

- 父项目做依赖管理，父依赖POM声明了几乎所有项目开发过程可能会用到的依赖的版本，基于此来做到依赖版本自动仲裁机制

- 可以修改依赖的默认版本号，通过声明`properties`标签

- 只需要在POM文件中声明
  ```xml
      <parent>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-parent</artifactId>
          <version>2.3.4.RELEASE</version>
      </parent>
  ```

- spring-boot提供的starter一般都是以`spring-booot-starter-*`命名；第三方提供的starter一般是根据spring官方提供的命名规范`*-spring-boot-starter`来命名

## 自动配置

- 自动引入所需依赖包

- 自动配置好所需依赖的配置（默认配置）

- 各种配置都有默认值，每个配置都是绑定到某个特定的配置类上，该类会在容器中创建对象
  ```yaml
  server:
    port: 8888
  ```

  对应的JAVA类为
  ```java
  @ConfigurationProperties(
      prefix = "server",
      ignoreUnknownFields = true
  )
  public class ServerProperties {
      ...
  }
  ```

  这些配置都在`spring-boot-autoconfigure`中定义，且默认配置都由该依赖提供

- 按需加载所有自动配置项

  - 父POM中具有非常多的starter，每一个starter都对应特定的一个业务场景
  - 只有引入了相应的场景，这个场景的自动配置才会开启
  - SpringBoot所有的自动配置功能都在 spring-boot-autoconfigure 包里面

- 自动扫描，默认扫描主程序所在包路径下所有的文件；或者指定扫描路径
  ```java
  @SpringBootApplication(scanBasePackages = {"com.xpf"})
  public class Application {
  
      public static void main(String[] args) {
          SpringApplication.run(Application.class, args);
      }
  
  }
  ```

### 自动配置原理

所有自动配置在启动时都会被加载，但是会根据`@Conditional`条件按需开启配置

1. 通过`@SpringBootApplication`引导加载自动配置类
   ```java
   // 只保留关键注解
   @SpringBootConfiguration
   @EnableAutoConfiguration
   @ComponentScan(
       excludeFilters = {@Filter(
       type = FilterType.CUSTOM,
       classes = {TypeExcludeFilter.class}
   ), @Filter(
       type = FilterType.CUSTOM,
       classes = {AutoConfigurationExcludeFilter.class}
   )}
   )
   public @interface SpringBootApplication {
       ...
   }
   ```

2. `@SpringBootConfiguration`代表当前类是一个配置类，作用相当于`@Configuration`

   ```java
   @Configuration
   public @interface SpringBootConfiguration {}
   ```

3. `@ComponentScan`定义扫描哪些位置的组件

4. `@EnableAutoConfiguration`的组成为

   ```java
   @AutoConfigurationPackage
   @Import({AutoConfigurationImportSelector.class})
   public @interface EnableAutoConfiguration {}
   ```

   1. `@AutoConfigurationPackage`

      ```java
      @Import(AutoConfigurationPackages.Registrar.class) 
      public @interface AutoConfigurationPackage {}
      ```

      利用`Registrar`组件给容器中导入一系列组件，默认指定导入与主程序同级的所有目录

   2. `@Import(AutoConfigurationImportSelector.class)`
      导入自动配置引入选择器，具体引入过程为

      - 利用`getAutoConfigurationEntry(annotationMetadata);`给容器中批量导入一些组件
      - 调用`List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes)`获取到所有需要导入到容器中的配置类
      - 利用工厂加载 `Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader)；`得到所有的组件
      - 从`META-INF/spring.factories`位置来加载一个文件。默认扫描我们当前系统里面所有`META-INF/spring.factories`位置的文件
            `spring-boot-autoconfigure-2.3.4.RELEASE.jar`包里面也有`META-INF/spring.factories`

## 容器功能

### 组件添加

- `@Configuration`：声明一个配置类，并自动注入到容器中。

  - proxyBeanMethods属性，当值为false时，代表Lite模式，此时，该配置中标有`@Bean`注解的方法无论调用多少次，返回实例组件都是新创建的，与容器中保存的单实例不同；当值为true时，每个@Bean注解标注的方法返回的实例组件都是容器中保存的单实例组件
  - 当需要通过配置类来获取组件，而不是通过容器时：如果组件之间没有依赖关系，建议使用Lite模式，能够加速容器启动；如果组件之间有依赖关系，建议使用Full模式。具体如何使用根据实际使用场景来判断。

- `@Bean`
  一般用于`@Configuration`注解中，且，当声明多个`@Bean`时，注入顺序和声明顺序相同，可以通过`@DependsOn`来改变注入顺序

- `@Controller`、`@Service`、`@Repository`、`@Component`、`@ComponentScan`

- `@Import`，导入一系列组件到容器中

  ```java
  @Import(value = {User.class, DBHelper.class})
  @Configuration(proxyBeanMethods = false)
  public class CustomConfig {
      
  }
  ```

- `@Conditional`，根据条件注入组件，该注解有很多扩展注解供不同场景使用

  ```java
  @Import(value = {User.class, DBHelper.class})
  @Configuration(proxyBeanMethods = false)
  public class CustomConfig {
  
      @Bean
      public Pet dog() {
          return new Pet("cat");
      }
  
      @Bean
      @ConditionalOnBean(name = "cat")
      public User user01() {
          User user = new User("张三", 18);
          user.setPet(dog());
          return user;
      }
  }
  ```

### 原生配置XML导入

`@ImportResource`

```java
@ImportResource(value = {"classpath:bean.xml"})
@Configuration(proxyBeanMethods = false)
public class CustomConfig {

}
```

### 配置绑定

1. `@Component` + `@ConfigurationProperties`

   ```java
   @Component
   @ConfigurationProperties(prefix = "mycar")
   public class Car {
   
       private String type;
       private Integer price;
   }
   ```

2. `@EnableConfigurationProperties` + `@ConfigurationProperties`

   ```java
   @ConfigurationProperties(prefix = "mycar")
   public class Car {
   
       private String type;
       private Integer price;
   }
   ```

   ```java
   @EnableConfigurationProperties(value = {Car.class})
   @Configuration(proxyBeanMethods = false)
   public class CustomConfig {
       
   }
   ```


### 修改自动配置默认值

```java
@Bean
@ConditionalOnBean(MultipartResolver.class)
@ConditionalOnMissingBean(name = DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME)
public MultipartResolver multipartResolver(MultipartResolver resolver) {
   // Detect if the user has created a MultipartResolver but named it incorrectly
   return resolver;
}
```

1. SpringBoot优先加载所有自动配置类，一般命名结构为`xxxAutoConfiguration`
2. 每个自动配置类根据配置的条件进行判断是否生效，每个配置都会绑定到一个`xxxproperties`类上，这个类会跟配置文件绑定在一起
3. 生效的配置类就会给容器中装配很多组件

#### 定制化配置

- 用户直接自己`@Bean`替换底层的组件
- 用户去看这个组件绑定的配置文件是什么，手动修改配置文件



## 核心功能

### Web开发

#### 表单发送除了GET、POST外的请求

`WebMvcAutoConfiguration`配置了`HiddenHttpMethodFilter`用来支持表单增加额外参数来发送除了GET、POST外其他请求方式的请求。

#### 请求映射

> 根据Servlet可知，springMVC一定会重写doGet、doPost方法，由源码可知，这两个方法都调用了**DispatcherServlet**中的doService方法，该方法调用本类的**`doDispatch`**方法。

##### DispatcherServlet

主要分发方法为

```java
mappedHandler = getHandler(processedRequest);
```

`getHandler()`为request分发到对应的处理器中。在容器启动时，spring默认为我们注入了5个`handlerMapping`

- RequestMappingHandlerMapping
  包含了所有的controller上标注了RequestMapping的url路径
- WelcomePageHandlerMapping
- BeanNameUrlHandlerMapping
- RouterFunctionMapping
- SimpleUrlHandlerMapping

当请求进来后，挨个尝试所有的handlerMapping看是否有对应的请求处理器（根据一定的规则，一般顺序是请求方式、请求参数、请求头。。。。）

#### 请求参数

1. 路径参数`@PathVariable`
   ```java
       @GetMapping("/car/{id}/owner/{name}")
       public Map<String, Object> getCar(@PathVariable(value = "id") String id, @PathVariable(value = "name") String name, @PathVariable Map<String, String> map) {
           Map<String, Object> result = new HashMap<>();
           result.put("id", id);
           result.put("name", name);
           result.put("map", map);
           return result;
       }
   ```

   可以使用`Map<String,String>`来一次性接收所有路径参数

2. 请求头`@RequestHeader`
   ```java
       @GetMapping("/car/{id}/owner/{name}")
       public Map<String, Object> getCar(
                                         @RequestHeader(value = "User-Agent") String userAgent,
                                         @RequestHeader Map<String, String> headers) {
           Map<String, Object> result = new HashMap<>();
           result.put("User-Agent", userAgent);
           result.put("headers", headers);
           return result;
       }
   ```

3. 请求参数`@RequestParam`
   ```java
       @GetMapping("/car/{id}/owner/{name}")
       public Map<String, Object> getCar(
                                         @RequestParam(value = "age") Integer age,
                                         @RequestParam(value = "interests") List<String> interests) {
           Map<String, Object> result = new HashMap<>();
           result.put("age", age);
           result.put("interests", interests);
           return result;
       }
   ```

4. cookie，`@CookieValue`
   ```java
       @GetMapping("/car/{id}/owner/{name}")
       public Map<String, Object> getCar(
                                         @CookieValue(value = "_ga") String ga,
                                         @CookieValue(value = "_ga") Cookie cookie,
                                         HttpServletResponse response) {
           response.addCookie(new Cookie("_ga", "zxcvbnm"));
           Map<String, Object> result = new HashMap<>();
           System.out.println(ga);
           System.out.println(cookie.toString());
           return result;
       }
   ```

5. 请求体 `@RequestBody`
   ```java
       @PostMapping(value = "/save")
       public Map postMethod(@RequestBody String content) {
           Map<String, Object> map = new HashMap<>();
           map.put("content", content);
           return map;
       }
   ```

   ```html
       <form action="/save" method="post">
           测试@RequestBody获取数据<br/>
           用户：<input name="userName"/><br>
           邮箱：<input name="email"/><br>
           <input type="submit" value="提交">
       </form>
   ```

6. `@RequestAttribute`

   ```java
   @Controller
   public class RequestAttributeController {
   
   
       @GetMapping("/goto")
       public String requestGoTo(HttpServletRequest request) {
           request.setAttribute("goto", "跳转。。。。");
           return "forward:/success";
       }
   
       @ResponseBody
       @GetMapping("/success")
       public String success(@RequestAttribute(value = "goto") String att, HttpServletRequest request) {
           System.out.println(request.getAttribute("goto"));
           System.out.println(att);
           return att;
       }
   
   }
   ```

7. 矩阵变量，`@MatrixVariable`，通过请求路径上的额外参数（以分号隔开）来传递额外信息
   ```java
   //    cars/sell;byd=18;lbjn=99
       @GetMapping(path = "/cars/{path}")
       public Map<String, Object> getCars(@PathVariable(value = "path") String path,
                                          @MatrixVariable(value = "byd") Integer bydPrice,
                                          @MatrixVariable(value = "lbjn") Integer lbjnPrice) {
           Map<String, Object> map = new HashMap<>();
           map.put("path", path);
           map.put("byd", bydPrice);
           map.put("lbjn", lbjnPrice);
           return map;
       }
   ```

   ```jav
       //    /boss/sell;yiqi=10,11,12,13;tsl=25
       @GetMapping(value = "/boss/{path}")
       public Map<String, Object> getCars2(@PathVariable("path") String path,
                                           @MatrixVariable(value = "yiqi") List<Integer> yiqi,
                                           @MatrixVariable(value = "tsl") Integer tsl) {
           Map<String, Object> map = new HashMap<>();
           map.put("path", path);
           map.put("yiqi", yiqi);
           map.put("tsl", tsl);
           return map;
       }
   ```

   ```java
   //    /manage/sell;yiqi=10/path;yiqi=20/boss;tsl=90
       @GetMapping(value = "/manage/{path}/{path2}/{path3}")
       public Map<String, Object> getCars3(@PathVariable("path") String path,
                                           @PathVariable("path2") String path2,
                                           @PathVariable("path3") String path3,
                                           @MatrixVariable(value = "yiqi", pathVar = "path") Integer yiqi,
                                           @MatrixVariable(value = "yiqi", pathVar = "path2") Integer yiqi2,
                                           @MatrixVariable(value = "tsl", pathVar = "path3") Integer tsl) {
           Map<String, Object> map = new HashMap<>();
           map.put("path", path);
           map.put("path2", path2);
           map.put("yiqi", yiqi);
           map.put("yiqi2", yiqi2);
           map.put("tsl", tsl);
           return map;
       }
   ```

   由于SpringBoot默认没有启用矩阵变量，所以需要个性化配置
   ```java
       @Bean
       public WebMvcConfigurer webMvcConfigurer() {
           return new WebMvcConfigurer() {
               @Override
               public void configurePathMatch(PathMatchConfigurer configurer) {
                   UrlPathHelper urlPathHelper = new UrlPathHelper();
                   urlPathHelper.setRemoveSemicolonContent(false);
                   configurer.setUrlPathHelper(urlPathHelper);
               }
           };
       }
   ```

#### 请求参数处理原理

1. HandlerMapping中找到能够处理当前请求的handler

2. 为当前handler找到一个适配器handlerAdapter
   ```java
   // Actually invoke the handler.
   //DispatcherServlet -- doDispatch
   mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
   ```

   

3. 适配器执行目标方法并确定方法参数的每一个值
   ```java
   mav = invokeHandlerMethod(request, response, handlerMethod); //执行目标方法
   
   
   //ServletInvocableHandlerMethod
   Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
   //获取方法的参数值
   Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs);
   ```

4. 通过遍历参数解析器，找到一个能够处理当前参数情况的解析器并处理参数（根据参数注解）`HandlerMethodArgumentResolver`
   ```java
   public interface HandlerMethodArgumentResolver {
   	// 是否支持处理当前参数
   	boolean supportsParameter(MethodParameter parameter);
   
       // 解析当前参数
   	@Nullable
   	Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
   			NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;
   
   }
   ```

   

