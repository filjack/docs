# 常用关键字

## final

### 实例域

#### 使用要求

构建对象时必须初始化，必须确保在**每一个构造器执行之后**，该域的值被设置，并且在后面的操作中不能够再被修改。

#### 应用范围

一般应用于**基本（primitive）类型域**，或**不可变（immutable）类的域**。用在**类**上，表示该类是不可变类（类中的每个方法都不会改变其对象，例如String）。

用于**可变类型**上时，只是表示该变量的引用不会改变，但是引用的对象是可变的。

```java
private final StringBuilder evaluations;
```

如果类被声明为final，类内部的域不会自动的成为final，但是方法会自动成为final方法。

### 方法

类中的方法如果被final修饰符修饰，该方法将不允许子类覆盖。且final类中的方法自动成为final方法。

final关键字可以避免动态绑定带来的系统开销：如果一个方法没有被覆盖且很短，编译器能够进行优化处理，处理过程称为**内联（`inlining`）** 

```
e.getName() -> e.name
```

目前虚拟机中的即时编译器比传统编译器的处理能力要强。他可以准确地知道类之间的继承关系，并能够检测出类中是否真正存在覆盖给定的方法。如果方法很简短、被频繁调用且没有真正地被覆盖，那么即时编译器会对其进行内联处理。之后如果发现被覆盖，内联将会取消。

### 类

final修饰符修饰类，该类不能被继承，例如String类

## static

### 静态域

静态域是类共享的，每个对象都共享该静态域；对于普通实例域来说，每个对象都有一份自己的拷贝（对象私有）。

### 静态常量

`static final` 修饰。

### 静态方法

类方法，和普通方法不同，静态方法没有隐式参数（this）；其次，静态方法不需要使用对象来调用，直接类名调用。由于静态方法没有this隐式参数，所以无法访问该对象普通实例域，可以访问类中的静态域。静态方法只能调用该类的静态方法

**建议在以下情况使用静态方法：** 

- 方法不需要访问对象的状态，其所需参数都是通过显示参数提供（例如`Math.pow`） 
- 方法只需要访问类的静态域

#### 工厂方法

参见 `LocalDate`类和`NumberFormat`类构造对象的方式。

**为什么使用静态工厂方法获取对象而不是构造器：** 

- 无法命名构造器。构造器的名字必须与类名相同，但是这里想要获取该类的子类。
- 当使用构造器时，无法改变所构造的对象类型。同上，工厂方法可以返回子类型。

## `strictfp` 

## `instanceof`

该关键字的操作数必须是引用类型或`null`类型，且位于该关键字后的操作数必须是可具体化的（非类型参数）

## synchronized

### 原理

`synchronized`是java的一个内置锁，使用之后，在编译后会在锁住的代码块前后加上`monitorenter`和`monitorexit`字节码指令，依赖操作系统底层的互斥锁实现。

当执行`monitorenter`时会尝试获取对象锁，如果该对象未加锁或者锁已经被当前线程得到，则锁计数器加一。

当执行`monitorexist`时会使得锁计数器减一，当锁计数器减为零时，锁被释放。异常抛出也会执行一次`monitorexist` ，`jvm`保证每个`monitorenter`都对应有一个`monitorexist`。

`synchronized`拥有两个队列--`waitSet、entryList`

1. 当多个线程进入同步代码块时，首先进入`entryList`
2. 当有一个线程获取到monitor锁后，就赋值给当前线程，并且锁计数器加一
3. 如果线程调用`wait`方法，将释放锁，同时计入`waitSet`队列等待被唤醒。调用notify或者`notifyAll`之后又会进入`entryList`竞争锁
4. 如果线程执行完毕，释放锁，计数器减一

<img :src="$withBase='/img/appendix-synchronize-queue.png'" class="align-center"/>

### 代码

- `javac Hello.java` 

  ```java
  public class Hello implements Runnable {
  
      private static Object obj = new Object();
      @Override
      public void run(){
          for(int i = 0; i < 1000; i++){
              synchronized( obj ){
                  System.out.println("1");
              }
          }
      }
  
      public synchronized void test(){
          System.out.println("a");
      }
  
  }
  ```

- `javap -p -v Hello.class` 

  ```shell
  Classfile /C:/Users/xpf14/AppData/LocalRepository/removing/dfei/src/main/java/base/Hello.class
    Last modified 2023年2月3日; size 719 bytes
    SHA-256 checksum b89d06c6dae5df42411935a57ab681c4899f35a30ee4f79fa7e002eebbc98e55
    Compiled from "Hello.java"
  public class base.Hello implements java.lang.Runnable
    minor version: 0
    major version: 61
    flags: (0x0021) ACC_PUBLIC, ACC_SUPER
    this_class: #8                          // base/Hello
    super_class: #2                         // java/lang/Object
    interfaces: 1, fields: 1, methods: 4, attributes: 1
  Constant pool:
     #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
     #2 = Class              #4             // java/lang/Object
     #3 = NameAndType        #5:#6          // "<init>":()V
     #4 = Utf8               java/lang/Object
     #5 = Utf8               <init>
     #6 = Utf8               ()V
     #7 = Fieldref           #8.#9          // base/Hello.obj:Ljava/lang/Object;
     #8 = Class              #10            // base/Hello
     #9 = NameAndType        #11:#12        // obj:Ljava/lang/Object;
    #10 = Utf8               base/Hello
    #11 = Utf8               obj
    #12 = Utf8               Ljava/lang/Object;
    #13 = Fieldref           #14.#15        // java/lang/System.out:Ljava/io/PrintStream;
    #14 = Class              #16            // java/lang/System
    #15 = NameAndType        #17:#18        // out:Ljava/io/PrintStream;
    #16 = Utf8               java/lang/System
    #17 = Utf8               out
    #18 = Utf8               Ljava/io/PrintStream;
    #19 = String             #20            // 1
    #20 = Utf8               1
    #21 = Methodref          #22.#23        // java/io/PrintStream.println:(Ljava/lang/String;)V
    #22 = Class              #24            // java/io/PrintStream
    #23 = NameAndType        #25:#26        // println:(Ljava/lang/String;)V
    #24 = Utf8               java/io/PrintStream
    #25 = Utf8               println
    #26 = Utf8               (Ljava/lang/String;)V
    #27 = String             #28            // a
    #28 = Utf8               a
    #29 = Class              #30            // java/lang/Runnable
    #30 = Utf8               java/lang/Runnable
    #31 = Utf8               Code
    #32 = Utf8               LineNumberTable
    #33 = Utf8               run
    #34 = Utf8               StackMapTable
    #35 = Class              #36            // java/lang/Throwable
    #36 = Utf8               java/lang/Throwable
    #37 = Utf8               test
    #38 = Utf8               <clinit>
    #39 = Utf8               SourceFile
    #40 = Utf8               Hello.java
  {
    private static java.lang.Object obj;
      descriptor: Ljava/lang/Object;
      flags: (0x000a) ACC_PRIVATE, ACC_STATIC
  
    public base.Hello();
      descriptor: ()V
      flags: (0x0001) ACC_PUBLIC
      Code:
        stack=1, locals=1, args_size=1
           0: aload_0
           1: invokespecial #1                  // Method java/lang/Object."<init>":()V
           4: return
        LineNumberTable:
          line 7: 0
  
    public void run();
      descriptor: ()V
      flags: (0x0001) ACC_PUBLIC
      Code:
        stack=2, locals=4, args_size=1
           0: iconst_0
           1: istore_1
           2: iload_1
           3: sipush        1000
           6: if_icmpge     39
           9: getstatic     #7                  // Field obj:Ljava/lang/Object;
          12: dup
          13: astore_2
          14: monitorenter
          15: getstatic     #13                 // Field java/lang/System.out:Ljava/io/PrintStream;
          18: ldc           #19                 // String 1
          20: invokevirtual #21                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
          23: aload_2
          24: monitorexit
          25: goto          33
          28: astore_3
          29: aload_2
          30: monitorexit
          31: aload_3
          32: athrow
          33: iinc          1, 1
          36: goto          2
          39: return
        Exception table:
           from    to  target type
              15    25    28   any
              28    31    28   any
        LineNumberTable:
          line 12: 0
          line 13: 9
          line 14: 15
          line 15: 23
          line 12: 33
          line 17: 39
        StackMapTable: number_of_entries = 4
          frame_type = 252 /* append */
            offset_delta = 2
            locals = [ int ]
          frame_type = 255 /* full_frame */
            offset_delta = 25
            locals = [ class base/Hello, int, class java/lang/Object ]
            stack = [ class java/lang/Throwable ]
          frame_type = 250 /* chop */
            offset_delta = 4
          frame_type = 250 /* chop */
            offset_delta = 5
  
    public synchronized void test();
      descriptor: ()V
      flags: (0x0021) ACC_PUBLIC, ACC_SYNCHRONIZED
      Code:
        stack=2, locals=1, args_size=1
           0: getstatic     #13                 // Field java/lang/System.out:Ljava/io/PrintStream;
           3: ldc           #27                 // String a
           5: invokevirtual #21                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
           8: return
        LineNumberTable:
          line 20: 0
          line 21: 8
  
    static {};
      descriptor: ()V
      flags: (0x0008) ACC_STATIC
      Code:
        stack=2, locals=0, args_size=0
           0: new           #2                  // class java/lang/Object
           3: dup
           4: invokespecial #1                  // Method java/lang/Object."<init>":()V
           7: putstatic     #7                  // Field obj:Ljava/lang/Object;
          10: return
        LineNumberTable:
          line 9: 0
  }
  SourceFile: "Hello.java"
  ```


## `abstract` 

用来修改类与方法，代表抽象。

- 修饰方法：不能与 `private、final、static`关键字合用

- 修饰内部类：不能与final合用

- 修饰外部类：不能与 `final、static`合用（外部类的访问修饰符语法要求只能是`public或默认`的）
