# 内部类

定义在类中的类。内部类对象总有一个隐式引用，指向了创建它（实例化该内部类）的外部类对象实例，这样它就可以访问该对象的域等信息；但是[静态内部类](#静态内部类)没有。 

### 为什么使用内部类

#### 命名控制

内部类的命名在编译器中会带有外部类的名称，这种以 $ 符号分隔重新生成类名的行为是由编译器完成的，虚拟机对此一无所知。

`e.g.` `TalkClock$TimerPrint` 其中`TalkClock`是外部类

#### 访问控制

- 内部类方法可以访问该类**定义所在的作用域**中的数据，包括私有数据（如果是在类中，那么该内部类可以访问外部类的相关信息；如果声明在方法中，那么该内部类除了访问外部类的相关信息，还可以访问该方法内的信息，此时该内部类称为[局部内部类](#局部内部类)）
- 内部类可以对同一个包中的其他类隐藏起来，这样可以将内部类的数据域设计为public，它仍然是安全的，只能被外部类中的方法访问。**在JAVA中，只有内部类可以实现这样的控制。** 
- 当想要定义一个回调函数且不想编写大量代码时，使用[匿名（anonymous）内部类](#匿名内部类)比较便捷

#### 隐式引用

内部类对象总有一个隐式引用，指向了创建它（实例化该内部类）的外部类对象实例，这样它就可以访问该对象的全部状态信息；但是[静态内部类](#静态内部类)没有。

该引用在内部类构造器中设置。编译器修改了所有内部类的构造器，添加一个外部类引用的参数。（由于这个隐式参数，内部类失去了无参构造器，即使认为添加一个无参构造器也不会生效）通过下面class文件代码可以观察到编译器的做法：

##### 外围类class文件：

```java
// TalkClock.class 外部类

package timer;

import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Date;
import javax.swing.Timer;

class TalkClock {
    private int interval;
    private boolean beep;

    public TalkClock(int var1, boolean var2) {
        this.interval = var1;
        this.beep = var2;
    }

    public void start() {
        TalkClock.TimerPrint var1 = new TalkClock.TimerPrint();
        Timer var2 = new Timer(this.interval, var1);
        var2.start();
    }

    public class TimerPrint implements ActionListener {
        public TimerPrint() {
        }

        public void actionPerformed(ActionEvent var1) {
            System.out.println("At the tone, the time is " + new Date());
            if (TalkClock.this.beep) {
                Toolkit.getDefaultToolkit().beep();
            }

        }
    }
}

```

##### 外围类反编译后代码：

```java
// javap timer.TalkClock
Compiled from "InnerClassTest.java"
class timer.TalkClock {
  public timer.TalkClock(int, boolean);
  public void start();
  static boolean access$000(timer.TalkClock);
}
```

注意 `static boolean access$000(timer.TalkClock);` 方法，内部类通过该方法获取外围类的信息[^1]。

##### 内部类class文件：

```java
// TimerPrint.class 内部类
public class TalkClock$TimerPrint implements ActionListener {
    public TalkClock$TimerPrint(TalkClock var1) {
        this.this$0 = var1;
    }

    public void actionPerformed(ActionEvent var1) {
        System.out.println("At the tone, the time is " + new Date());
        if (TalkClock.access$000(this.this$0)) {
            Toolkit.getDefaultToolkit().beep();
        }

    }
}
```

##### 内部类反编译后代码

```
// javap 'timer.TalkClock$TimerPrint' 注意引号括起来，不然会只截取到$符号前面的
Compiled from "InnerClassTest.java"
public class timer.TalkClock$TimerPrint implements java.awt.event.ActionListener {
  final timer.TalkClock this$0;
  public timer.TalkClock$TimerPrint(timer.TalkClock);
  public void actionPerformed(java.awt.event.ActionEvent);
}

```



### 一个简单的内部类

```java
package timer;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Date;

/**
 * @className: InnerClassTest
 * @author: XiePF
 * @description: TODO
 * @date: 2022/9/22 23:35
 */

public class InnerClassTest {

    public static void main(String[] args) {
        TalkClock clock = new TalkClock(1000, true);
        clock.start();

        JOptionPane.showMessageDialog(null, "Quit program?");
        System.exit(0);
    }

}

class TalkClock {

    private int interval;
    private boolean beep;

    public TalkClock(int interval, boolean beep) {
        this.interval = interval;
        this.beep = beep;
    }

    public void start() {
        ActionListener listener = new TimerPrint();
        Timer t = new Timer(interval, listener);
        t.start();
    }


    public class TimerPrint implements ActionListener {

        @Override
        public void actionPerformed(ActionEvent e) {
            System.out.println("At the tone, the time is " + new Date());
            if (beep) {
                Toolkit.getDefaultToolkit().beep();
            }
        }
    }

}

```



### 语法规则

- 内部类对于外围类中声明的域的引用，可以显示的写为 `outerClass.this.field` 

  ```java
  @Override
  public void actionPerformed(ActionEvent e) {
        System.out.println("At the tone, the time is " + new Date());
        if (TalkClock.this.beep) {
            Toolkit.getDefaultToolkit().beep();
         }
  }
  ```

- 外围类方法在生成内部类对象时，可以写成 `outerObject.new InnerClass(parameters)` 

  ```java
      public void start() {
          ActionListener listener = this.new TimerPrint();
          Timer t = new Timer(interval, listener);
          t.start();
      }
  ```

- 在外围类的作用域之外引用内部类可以写为 `OuterClass.InnerClass` (此时内部类的访问权限不能是私有的)

  ```java
  TalkingClock jabberer = new TalkingClock(1000, true);
  TalkingClock.TimerPrinter listener = jabberer.new TimerPrinter();
  ```

- 内部类（普通、局部、匿名内部类）中不允许声明静态域，但是可以有静态常量（即 `public static final`修饰），因为一个静态域要求只有一个实例，但是每个外围类对象都有一个单独的内部类实例，如果此时内部类中的静态域不是final的，那么它就可能不是唯一。

- 内部类（普通、局部、匿名内部类）中不能有static方法。

- 静态内部类可以拥有静态域和方法

- 方法中不能声明静态内部类

- 声明在接口中的内部类自动成为`public static` 

### 局部内部类

当某个内部类只有在某个特定的外围类方法中使用实例化使用时，可以将内部类声明为局部内部类，位于该外围类方法中。

```java
   public void start() {
        class TimerPrint implements ActionListener {

            public static final int a = 0;


            @Override
            public void actionPerformed(ActionEvent e) {
                System.out.println("At the tone, the time is " + new Date());
                if (TalkClock.this.beep) {
                    Toolkit.getDefaultToolkit().beep();
                }
            }
        }
        ActionListener listener = new TimerPrint();
        Timer t = new Timer(interval, listener);
        t.start();
    }
```

**局部内部类不能用public、protected、private访问说明符进行说明。**作用域限制在声明该局部内部类的代码块中。局部内部类对于外围世界是完全隐藏的，除了声明该内部类的代码块，没有任何方法知道该局部内部类。

局部内部类可以访问外围类的信息，也可以访问声明该内部类的方法的信息。但是**在访问方法声明的变量的时候，该变量必须是final或者实际上不会变的值**。而且，由于加载顺序的问题，或是延迟处理代码块的问题，编译器在内部类中会存储该方法的变量。`e.g. this.val$beep`  

JAVA代码：

```java
    public void start(int interval, boolean beep) {
        class TimerPrint implements ActionListener {

            @Override
            public void actionPerformed(ActionEvent e) {
                System.out.println("At the tone, the time is " + new Date());

                if (beep) {
                    Toolkit.getDefaultToolkit().beep();
                }
            }
        }
        ActionListener listener = new TimerPrint();
        Timer t = new Timer(interval, listener);
        t.start();
    }
```

反编译后局部内部类代码：

```
class TalkClock$1TimerPrint implements ActionListener {
    TalkClock$1TimerPrint(TalkClock var1, boolean var2) {
        this.this$0 = var1;
        this.val$beep = var2;
    }

    public void actionPerformed(ActionEvent var1) {
        System.out.println("At the tone, the time is " + new Date());
        if (this.val$beep) {
            Toolkit.getDefaultToolkit().beep();
        }

    }
}
```



### 匿名内部类

将局部内部类更进一步简化，只创建该类的一个对象，这样就不必声明该类，这种类被称为匿名内部类。

```java
    public void start(int interval, boolean beep) {
        ActionListener listener = new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                System.out.println("At the tone, the time is " + new Date());
                if (beep) {
                    Toolkit.getDefaultToolkit().beep();
                }
            }
        };
        Timer t = new Timer(interval, listener);
        t.start();
    }
```

对于引用外围类的域，或方法的局部变量，匿名内部类的要求与[局部内部类](#局部内部类)相同。由于构造器名与类名相同，匿名内部类代码体中无法拥有构造器，所传构造器参数会传递到超类的构造器中；当匿名内部类是实现一个接口的时候，不能有任何构造器参数。

#### 双括号初始化

```java
ArrayList<String> friends = new ArrayList<>();
friends.add("Harry");
friends.add("Tony");
invite(friends);
```

可以写成

```
invite(new ArrayList<String>() {
	{
		add("Harry");
		add("Tony");
	}
})
```

这里，第一个大括号标识一个匿名类，第二个大括号则是一个对象构造块。

#### equals方法

#### 在静态方法中获取所属类的类名

在普通方法中可以通过 `this.getClass()` 来获取，但是静态方法没有this，所以需要通过以下方式获取

```java
new Object(){}.getClass().getEnclosingClass()
```

`new Object(){}` 会建立Object的一个匿名类的匿名对象，`getEnclosingClass()` 获取其外围类。

### 静态内部类（嵌套类）

当使用内部类只是为了将一个类隐藏到另一个类的内部，并且不需要内部类引用外围类对象，此时可以使用静态内部类。

静态内部类可以有方法和域（静态或非静态都可以）。

外围类可以通过`StaticInnerClass.StaticField` 调用静态内部类的静态属性，通过 `StaticInnerClassInstance.Field` 调用静态内部类的非静态属性。

静态内部类可以直接访问外围类的静态成员（静态方法和静态属性）。

<!--脚注-->

[^1]: 关于内部类访问外围类的属性可以参考[这篇文章](http://twodam.net/why-non-private-can-simlify-nested-class-access) 以及[这篇文章](https://mp.weixin.qq.com/s?__biz=MzAwNDA2OTM1Ng==&mid=2453142021&idx=2&sn=506a47e86fe0cd74d0eb52b56a0c831d&scene=21#wechat_redirect)

