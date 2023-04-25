# [代理（proxy）](https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/proxy.html)

### 什么时候使用代理

- 在编译时无法确定需要实现哪个接口，需要在运行时创建一个实现了一组给定接口的新类

### 代理类具有的方法

- 指定接口所需要的全部方法
- Object类中的全部方法，`e.g. toString、equals` 等

不能在运行时定义这些方法的新代码，而是要提供一个调用处理器（invocation handler）。调用处理器实现了`InvocationHandler`接口。`InvocationHandler`接口中只有一个方法

```java
Object invoke(Object proxy, Mehtod method, Object[] args)
```

调用代理对象的方法，即通过调用处理器的invoke方法来进行处理。

### 创建代理对象

使用 `Proxy` 类的 `newProxyInstance` 方法，需要三个参数：

- 一个类加载器（class loader），有不同的[类加载器]()，使用null表示使用默认的类加载器
- 一个Class对象数组，数组中每个元素都是需要实现的接口，----该数组必须是接口数组（不能是类或类型变量）；数组中每个接口不重复。
- 一个调用处理器

```java
public class ProxyTest {

    public static void main(String[] args) {




        Object[] elements = new Object[1000];

        for (int i = 0; i < elements.length; i++) {
            Integer value = i + 1;
            InvocationHandler handler = new TraceHandler(value);
            Object proxy = Proxy.newProxyInstance(null, new Class[]{Comparable.class}, handler);
            elements[i] = proxy;
        }

        Integer key = new Random().nextInt(elements.length) + 1;

        System.out.println("key = " + key);

        int result = Arrays.binarySearch(elements, key);

        if (result > 0) {
            System.out.println(elements[result]);
        }
    }

}

class TraceHandler implements InvocationHandler {

    private Object target;

    public TraceHandler(Object t) {
        target = t;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

        System.out.print(target);

        System.out.print("." + method.getName() + "(");

        if (args != null) {
            for (int i = 0; i < args.length; i++) {
                System.out.print(args[i]);
                if (i < args.length - 1) {
                    System.out.print(",");
                }
            }
        }
        System.out.println(")");
        return method.invoke(target, args);
    }
}
/*
key = 339
500.compareTo(339)
250.compareTo(339)
375.compareTo(339)
312.compareTo(339)
343.compareTo(339)
327.compareTo(339)
335.compareTo(339)
339.compareTo(339)
339.toString()
339
*/
```



### 代理类的特性

- 代理类是在程序运行过程中创建的，一旦被创建，就变成了常规类，与虚拟机中的其他任何类没有什么区别

- 所有代理类都扩展于Proxy类。一个代理类只有一个实例域，就是调用处理器，定义在Proxy的超类中。**为了能够履行代理对象的职责，所需要的任何附加数据都必须存储在调用处理器中。** 

- 所有代理类都覆盖了Object类中的`toString、equals、hashCode` 方法。invoke方法除了调用所需实现的接口中的方法外，这三个方法也可以通过invoke调用。Object类中的其他方法没有被重新定义。

- JAVA没有定义代理类的名字，Sun虚拟机中Proxy类将生成一个以字符串`$Proxy` 开头的字符。

- 对于特定的类加载器和预设的一组接口来说，只能有一个代理类。即，使用同一个类加载器和接口数组，不管调用几次`newProxyInstance` 方法，只能得到同一个类的多个对象，也可以利用`getProxyClass`方法获得这个类

  ```java
  Class proxyClass = Proxy.getProxyClass(null, interfaces);
  ```

- 代理类一定是public和final的。如果代理类实现的所有接口都是public，代理类就不属于某个特定的包；否则，所有非公有的接口都必须属于同一个包，同时，代理类也属于这个包

- 可以通过调用Proxy类中的`isProxyClass` 方法检测一个特定的Class对象是否代表一个代理类。