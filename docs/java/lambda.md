# lambda表达式

是一种表示可以在将来某个时间点执行的代码块（回调）的简洁方法。在JAVA中，*lambda表达式的作用仅仅是转换为[函数式接口](#函数式接口)。* 

### 语法

- 由于JAVA是强类型语言，如果不知道参数的类型，那么必须显式指定类型

  ```java
  (String first, String second)-> {
  	first.length() - second.length()
  }
  ```

- 如果代码块只有一行，可以省略 `{}`；如果有多行，可以放在 `{}` 中，并包含显式的return语句（返回值不是必要的，参照无参表达式代码示例）。

  ```java
  (String first, String second)-> {
  	if(first.length() < second.length()) return -1;
  	else if (first.length() > second.length()) return 1;
  	else return 0;
  }
  ```

- 即使表达式没有参数，也需要提供空括号

  ```java
  ()->{
  	for(int i = 100;i>=0;i--) {
  		System.out.println(i);
  	}
  }
  ```

- 如果编译器可以推导出表达式参数类型，则可以省略

  ```java
  Comparator<String> comp = (first,second)-> {
  	first.length() - second.length()
  }
  ```

- 如果方法只有一个参数，且参数可以被推导出类型，那么可以同时省去小括号和类型信息

  ```java
  ActionListener listener = event -> {
  	System.out.println("The time is " + new Date());
  }
  ```

- 不需要指定表达式的返回值类型，因为这个可以从上下文推导得出。

### 函数式接口

对于**只有一个抽象方法**的[接口](./附录I-JAVA接口.md) ，这种接口称为函数式接口（functional interface）。**可以有多个非抽象方法**。需要这种接口的对象时，可以提供一个**lambda表达式**替代。
可以直接将表达式赋值给函数式接口变量：

```java
ActionListener listener = event -> {
	System.out.println("hello");
}
```



#### 对于只有一个抽象方法的计数问题：

- default方法具有默认实现，不属于抽象方法，不统计在内
- 接口重写了Object类的公共方法，`e.g. Comparator中的equals方法`，不统计在内

来源于 `@FunctionalInterface` 接口的`javadoc` 文档注释

#### `java.util.function` 包

##### `BiFunction<T,U,R>` 

##### `Predicate<T>` 

##### Function<T, R>

#### 常用的函数式接口

<img :src="$withBase='/img/appendix-common-functional-interface.png'" class="align-center"/>

#### 基本类型的函数式接口

<img :src="$withBase='/img/appendix-common-functional-interface-for-base-type.png'" class="align-center"/>

#### `@FunctionalInterface`

该注解用来标识接口是一个函数式接口，该接口在编译时会被编译器检查。但是并不是必须的，实际上根据定义，任何只有一个抽象方法的接口都是函数式接口。

#### 示例

```java
public class Test {

    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9);
        System.out.println("all");
        eval(list, n -> true);
        System.out.println("even number");
        eval(list, n -> n % 2 == 0);
    }
    
    public static void eval(List<Integer> list, Predicate<Integer> predicate) {
        for (Integer n : list) {
            if (predicate.test(n)) {
                System.out.print(n + " ");
            }
        }
        System.out.println();
    }


}
```



### 方法引用

方法引用就像是lambda表达式的简易版本，不使用lambda表达式是因为已经有现成的方法可供使用。

- `object::instanceMethod` 对象实例::该对象实例的方法

  ```
  System.out::println <=> x->System.out.println(x)
  ```

  可以使用this参数

  ```
  this::equals <=> x->this.equals(x)
  ```

  

- `Class::staticMethod` 类::类的静态方法

  ```
  Math::pow <=> (x,y)-> Math.pow(x, y)
  ```

  

- `Class::instanceMethod` 类::类的实例对象的方法，这样写，那么转换成lambda表达式时，第一个参数会成为方法的目标，即方法的调用方

  ```
  String::compareToIgnoreCase <=>
  (x,y)-> x.compareToIgnoreCase(y)
  ```

  可以使用super参数，`super::instanceMethod` ，该形式表示，使用this作为目标，调用给定方法`instanceMethod`的超类版本

  ```java
  public class TimerTest implements Cloneable{
  
      public static void main(String[] args) {
          TimedGreeter timedGreeter = new TimedGreeter();
          timedGreeter.greet();
      }
  
  }
  
  class Greeter {
      public void greet() {
          System.out.println("Hello, world!");
      }
  
      public void greet(ActionEvent actionEvent) {
          System.out.println("Hello, world!");
      }
  }
  
  class TimedGreeter extends Greeter {
      @Override
      public void greet() {
          Timer timer = new Timer(3000, super::greet);
          timer.start();
  
          JOptionPane.showMessageDialog(null, "Quit Program?");
          System.exit(0);
      }
  }
  ```

  

如果有多个重载方法，编译器会根据上下文找出匹配的方法。

### 构造器引用

类似于方法引用，只不过将method名字换成new关键字。

```
Person::new
```

具体调用哪个构造器，编译器根据上下文确定。

使用数组类型建立构造器引用：

```
int[]::new <=> x->new int[x]
```

利用构造器引用返回具体类型的数组：

```java
Person[] men = people.stream()
			.filter(p -> p.getGender() == MALE)
			.toArray(Person[]::new);
```

### 变量作用域

对于没有在表达式内部，即代码块中声明的变量，对于`lambda`表达式来说叫做自由变量值。表达式会捕获（captured）该值。这种概念叫做[闭包（closure）]() ，在JAVA中，lambda表达式就是闭包。

**自由变量值的限制：** 最终变量（effectively final），**即该变量在初始化之后就不会再为它赋新值**。不一定非要是final修饰的，现实意义上的不变也是允许的。这是因为如果并发执行多个动作时，自由变量值可变不安全。

lambda表达式的代码块与它所嵌套的代码块有着相同的作用域。所以要**注意重名问题**。

### Comparator*

关于lambda表达式的许多高级用法，建议先看懂Comparator接口中的使用。
