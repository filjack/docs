# 常用注解

## Spring

### `@Bean`

通常使用在配置类中，声明在方法上，将该方法返回的对象作为组件注入到容器中。方法名为组件id、方法返回值类型为组件类型、方法返回值为组件实例。

`@Configuration`

声明一个配置类，作为组件注入容器中。

- proxyBeanMethods属性，当值为false时，代表Lite模式，此时，该配置中标有`@Bean`注解的方法无论调用多少次，返回实例组件都是新创建的，与容器中保存的单实例不同；当值为true时，每个@Bean注解标注的方法返回的实例组件都是容器中保存的单实例组件
- 当需要通过配置类来获取组件，而不是通过容器时：如果组件之间没有依赖关系，建议使用Lite模式，能够加速容器启动；如果组件之间有依赖关系，建议使用Full模式。具体如何使用根据实际使用场景来判断。

```java
@Configuration(proxyBeanMethods = false)
public class CustomConfig {

    @Bean
    public User user01() {
        User user = new User("张三", 18);
        user.setPet(cat());
        return user;
    }

    @Bean
    public Pet cat() {
        return new Pet("cat");
    }


}
```

### `@Controller`

### `@Service`

### `@Repository`

### `@Component`

### `@ComponentScan`

### `@Import`

### `@Conditional`及其扩展注解

## Spring WEB MVC

### `@ResponseBody`

### `@RestController`

### `@ModelAttribute`

用在方法或方法参数上，

### `@SessionAttributes`

用在类上（一般是标注了`@RequestMapping`的类），注解的值列出了该类中即将要放入model中的数据会在当前会话完成之前一直存在。当程序指示当前会话结束后会被移除。

## Spring Boot