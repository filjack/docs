# 接口VS抽象类

> **注意接口与抽象类的概念特性，而不是具体语言实现代码，只要满足既定的形式，就可以称得上是抽象类或接口。**  
>
> ***这节主要是概念，而非特指某种语言的语法*** 

## 抽象类

> 抽象类就是一种类，能够表示`is-a`的关系

### 抽象类基本特性

1. 不允许被实例化，只能被继承
2. 可以包含属性和方法。方法既可以包含代码实现，也可以不包含代码实现。不包含代码实现的方法叫做抽象方法
3. 子类继承抽象类，必须实现抽象类中所有的抽象方法

### 抽象类的意义

1. 能够**很优雅的**达到代码复用的目的
2. 能够实现多态

使用继承来达到代码复用，以及多态的效果

```java
public class Logger {
  // ...省略部分代码...
  public void log(Level level, String mesage) { // do nothing... }
}
public class FileLogger extends Logger {
  // ...省略部分代码...
  @Override
  public void log(Level level, String mesage) {
    if (!isLoggable()) return;
    // 格式化level和message,输出到日志文件
    fileWriter.write(...);
  }
}
public class MessageQueueLogger extends Logger {
  // ...省略部分代码...
  @Override
  public void log(Level level, String mesage) {
    if (!isLoggable()) return;
    // 格式化level和message,输出到消息中间件
    msgQueueClient.send(...);
  }
}

```

使用抽象类来达到代码复用以及多态的效果

```java
// 抽象类
public abstract class Logger {
  private String name;
  private boolean enabled;
  private Level minPermittedLevel;

  public Logger(String name, boolean enabled, Level minPermittedLevel) {
    this.name = name;
    this.enabled = enabled;
    this.minPermittedLevel = minPermittedLevel;
  }
  
  public void log(Level level, String message) {
    boolean loggable = enabled && (minPermittedLevel.intValue() <= level.intValue());
    if (!loggable) return;
    doLog(level, message);
  }
  
  protected abstract void doLog(Level level, String message);
}
// 抽象类的子类：输出日志到文件
public class FileLogger extends Logger {
  private Writer fileWriter;

  public FileLogger(String name, boolean enabled,
    Level minPermittedLevel, String filepath) {
    super(name, enabled, minPermittedLevel);
    this.fileWriter = new FileWriter(filepath); 
  }
  
  @Override
  public void doLog(Level level, String mesage) {
    // 格式化level和message,输出到日志文件
    fileWriter.write(...);
  }
}
// 抽象类的子类: 输出日志到消息中间件(比如kafka)
public class MessageQueueLogger extends Logger {
  private MessageQueueClient msgQueueClient;
  
  public MessageQueueLogger(String name, boolean enabled,
    Level minPermittedLevel, MessageQueueClient msgQueueClient) {
    super(name, enabled, minPermittedLevel);
    this.msgQueueClient = msgQueueClient;
  }
  
  @Override
  protected void doLog(Level level, String mesage) {
    // 格式化level和message,输出到消息中间件
    msgQueueClient.send(...);
  }
}

```



## 接口类

> 接口表示一种`has-a`的关系，表示具有某些功能。对于接口，有一种更加形象的叫法，协议（contract）

### 接口类基本特性

1. 不能包含属性
2. 接口只能声明方法，方法不能包含代码实现
3. 类实现接口时，必须实现接口中声明的所有方法

### 接口类的意义

1. 接口类更侧重于解耦，**其是对行为的一种抽象**，相当于一组协议或契约。接口实现了约定和实现相分离的作用，可以降低代码间的耦合性，提高代码的可扩展性。



## 如何模拟抽象类和接口？

1. 可以使用抽象类来模拟接口，只要抽象类中只定义抽象方法即可；或者用普通类来模拟接口，声明的方法中抛出异常来强制实现类自己实现该方法。

## 如何决定该用接口还是抽象类？

1. 如果我们要表示一种**is-a的关系**，并且是为了**解决代码复用**的问题，我们就用**抽象类**；如果我们要表示一种**has-a关系**，并且是为了**解决抽象**而非代码复用的问题，那我们就可以使用**接口**。
2. 从类的继承层次上来看，**抽象类**是一种**自下而上**的设计思路，先有子类的代码重复，然后再抽象成上层的父类（也就是抽象类）。而**接口**正好相反，它是一种**自上而下**的设计思路。我们在编程的时候，一般都是先设计接口，再去考虑具体的实现。