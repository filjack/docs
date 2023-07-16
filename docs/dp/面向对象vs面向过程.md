# 面向对象VS面向过程

## 面向对象

> 面向对象编程风格是一种自底向上的思考方式。它不是先去按照执行流程来分解任务，而是将任务翻译成一个一个的小的模块（也就是类），设计类之间的交互，最后按照流程将类组装起来，完成整个任务。

### 基本概念

#### 面向对象分析（做什么）

#### 面向对象设计（怎么做）

> 面向对象分析、设计的产出结果是类的设计，包括程序被拆解为哪些类，每个类有哪些属性方法、类与类之间如何交互等等。

#### 面向对象编程（代码实现）

面向对象编程是一种编程范式或编程风格。它以类或对象作为组织代码的基本单元，并将封装、抽象、继承、多态四个特性，作为代码设计和实现的基石 。

#### 面向对象编程语言

面向对象编程语言是支持类或对象的语法机制，并有现成的语法机制，能方便地实现面向对象编程四大特性（封装、抽象、继承、多态）的编程语言。

实际上，只要满足支持**类与对象**的语法机制，并以此作为代码组织的基本单元，就可以认为该语言是面向对象编程语言。



### 四大特性

#### 封装（Encapsulation）

##### 封装定义

封装也叫作信息隐藏或者数据访问保护。类通过暴露有限的访问接口，授权外部仅能通过类提供的方式（或者叫函数）来访问内部信息或者数据。

封装特性需要语言提供**访问权限控制**这一语法机制来支持。

封装特性是面向对象编程相比于面向过程编程的一个最基本的区别，因为它基于的是面向对象编程中最基本的类的概念。

##### 封装意义

- 对类中的属性的访问权限做限制，使得属性不能被随意修改，有利于提高代码的易维护性。
- 仅仅开放有限的方法供使用者使用，这样用户不必过深了解实现业务的细节，在一定程度上提高了类的易用性

#### 抽象（Abstraction）

##### 抽象定义

抽象讲的是如何隐藏方法的具体实现，让调用者只需要关心方法提供了哪些功能，并不需要知道这些功能是如何实现的。

抽象这一特性，只需要语言提供**“函数”**（类的方法就是通过函数机制实现，所以抽象性，并不一定非得需要接口类或者抽象类）这一非常基础的语法机制就可以实现，没有很强的“特异性”，所以有时候并不被视为是面向对象编程的特性之一。

##### 抽象意义

- 抽象作为一种只关注功能点不关注实现的设计思路，是处理复杂性的有效手段
- 基于接口的抽象，可以让我们在不改变原有实现的情况下，轻松替换新的实现逻辑，提高了代码的可扩展性。
- 在代码设计中，起到非常重要的指导作用。很多设计原则都体现了抽象这种设计思想

#### 继承（Inheritance）

##### 继承定义

继承特性是面向对象编程相比于面向过程编程所特有的两个特性之一。

继承是用来表示类之间的is-a关系。从继承关系上来讲，继承可以分为两种模式，单继承和多继承。单继承表示一个子类只继承一个父类，多继承表示一个子类可以继承多个父类。

为了实现继承这个特性，编程语言需要提供特殊的语法机制来支持，比如Java使用extends关键字来实现继承。

##### 继承意义

- 代码复用，重用父类中的代码，避免代码重复写多遍
- 符合人对于事物之间关系的认知

过度使用继承，继承层次过深过复杂，就会导致代码可读性、可维护性变差；还会造成子类和父类高度耦合，修改父类的代码，会直接影响到子类。

#### 多态（Polymorphism）

##### 多态定义

多态特性是面向对象编程相比于面向过程编程所特有的两个特性之一

多态是指，子类可以替换父类，在实际的代码运行过程中，调用子类的方法实现。

多态需要编程语言提供特殊的语法机制来实现，例如

- 父类对象引用子类对象
- 继承
- 子类可以重写父类方法
- 接口类语法
- duck-typing语法

> **鸭子类型**（英语：**duck typing**）是动态类型的一种风格。在这种风格中，一个对象有效的语义，不是由继承自特定的类或实现特定的接口，而是由"当前方法和属性的集合"决定。**在函数的参数中可以接受任意类型的对象，只要该对象具有函数需要调用的方法和属性即可。**
>
> “当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。”

##### 多态意义

1. 多态特性遵从了“对修改关闭、对扩展开放”的设计原则，提高代码的扩展性。除此之外，利用多态特性，不同的类对象可以传递给相同的方法，执行不同的代码逻辑，提高了代码的复用性。
2. 多态是很多设计模式、设计原则、编程技巧的代码实现基础，比如策略模式、基于接口而非实现编程、依赖倒置原则、里式替换原则、利用多态去掉冗长的if-else语句等等。

## 面向过程

> 面向过程编程风格会思考，应该先做什么、后做什么，如何一步一步地顺序执行一系列操作，最后完成整个任务。

### 基本概念

#### 面向过程编程

面向过程编程也是一种编程范式或编程风格。它以过程（可以理解为方法、函数、操作）作为组织代码的基本单元，以数据（可以理解为成员变量、属性）与方法相分离为最主要的特点。面向过程风格是一种流程化的编程风格，通过拼接一组顺序执行的方法来操作数据完成一项功能。

#### 面向过程编程语言

面向过程编程语言首先是一种编程语言。它最大的特点是不支持类和对象两个语法概念，不支持丰富的面向对象编程特性（比如继承、多态、封装），仅支持面向过程编程。

## 面向对象编程 VS 面向过程编程

1. 面向过程和面向对象最基本的区别就是，代码的组织方式不同。面向过程风格的代码被组织成了一组方法集合及其数据结构，方法和数据结构的定义是分开的。面向对象风格的代码被组织成一组类，方法和数据结构被绑定一起，定义在类中。

   ```c++
   // 面向过程编程
   
   struct User {
     char name[64];
     int age;
     char gender[16];
   };
   
   struct User parse_to_user(char* text) {
     // 将text(“小王&28&男”)解析成结构体struct User
   }
   
   char* format_to_text(struct User user) {
     // 将结构体struct User格式化成文本（"小王\t28\t男"）
   }
   
   void sort_users_by_age(struct User users[]) {
     // 按照年龄从小到大排序users
   }
   
   void format_user_file(char* origin_file_path, char* new_file_path) {
     // open files...
     struct User users[1024]; // 假设最大1024个用户
     int count = 0;
     while(1) { // read until the file is empty
       struct User user = parse_to_user(line);
       users[count++] = user;
     }
     
     sort_users_by_age(users);
     
     for (int i = 0; i < count; ++i) {
       char* formatted_user_text = format_to_text(users[i]);
       // write to new file...
     }
     // close files...
   }
   
   int main(char** args, int argv) {
     format_user_file("/home/zheng/user.txt", "/home/zheng/formatted_users.txt");
   }
   
   ```

   ```java
   // 面向对象编程
   
   public class User {
     private String name;
     private int age;
     private String gender;
     
     public User(String name, int age, String gender) {
       this.name = name;
       this.age = age;
       this.gender = gender;
     }
     
     public static User praseFrom(String userInfoText) {
       // 将text(“小王&28&男”)解析成类User
     }
     
     public String formatToText() {
       // 将类User格式化成文本（"小王\t28\t男"）
     }
   }
   
   public class UserFileFormatter {
     public void format(String userFile, String formattedUserFile) {
       // Open files...
       List users = new ArrayList<>();
       while (1) { // read until file is empty 
         // read from file into userText...
         User user = User.parseFrom(userText);
         users.add(user);
       }
       // sort users by age...
       for (int i = 0; i < users.size(); ++i) {
         String formattedUserText = user.formatToText();
         // write to new file...
       }
       // close files...
     }
   }
   
   public class MainApplication {
     public static void main(String[] args) {
       UserFileFormatter userFileFormatter = new UserFileFormatter();
       userFileFormatter.format("/home/zheng/users.txt", "/home/zheng/formatted_users.txt");
     }
   }
   
   ```

2. OOP更加能够应对大规模复杂程序的开发

3. OOP风格的代码更易复用、易维护、易扩展

4. OOP语言更加人性化、更加高级、更加智能

## 甄别OOP语言代码设计

有时候，我们在使用OOP语言进行代码设计时，编写出来的风格却是面向过程的，这些有时候是我们的无意之举，如何甄别？

### 滥用getter、setter方法

由面向对象的封装特性可知，面向对象要求用户只能通过暴漏的方法来修改对象的属性，如果都定义出getter、setter方法，这明显破坏了程序的封装性。

在设计实现类的时候，除非真的需要，否则，尽量不要给属性定义setter方法。除此之外，尽管getter方法相对setter方法要安全些，但是如果返回的是集合容器，也要防范集合内部数据被修改的危险。

### 滥用全局变量和全局方法

#### 全局变量

对于全局变量的使用，我们经常是放到一个constants类中统一维护

```java
public class Constants {
  public static final String MYSQL_ADDR_KEY = "mysql_addr";
  public static final String MYSQL_DB_NAME_KEY = "db_name";
  public static final String MYSQL_USERNAME_KEY = "mysql_username";
  public static final String MYSQL_PASSWORD_KEY = "mysql_password";
  
  public static final String REDIS_DEFAULT_ADDR = "192.168.7.2:7234";
  public static final int REDIS_DEFAULT_MAX_TOTAL = 50;
  public static final int REDIS_DEFAULT_MAX_IDLE = 50;
  public static final int REDIS_DEFAULT_MIN_IDLE = 20;
  public static final String REDIS_DEFAULT_KEY_PREFIX = "rt:";
  
  // ...省略更多的常量定义...
}

```

但是这样做有利又有弊

1. 这样的设计会影响代码的可维护性，因为随着项目开发，这个文件会越来越大
2. 这样的设计会增加代码的编译时间，因为依赖该文件的类会越来越多，这样每当该类发生变化，都会导致依赖它的类重新编译。（我们本地每一次单元测试，都会对代码进行编译，这样一看可能会影响我们的开发效率）
3. 这样的设计会影响代码的复用性，因为所有的全局变量都维护在这个类中，那么当其他项目想要复用本项目的某个功能时，不得不将全局变量类也搬过去，引入了很多无关常量；即使搬运过程时删除不需要的常量，也是一项耗时耗力的工程。

设计建议：

1. 拆分成分模块的不同常量类
2. 直接将常量维护到使用它的类中



#### 全局方法

对于全局方法，我们经常写一个util类，该类不需要任何属性，是彻彻底底的面向过程风格，我们要确保我们确实需要一个util类来处理代码复用问题。

但是该类的出现是为了解决代码复用问题的，如果两个类都有一段相同的代码逻辑，如果两个类有相关关系，那么我们可以抽出来一个父类，将该逻辑写到父类中。但是大部分情况下可能两个类没有任何关系，此时我们可以思考是否要抽出来一个util类。

在设计util类时，建议也将类细化一下，分功能模块，比如FileUtil、IOUtil、StringUtil等，不要设计一个过于大而全的util类。

### 定义数据和方法分离的类

数据定义在一个类中，方法定义在另一个类中。在基于MVC三层结构的Web项目，都是采用这种开发模式，叫做基于[贫血模型]()的开发模式。