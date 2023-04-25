# 面向对象设计

## 基本概念

#### 类

是构造对象的模板或者蓝图。

#### 创建实例

由类构造（construct）对象的过程称为创建类的实例（instance）

#### 封装（encapsulation，或隐藏）

形式上，封装将数据和行为组合在一个包中，并对对象的使用者隐藏了数据的实现方式。

#### 实例域（instance field）

对象中的数据，对于每个特定的类实例（对象）都有一组特定的实例域值。

#### 方法（method）

对象中操纵数据的过程。由于JAVA是强类型语言，在调用方法时，编译器会检查这个方法是否存在，若不存在则报错。

#### 状态（statue）

每个对象（类实例）都有一组特定的实例域值，该值的集合称为当前对象的状态

#### 继承（inheritance）

通过扩展一个类来建立另一个类，扩展类具有所扩展类的全部属性和方法。

#### 对象的三个主要特征

- 行为（behavior）：可以对对象施加哪些操作，用可调用的方法定义。
- 状态（state）：对象描述当前特征的信息，会随着时间而变化，但这种改变必须是通过调用对象方法实现（否则就说明该对象封装性遭到破坏）
- 标识（identity）：每个对象的唯一身份。

## 面向对象

### 类与对象

#### 类间关系

##### 依赖（uses-a）

一个类的方法操纵另一个类的对象

##### 聚合（has-a）

一个类的对象的实例域包含另一个类的对象

##### 继承（is-a）

用于表示特殊（扩展类，拥有更加个性的属性和方法）与一般（所要扩展的类，一般是比较通用的属性和方法）关系。

另一种表述法是置换法则：表明程序中出现超类对象的任何地方都可以用子类对象置换。

#### 使用预定义类

[Math](./附录B-常用工具包.md) 

Math类只封装了功能，并没有实例域。

[Date](./附录B-常用工具包.md)

表示时间点

[`LocalDate`](./附录B-常用工具包.md) 

日历表示法

##### 区分对象与对象变量

对象变量并没有实际包含一个对象，而是引用一个对象：对象变量存储的是引用，一个存储在另一个地方的一个对象的引用。new操作符返回的也是一个引用。

使用对象的步骤：构造对象--->初始化对象--->应用对象方法

###### 构造器（constructor）

一种特殊的方法，用来构造实例并初始化。名字与类名相同。使用 `new` 操作符。

当类中没有任何构造器时，JAVA会提供一个**无参的默认构造器**；如果类中有任何一个构造器，JAVA都不会这么做。

##### 更改器方法和访问器方法

###### 更改器方法

访问对象并修改对象的方法。

注意，更改器方法不要返回可变对象的引用，因为这样会破坏封装性，返回的引用和对象中的引用都指向同一个对象，他们的变动会影响彼此。此时应该返回一个对象的 clone。

```java
class Employee {
	private Date hireDay;
	public Date getHireDay() {
		return (Date) hireDay.clone();
	}
}
```



###### 访问器方法

只访问对象而不修改对象的方法

#### 用户自定义类

##### 构造器

- 与类同名
- 每个类可以有一个以上的构造器
- 可以有0个，1个或多个参数
- 没有返回值
- 总是伴随着new操作符一起使用
- 构造器中不要定义与类实例域同名的变量，会覆盖掉对同名实例域的初始化
- [无参构造器](#构造器（constructor）) 
- 构造器之间相互调用，使用`this` ，放在构造器方法内的首行。

```java
public Employee(double s) {
	this("Employee #" + nextId, s);
	nextId++;
}
```

- 调用父类构造器时，使用`super`关键字，由于super关键字也要求放在首行，所以不能与`this` 关键字同时使用。

##### 初始化

###### 显示域初始化

- 直接赋值

在类中，直接将一个值赋给任何域。（当一个类的所有构造器都希望把相同的值赋予某个实例域时特别有用）

- 调用方法（没有必要非是静态方法）赋值

```java
// 示例
class Employee {
	private static int nextId;
	private int id = assignId();
	private static int assignId() {
		int r = nextId;
		nextId++;
		return r;
	}
}
```

###### 初始化块（initialization block）

会在构造器执行之前执行

```java
{
	id = nextId;
	nextId++;
}
```

###### 构造器中初始化

###### 域初始化过程

**首先进行静态域初始化** ：

1. 所有静态域被初始化为默认值
2. 按照在类声明中出现的次序，依次执行所有静态域初始化语句和静态初始化块

**其次执行普通实例域初始化** ：

1. 所有数据域被初始化为默认值（***这里要尤为注意，因为java对于类的数据域为基本类型的处理，所以对基本类型数据域进行是否为null的判断总是会为false***）
2. 按照在类声明中出现的次序，依次执行所有域初始化语句和初始化块
3. 执行构造器，如果构造器第一行调用了其他构造器，则执行其他构造器主体
4. 执行本构造器主体

***总的来说就是：***

父类静态变量、父类静态代码块
子类静态变量、子类静态代码块
父类非静态变量、父类非静态代码块、父类构造函数
子类非静态变量、子类非静态代码块、子类构造函数

**没有使用new来构建类实例的情况：**

- 调用类方法或类变量（***方法或变量是在该类中定义的，而不是继承而来的***），此时会对该类的所有静态域进行初始化

##### 参数

###### 隐式参数

类的对象，不需显示的列在方法声明中，在方法中习惯用**`this`**指出。

###### 显示参数

明显的列在方法声明中

###### 按值调用/按引用调用

- 基本数据类型（数字、布尔值）：在使用这种参数类型时，方法不能修改值（方法中的改变对源值无影响）

- 对象引用：方法可以改变引用的对象的状态，但是不能改变引用的值，即将引用指向一个新的对象（这种改变对源引用无效）

***整体来说，都可以理解为按值调用，因为参数传递对象本质上传递的是对象引用的地址值，所以，当修改参数的引用值时，对该方法外参数的引用无影响。*** 

###### 参数默认值问题

JAVA不允许参数具有默认值，但是可以通过方法重载来间接实现这一功能。

**holder类：** 

如果想要编写一个修改数值参数值的方法，需要使用在 `org.omg.CORBA` 包中定义的持有者（holder）类，包括IntHolder、BooleanHolder等。每个持有者类型都包含一个公有（！）域值，通过它可以访问存储在其中的值。

```java
public static void triple(IntHolder x) {
	x.value = 3 * x.value;
}
```

**可变参数：** 

可变参数一定要放在参数列表的最后面。

```java
public class PrintStream {
	public PrintStream printf(String fmt, Object... args) {
		return format(fmt, args);
	}
}
```

等价于

```
public class PrintStream {
	public PrintStream printf(String fmt, Object[] args) {
		return format(fmt, args);
	}
}
```



##### 方法

###### 基于类的访问权限*

对象的方法可以访问该对象的私有数据；**一个方法可以访问所属类的所有对象的私有数据**（C++也是一样）。 

###### 私有方法

建议将那些与当前的实现机制非常紧密，或者说需要一个特别的协议以及特别的调用次序的辅助方法设置成私有的。

##### 对象析构与finalize方法*

由于JAVA有垃圾自动回收器，不需要人工回收内存，所以JAVA不支持析构器。

当对象使用了内存之外的资源，GC无法处理，这时可以使用一个finalize方法，该方法将在GC清除对象之前调用。

实际中应对稀缺资源时不建议使用，因为很难知道这个方法什么时候才能够调用。

- `System.runFinalizersOnExit(true)`方法能够确保finalizer方法在JAVA关闭前被调用，但是这个方法不安全
- `Runtime.addShutDownHook` 添加“关闭钩”（shutdown hook）
- 如果需要某个资源在使用完后立刻关闭，需要人工管理。应用一个close方法来完成相应的清理操作。

#### [内部类（inner class）](./附录K-JAVA内部类.md) 

#### [final](./附录E-JAVA常用关键字)实例域

#### [static](./附录E-JAVA常用关键字)域和方法

#### 方法重载

**方法名字相同，但是参数不同**，这会产生**重载**，编译器根据方法名，以及方法参数类型，参数顺序和调用方的值类型与顺序做对比，匹配出相应的方法（这个过程叫做[**重载解析**](#重载解析)）。

**方法签名** ：方法名，参数类型，参数顺序

## 核心特性

### 继承

JAVA不支持多继承。

#### 概念

##### 继承层次（inheritance hierarchy）

由一个公共超类派生出来的所有类的集合。

##### 继承链（inheritance chain）

在继承层次中，从某个特定的类到其祖先的路径被称为该类的继承链。

#### extends

```java
public class Manager extends Employee {
	private double bonus;
	
	public void setBonus(double bonus) {
        this.bonus = bonus;
    }
}
```

该关键字表示正在构造的新类派生于一个已存在的类。已存在的类称为超类（superclass）、基类（base class）或父类（parent class）；新类称为子类（subclass）、派生类（derived class）或孩子类（child class）。

超类中放置通用的方法，子类中放置更加个性化，具有特殊用途的方法。

*子类从超类中继承超类的所有属性和方法，但是，如果在子类的方法中想要调用这些属性或方法，那必须使用super关键字。虽然是继承过来的，但其实还是超类的，是另一个类，而**一个类无法访问另一个类的私有属性**。* 

##### 覆盖方法（方法重写）

建议使用@Override注解标识出该方法是一个重写方法（可以不用）。使用super关键字调用父类的方法，使用this关键调用自身的方法。

```java
@Override
public double getSalary() {
    return super.getSalary() + bonus;
}
```

###### 重写规则

1. 子类方法重写父类方法，必须要保证权限大于等于父类权限，最好权限修饰一样，不能小于父类权限。
2. 子类方法重写父类方法，返回值类型、方法名和参数列表都要一模一样。 
3. @Override写在方法前面，用来检测是不是有效的正确覆盖重写。

###### 重载与重写

1. 重载发生在本类中，重写发生在父类子类中。
2. 重载的方法名必须相同，重写的方法名相同且返回值类型必须相同
3. 重载的参数列表不同，重写的参数列表相同

```java
public class Food{
	public String name(){
		return "food";
	}
}
public class Watermelon extends Food{
    @Override
    public String name() {
        return "watermelon";
    }
}
```

调用方法：

```java
public class Client {
    @Test
    public void test() {
        Food food = new Watermelon();
        System.out.println(food.name());
    }
}
// 调用重写方法时，会根据运行时类型来确定调用哪个方法
// watermelon
```

第二个测试：

```java
public class Client {
	@Test
	public void test() {
        Food food = new Watermelon();
        eat(food);
    }
    public void eat(Food food) {
        System.out.println("eat food");
    }
    public void eat(Watermelon watermelon) {
        System.out.println("eat watermelon");
    }
}
// 调用重载方法时，会根据方法签名中声明的参数类型来判断调用哪个方法，不会去判断参数运行时的具体累心是什么
//eat food
```

4. 调用重写方法，与对象运行时类型有关

5. 调用重载方法，只与方法签名中声明的参数类型有关，与对象运行时的具体类型无关

###### 静态属性与静态方法的继承

静态属性和静态方法能够被继承，但是由于静态方法/属性是与类绑定的，所以父类的会被隐藏，**静态方法无法被重载**。

当静态方法使用泛型时，由于泛型擦除，可能会导致父类静态方法无法被隐藏（因为擦除前泛型类型的原类型可能是不一样的，，但是类型信息被擦除掉了），会报编译错误

```
both methods have same erasure, yet neither hides the other
```



###### 协变返回值类型和可见性

注意重载方法的返回值类型需要是超类方法返回值类型的子类型；重载方法的可见性不能低于超类方法的可见性。

###### super与this对比

**super** ：

1. 该关键字不是一个对象的引用，不能将super赋给另一个对象变量，它只是一个指示编译器调用父类方法的的特殊关键字。
2. 用于构造器中，调用超类构造器

**this：** 

1. 引用隐式参数
2. 调用该类其他的构造器

##### 重载解析

1. 编译器查看对象的声明类型和方法名，会把该类中同名的方法和其超类中可见性为public（超类私有方法不可访问）的同名方法列举出来。由于每次调用时都要搜索，时间开销很大，所以虚拟机预先为每个类创建了一个方法表（method table），表中列出了所有方法的签名和实际调用的方法。
2. 编译器查看调用时提供的参数类型，在这些方法中搜寻完全匹配的
3. 如果是private、static、final或构造器，那编译器将可以准确地知道应该调用哪个方法----[静态绑定](#静态绑定) ；如果依赖于调用时隐式参数（this）的实际类型，这就在运行时实现[动态绑定](#动态绑定) 
4. 如果采用的是动态绑定调用方法，那么虚拟机一定调用与对象变量所引用那个对象的实际类型最合适的那个类的方法。

#### [接口（interface）](./附录I-JAVA接口.md) 

#### [final类和方法](./附录E-JAVA常用关键字.md) 

#### 抽象类

##### 为什么使用抽象类

将通用的方法抽象出来放在抽象类中，**由于抽象类不能被实例化**，所以可以之将其作为基类，而不用去使用抽象类的实例。使用[`abstract`](./附录E-JAVA常用关键字.md) 关键字。

##### 怎么使用抽象类

- 抽象类中可以没有抽象方法，当时有抽象方法的类必须声明为抽象类

  ```java
  public abstract class Person {
  	public abstract String getDescription();
  }
  ```

  

- 抽象类中可以包含具体的实例域和具体的方法

  ```java
  public abstract class Person {
  	
  	private String name;
  	public Person(String name) {
  		this.name = name;
  	}
  	
  	public String getName() {
  		return this.name;
  	}
  	
  	public abstract String getDescription();
  }
  ```

- 实现抽象类的子类，如果没有或部分定义抽象类中的抽象方法，那么子类必须声明为抽象类；如果定义了全部抽象方法，不必声明抽象类。

- 抽象类不能被实例化，但是可以声明抽象类的变量，引用子类的对象

#### Object类

object类是JAVA中所有类的超类（默认，如果没有明确指出，那么该类的直接超类就是object）。

可以使用Object类型的变量引用任何类型的对象，除了基本类型，当然可以使用基本类型对应的[包装类型]() 。

所有数组类型，不论是对象数组还是基本类型的数组都扩展了Object

```java
Object obj;
Employee[] staff = new Employee[10];
obj = staff; // OK
obj = new int[10]; // OK
```

###### `Objects.equals(a,b)` 

- a，b都为null，`Objects.equals(a, b)`返回true
- 只有其中一个为null，返回false
- 都不为null，则调用 `a.equals(b)` 

##### equals

Object类中，用来判断两个对象是否具有相同的引用。但是，通常需要比较两个对象的状态是否相等更有意义。

**特性：** 

1. 自反性：对于任何非空引用x，`x.equals(x)`应该返回true
2. 对称性：对于任何引用x和y，当且仅当`y.equals(x)`返回true，`x.equals(y)`也应该返回true
3. 传递性：对于任何引用x、y、z，如果`x.equals(y)`返回true，`y.equals(z)`返回true，那么`x.equals(z)`也要返回true
4. 一致性：如果x和y引用的对象没有发生变化，反复调用`x.equals(y)`应该返回同样的结果
5. 对于任意非空引用x，`x.equals(null)`应该返回false

**重写注意事项** ：

1. 如果子类能够拥有自己的相等概念，则对称性需求将强制采用`getClass`进行检测
2. 如果由超类决定相等的概念，那么就可以使用`instanceof` 进行检测，这样可以在不同子类的对象之间进行相等的比较。

**重写建议** ：

1. 显式参数命名为`otherObject`，稍后需要将它转换成另一个叫做other的变量

2. 检测this与`otherObject`是否引用同一个对象

   ```java
   if(this == otherObject) return true;
   ```

3. 检测`otherObject`是否为null，如果是null，返回false

   ```java
   if(otherObject == null) return false;
   ```

4. 比较this与`otherObject`是否属于同一个类。
   如果equals的语义在每个子类中有所改变，就用`getClass`检测：

   ```java
   if(getClass()!= otherObject.getClass()) return false;
   ```

   如果所有子类都拥有统一的语义，就是用instanceof检测

   ```java
   if(!otherObject instanceof ClassName) return false;
   ```

5. 将`otherObject`转换为相应的类类型变量：

   ```java
   ClassName other = (ClassName) otherObject;
   ```

6. 开始对所有需要比较的域进行比较：使用 `==` 比较基本类型域，使用 [`Objects.equals(a,b)`](#`Objects.equals(a,b)` ) 比较对象域。

   ```java
   return field1 == other.field1 && Objects.equals(field2, other.field2);
   ```

***建议：*** 

- 浮点数之间的等值判断，基本数据类型不能用==来比较，包装数据类型不能用equals来判断。浮点数采用“尾数+阶码”的编码方式，类似于科学计数法的“有效数字+指数”的表示方式。二进制无法精确表示大部分的十进制小数，具体原理参考《码出高效》

  ```
  1）指定一个误差范围，两个浮点数的差值在此范围之内，则认为是相等的
      float a = 1.0f - 0.9f;
      float b = 0.9f - 0.8f;
      float diff = 1e-6f;
  
      if (Math.abs(a - b) < diff) {
          System.out.println("true");
      }
  2) 使用BigDecimal来定义值，再进行浮点数的运算操作
      BigDecimal a = new BigDecimal("1.0");
      BigDecimal b = new BigDecimal("0.9");
      BigDecimal c = new BigDecimal("0.8");
  
      BigDecimal x = a.subtract(b);
      BigDecimal y = b.subtract(c);
  
      if (x.equals(y)) {
          System.out.println("true");
      }
  ```

- 在双方之间如果明确知道其中的一个对象引用不为null，那么尽量由该对象发起equals方法，由另一个对象作为参数传递。

##### hashCode()

散列码（hash code）是由对象导出的一个整型值。无规律。Object类默认的hashCode()方法的返回值为其对象的存储地址。

如果重写equals方法，必须重写hashCode方法，以便用户可以将对象插入到[散列表]()中

```java
public int hashCode() {
	return 7 * name.hashCode() + 11 * new Double(salary).hashCode() + 13 * hireDay.hashCode();
}
```

为了避免实例域为null

```java
public int hashCode() {
	return 7 * Objects.hashCode(name) + 11 * Double.hashCode(salary) + 13 * Objects.hashCode(hireDay);
}
```

或者更加简便的写法

```java
public int hashCode() {
	return Objects.hash(name, salary, hireDay);
}
```

如果实例域是数组类型

```java
Arrays.hashCode();
// 散列码由数组元素的散列码组成
```



##### toString()

用于返回表示对象值得字符串。一般形式是：类名[实例域名]

```java
public String toString() {
	return getClass().getName() + "[bonus=" + bonus + ]";
}
```

在调用x.toString()是可以采用 `"" + x` 来替代，前者在基本类型上不能使用，但是后者可以。

Object类定义的toString() 方法用来打印输出对象所属的类名和散列码。

```java
System.out.println(System.out);
// java.io.PrintStream@2f6684
```

数组本身没有重写Object的`toString`方法，所以数组打印可以调用`Arrays.toString()`，多维数组可以调用 `Arrays.deepToString()`

### 多态

一个对象变量可以指示多种实际类型的现象称为多态（polymorphism）。

父类变量可以指向子类对象。

由于多态，在初始化数组对象时候，一定要牢记数组的类型，避免造成父类引用被当成子类引用，调用不存在于父类的子类引用的方法或实例域从而造成 `ArrayStoreException` ，例如：

```java
Manager[] managers = new Manager[10];
Employee[] staff = managers; // 允许的
staff[0] = new Employee("Harry Hacker", ...);// 编译器允许的

// 此时staff[0]与managers[0]引用同一个对象
managers[0].setBonus(1000) // threw ArrayStoreException
```



#### 绑定

##### 动态绑定

在运行时能够自动地选择调用哪个方法的现象称为动态绑定（dynamic binding）。

##### 静态绑定

