# SpringBoot

所谓应用程序，就是有许多组件构成，每个组件承担一部分责任，相互协作，完成程序的整套流程。

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

> spring-boot为所有为所有“场景”都规划好了该场景下可能会用到的依赖的版本，我们只需要引入场景依赖（starter依赖）即可

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

- `@Controller`
  控制器类，用来处理请求并以某种方式进行信息相应。

- `@Service`、`@Repository`、`@Component`、`@ComponentScan`

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
  
- `@Profile()`
  根据激活的yaml配置文件的不同来注入不同的组件，属性值为激活yaml文件的后缀

  ```java
  @Configuration(proxyBeanMethods = false)
  @Profile("production")
  public class ProductionConfiguration {
  
      // ...
  
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

   ```java
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

8. Servlet API请求参数

   例如：`WebRequest、ServletRequest、MultipartRequest、 HttpSession、javax.servlet.http.PushBuilder、Principal、InputStream、Reader、HttpMethod、Locale、TimeZone、ZoneId`。都会在**ServletRequestMethodArgumentResolver** 中进行解析。

9. 复杂参数

   1. `Map、Model、HttpServletRequest`，在这些对象中（请求参数）中放数据，都相当于在request中放数据

      ```java
      @Controller
      public class RequestAttributeController {
      
      
          @GetMapping("/goto")
          public String requestGoTo(HttpServletRequest request,
                                    Map<String, Object> map,
                                    Model model,
                                    HttpServletResponse response) {
              request.setAttribute("goto", "跳转。。。。");
              map.put("map", "map");
              model.addAttribute("model", "model");
              Cookie cookie = new Cookie("cookie", "cookie");
              response.addCookie(cookie);
              return "forward:/success";
          }
      
          @ResponseBody
          @GetMapping("/success")
          public Map<String, Object> success(@RequestAttribute(value = "goto") String att,
                                             HttpServletRequest request) {
              Map<String, Object> map = new HashMap<>();
              map.put("map", request.getAttribute("map"));
              map.put("model", request.getAttribute("model"));
              map.put("goto", request.getAttribute("goto"));
              for (Cookie cookie : request.getCookies()) {
                  map.put(cookie.getName(), cookie.getValue());
              }
              return map;
          }
      
      }
      ```

   2. POJO请求参数自动绑定

      1. 由`ServletModelAttributeMethodProcesor`处理器支持，内部判断是否为简单类型（内置的一些类型）
         ```java
         public static boolean isSimpleValueType(Class<?> type) {
         		return (Void.class != type && void.class != type &&
         				(ClassUtils.isPrimitiveOrWrapper(type) ||
         				Enum.class.isAssignableFrom(type) ||
         				CharSequence.class.isAssignableFrom(type) ||
         				Number.class.isAssignableFrom(type) ||
         				Date.class.isAssignableFrom(type) ||
         				Temporal.class.isAssignableFrom(type) ||
         				URI.class == type ||
         				URL.class == type ||
         				Locale.class == type ||
         				Class.class == type));
         	}
         ```

      2. 在处理类型转换时，由`WebDataBinder`数据绑定器，来做数据的类型转换（利用内部的`Converters`，位于`ConversionService`中）与绑定
      
      3. 重定向参数 `RedirectAttributes`，当需要重定向到某个页面或请求需要带参数时使用。
         ```java
             @GetMapping("/user/delete/{id}")
             public String deleteUser(@PathVariable("id") Long id,
                                      @RequestParam(value = "pn",defaultValue = "1")Integer pn,
                                      RedirectAttributes ra){
         
                 userService.removeById(id);
         
                 ra.addAttribute("pn",pn);
                 return "redirect:/dynamic_table";
             }
         ```
      
         

#### 请求参数处理流程

1. HandlerMapping中找到能够处理当前请求的handler
   ```java
   mappedHandler = getHandler(processedRequest);
   ```

   

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

   在处理类型转换时，由`WebDataBinder`数据绑定器，来做数据的类型转换（利用内部的`Converters`，位于`ConversionService`中）与绑定
   
5. 将所有的数据都放在 **ModelAndViewContainer**；包含要去的页面地址View。还包含Model数据。

6. 通过`ModelAndViewContainer`组装`ModelAndView`并返回给`DisPatcherServlet`做后续处理

#### 响应数据

1. `@REsponseBody`，配合json依赖，返回前端json数据。通过`RequestResponseBodyMethodProcessor`类进行处理。

   ```java
       	@Override
   	public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
   			ModelAndViewContainer mavContainer, NativeWebRequest webRequest)
   			throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {
   
   		mavContainer.setRequestHandled(true);
   		ServletServerHttpRequest inputMessage = createInputMessage(webRequest);
   		ServletServerHttpResponse outputMessage = createOutputMessage(webRequest);
   
           // 使用消息转换器进行写出从操作
   		// Try even with null return value. ResponseBodyAdvice could get involved.
   		writeWithMessageConverters(returnValue, returnType, inputMessage, outputMessage);
   	}
   ```

#### 返回值解析器处理流程

1. 返回值处理器判断是否支持这种类型返回值 supportsReturnType

2. 返回值处理器调用 handleReturnValue 进行处理

3. RequestResponseBodyMethodProcessor 可以处理返回值标了@ResponseBody 注解的。

   1. 利用 MessageConverters 进行处理，将数据写为json

      1. 内容协商（浏览器默认会以请求头的方式告诉服务器他能接受什么样的内容类型）

         1. 获取浏览器发来的请求头`Accept`可接受的返回类型信息
            通过**contentNegotiationManager 内容协商管理器** 获取

         ```yaml
         Accept: */*
         ```

         2. 遍历循环所有当前系统的 **MessageConverter**，甄别出可以处理当前返回对象的转换器，并统计出这些转换器支持的媒体类型
         3. 将浏览器接受的返回类型与服务器能够提供的返回类型进行最佳匹配
         4. 使用匹配上的转换器处理当前返回对象

      2. 服务器最终根据自己自身的能力，决定服务器能生产出什么样内容类型的数据，

      3. SpringMVC会挨个遍历所有容器底层的 HttpMessageConverter ，看谁能处理（判断该转换器能够将当前返回类型转换成内容协商之后得到的最佳匹配返回类型）

         1. 得到MappingJackson2HttpMessageConverter可以将对象写为json
         2. 利用MappingJackson2HttpMessageConverter将对象转为json再写出去。





#### 内容协商

内容协商策略通过配置文件配置

```yam
spring:
    contentnegotiation:
      favor-parameter: true
```

此时请求url带上format参数即可，format参数取值范围为`{json,xml}`

```yaml
GET http://localhost:8888/user2?format=json
Accept: application/xml
```

上述请求优先以json格式返回

#### 异常处理

执行目标方法，目标方法运行期间有任何异常都会被catch、而且标志当前请求结束；并且用 **dispatchException** 

2、进入视图解析流程（页面渲染？） 

processDispatchResult(processedRequest, response, mappedHandler, **mv**, **dispatchException**);

3、**mv** = **processHandlerException**；处理handler发生的异常，处理完成返回ModelAndView；

- 1、遍历所有的 **handlerExceptionResolvers，看谁能处理当前异常【**HandlerExceptionResolver处理器异常解析器】
- **2、系统默认的  异常解析器；**
  1. DefaultErrorAttributes先来处理异常。把异常信息保存到rrequest域，并且返回null；
  2. 默认没有任何人能处理异常，所以异常会被抛出
     1. 如果没有任何人能处理最终底层就会发送 /error 请求。会被底层的BasicErrorController处理
     2. 解析错误视图；遍历所有的**ErrorViewResolver  看谁能解析。** 
     3. 默认的 **DefaultErrorViewResolver ,作用是把响应状态码作为错误页的地址，error/500.html** 
     4. 模板引擎最终响应这个页面 **error/500.html** 

注意：Spring自动发出的`/error`请求时内嵌入的tomcat服务器底层封装的**response**来发送的，请求路径是由spring容器覆写的，可以通过yaml文件配置
```java
// org.apache.catalina.core.StandardHostValve
private void status(Request request, Response response) {

        int statusCode = response.getStatus();

        // Handle a custom error page for this status code
        Context context = request.getContext();
        if (context == null) {
            return;
        }

        /* Only look for error pages when isError() is set.
         * isError() is set when response.sendError() is invoked. This
         * allows custom error pages without relying on default from
         * web.xml.
         */
        if (!response.isError()) {
            return;
        }

        ErrorPage errorPage = context.findErrorPage(statusCode);
        if (errorPage == null) {
            // Look for a default error page
            errorPage = context.findErrorPage(0);
        }
        if (errorPage != null && response.isErrorReportRequired()) {
            response.setAppCommitted(false);
            request.setAttribute(RequestDispatcher.ERROR_STATUS_CODE,
                              Integer.valueOf(statusCode));

            String message = response.getMessage();
            if (message == null) {
                message = "";
            }
            request.setAttribute(RequestDispatcher.ERROR_MESSAGE, message);
            request.setAttribute(Globals.DISPATCHER_REQUEST_PATH_ATTR,
                    errorPage.getLocation());
            request.setAttribute(Globals.DISPATCHER_TYPE_ATTR,
                    DispatcherType.ERROR);


            Wrapper wrapper = request.getWrapper();
            if (wrapper != null) {
                request.setAttribute(RequestDispatcher.ERROR_SERVLET_NAME,
                                  wrapper.getName());
            }
            request.setAttribute(RequestDispatcher.ERROR_REQUEST_URI,
                                 request.getRequestURI());
            if (custom(request, response, errorPage)) {
                response.setErrorReported();
                try {
                    response.finishResponse();
                } catch (ClientAbortException e) {
                    // Ignore
                } catch (IOException e) {
                    container.getLogger().warn("Exception Processing " + errorPage, e);
                }
            }
        }
    }

```

#### `DisPatcherServlet`的注册

- 容器中自动配置了`DispatcherServlet`的bean，并且默认的配置类绑定到 `WebMvcProperties`配置类上。
- 容器自动配置了 `DispatcherServletRegistrationBean`类，该类实现了 `ServletRegistrationBean`，通过该注册类，容器将上面注册的`dispatcherServlet` bean，以及默认配置的该`Servlet`的处理路径（映射路径）`/` 配置进容器中

> `Tomcat Servlet`：
>
> 当由Tomcat统一管理的多个配置好的Servlet都能处理到同一路径时，此时执行精确优先原则，例如
>
> AServlet能够处理 `/my`路径
>
> BServlet能够处理 `/my/1`路径
>
> 当请求路径为 `/my/1`时，匹配到BServlet进行处理，而当请求路径为 `/my/2`时，匹配到AServlet进行处理。



#### 嵌入式Servlet容器

> `ServletWebServerApplicationContext` 容器启动寻找`ServletWebServerFactory` 并引导创建服务器

默认支持的`WebServer`

- Tomcat
- Jetty
- Undertow

原理

- SpringBoot应用启动发现当前是Web应用。web场景包-导入tomcat
- web应用会创建一个web版的ioc容器 `ServletWebServerApplicationContext` 
- `ServletWebServerApplicationContext` 启动的时候寻找 `ServletWebServerFactory（Servlet 的web服务器工厂---> Servlet 的web服务器）` 
- SpringBoot底层默认有很多的WebServer工厂；`TomcatServletWebServerFactory`, `JettyServletWebServerFactory`, or `UndertowServletWebServerFactory`
- `底层直接会有一个自动配置类。ServletWebServerFactoryAutoConfiguration`
- `ServletWebServerFactoryAutoConfiguration导入了ServletWebServerFactoryConfiguration（配置类）`
- `ServletWebServerFactoryConfiguration 配置类 根据动态判断系统中到底导入了那个Web服务器的包。（默认是web-starter导入tomcat包），容器中就有 TomcatServletWebServerFactory`
- `TomcatServletWebServerFactory 创建出Tomcat服务器并启动；TomcatWebServer 的构造器拥有初始化方法initialize---this.tomcat.start();`
- `内嵌服务器，就是手动把启动服务器的代码调用（tomcat核心jar包存在）`

#### 定制化原理

##### 1、定制化的常见方式 

- 修改配置文件；
- **xxxxxCustomizer；**
- **编写自定义的配置类   xxxConfiguration；+** **@Bean替换、增加容器中默认组件；例如视图解析器** 
- **Web应用 编写一个配置类实现** **WebMvcConfigurer 即可定制化web功能；+ @Bean给容器中再扩展一些组件**

```java
@Configuration
public class AdminWebConfig implements WebMvcConfigurer
```

- @EnableWebMvc + WebMvcConfigurer —— @Bean  可以全面接管SpringMVC，所有规则全部自己重新配置； 实现定制和扩展功能

原理

- 1、`WebMvcAutoConfiguration`  默认的`SpringMVC`的自动配置功能类。静态资源、欢迎页.....
- 2、一旦使用 `@EnableWebMvc` 。会 `@Import(DelegatingWebMvcConfiguration.class)`
- 3、`DelegatingWebMvcConfiguration` 的 作用，只保证SpringMVC最基本的使用

- 把所有系统中的 `WebMvcConfigurer` 拿过来。所有功能的定制都是这些 WebMvcConfigurer  合起来一起生效
- 自动配置了一些非常底层的组件。`RequestMappingHandlerMapping`、这些组件依赖的组件都是从容器中获取
- **public class** DelegatingWebMvcConfiguration **extends** **WebMvcConfigurationSupport**

- 4、**WebMvcAutoConfiguration** 里面的配置要能生效 必须  @ConditionalOnMissingBean(**WebMvcConfigurationSupport**.**class**)
- 5、@EnableWebMvc  导致了 **WebMvcAutoConfiguration  没有生效。**



##### 2、原理分析套路

**场景starter** **- xxxxAutoConfiguration - 导入xxx组件 - 绑定xxxProperties --** **绑定配置文件项** 

## SpringBoot启动过程

### 创建`SpringApplication`

1. 保存一些信息
2. 判定当前应用的类型。`ClassUtils`。`Servlet`
3. **`bootstrappers`**：初始启动引导器（**`List<Bootstrapper>`**）：去`spring.factories`文件中找`org.springframework.boot.Bootstrapper`
4. 找 **`ApplicationContextInitializer`**；去**`spring.factories`**找 **`ApplicationContextInitializer`** 
   - `List<ApplicationContextInitializer<?>> initializers`
5. **找** **`ApplicationListener`  ；应用监听器。**去**`spring.factories`**找 **`ApplicationListener`**
   - `List<ApplicationListener<?>> listeners`

### 运行`SpringApplication`

1. `StopWatch`，记录应用的启动时间
2. 创建引导上下文（Context环境）**`createBootstrapContext()`** 
   - 获取到所有之前的 **`bootstrappers` 挨个执行** `intitialize()` 来完成对引导启动器上下文环境设置
3. 让当前应用进入**headless**模式。**`java.awt.headless`**
4. 获取所有**`RunListener`**（运行监听器）【为了方便所有Listener进行事件感知】
   - `getSpringFactoriesInstances` 去**`spring.factories`**找**`SpringApplicationRunListener`**. 
5. 遍历 **`SpringApplicationRunListener` 调用 starting 方法；**
   - **相当于通知所有感兴趣系统正在启动过程的人，项目正在 starting。** 
6. 保存命令行参数；`ApplicationArguments` 
7. 准备环境 `prepareEnvironment（）`;
   1. 返回或者创建基础环境信息对象。**`StandardServletEnvironment`**
   2. **配置环境信息对象**，**读取所有的配置源的配置属性值** 
   3. 绑定环境信息
   4. 监听器调用 `listener.environmentPrepared()；`通知所有的监听器当前环境准备完成
8. 创建`IOC`容器（`createApplicationContext（）`）
   1. 根据项目类型（`Servlet`）创建容器，当前会创建 **`AnnotationConfigServletWebServerApplicationContext`** 
9. **准备`ApplicationContext IOC`容器的基本信息**  **`prepareContext()`** 
   1. 保存环境信息
   2. `IOC`容器的后置处理流程。
   3. 应用初始化器；`applyInitializers；`
      1. 遍历所有的 **`ApplicationContextInitializer` 。调用** **`initialize`.。来对`ioc`容器进行初始化扩展功能** 
      2. 遍历所有的 `listener` 调用 **`contextPrepared`。`EventPublishRunListenr`；通知所有的监听器**`contextPrepared`
   4. **所有的监听器 调用** **`contextLoaded`。通知所有的监听器** **`contextLoaded`；** 
10. **刷新`IOC`容器。**`refreshContext`
    1. 创建容器中的所有组件
11. 容器刷新完成后工作 `afterRefresh`
12. 所有监听器 调用 `listeners.started(context);` **通知所有的监听器** **`started`** 
13. **调用所有`runners`；**`callRunners()` 
    1. **获取容器中的** **`ApplicationRunner`** 
    2. **获取容器中的**  **`CommandLineRunner`**
    3. **合并所有runner并且按照@Order进行排序**
    4. **遍历所有的runner。调用 run** **方法** 
14. **如果以上有异常** ，**调用`Listener` 的 failed**  
15. **调用所有监听器的 running 方法**  `listeners.running(context);` **通知所有的监听器** **running** 
16. running如果有问题。继续通知 failed 。**调用所有 Listener 的** **failed；**通知所有的监听器 **failed** 
