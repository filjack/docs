# JAVA反射

## 反射

能够分析类能力的程序称为反射（reflective）。

反射机制作用：

- 在运行时分析类的能力
- 在运行时查看对象
- 实现通用的数组操作代码
- 利用Method对象

### Class类

在程序运行期间，JAVA运行时系统始终为所有的对象维护一个被称为运行时的类型标识信息，这个信息跟踪着每个对象所属的类，虚拟机利用运行时类型信息选择相应的方法执行。Class类保存着这些信息。

Class对象实际上表示一个类型，而这个类型未必是一种类。例如int不是类，但是`int.class`是一个Class对象。

Class类是一个泛型类。例如`Employee.class`的类型是`Class<Employee>` 。但是在大多数实际问题中，可以忽略类型参数，使用原始的Class类。

虚拟机为每个类型管理一个Class对象。因此可以利用 == 实现两个类对象的比较

```java
if(e.getClass() == Employee.class)
```

`newInstance`方法可以调用无参构造器创建初始化对象，如果需要传参，那就用Constructor类中的`newInstance`方法。

#### 获取Class实例的方法

##### `getClass()`

Object类中定义，会返回一个Class类型的实例。

##### `forName(className)`

`className`必须是类名或接口。

```java
String className = "java.util.Random";
Class cl = Class.forName(className);
```

##### `.class` 

```java
Class cl1 = Random.class;
Class cl2 = int.class;
Class cl3 = Double[].class;
```

#### 常用方法

##### `getField(fieldName)`

根据fieldName名字查找对应的Field

##### getMethod(methodName, Class... paramterType)

根据methodName查找对应的方法

##### getFields

返回类提供的public域数组，包括超类的public成员

##### getMethods

返回类提供的public方法数组，包括超类的public成员

##### getConstructors

返回类提供的public构造器数组，包括超类的public成员

##### getDeclaredFields

返回类中声明的全部域，包括私有和受保护成员，但不包括超类成员

##### getDeclaredMethods

返回类中声明的全部方法，包括私有和受保护成员，但不包括超类成员

##### getDeclaredConstructors

返回类中声明的全部构造器，包括私有和受保护成员，但不包括超类成员

### Field

描述类的域

#### 常用方法

##### getName

返回域名称

##### getType

返回描述的域所属类型的Class对象

##### getModifiers

返回一个整型数值，用不同的位开关描述public和static这样的修饰符使用情况

##### get(obj)

获取obj对象的该field域的值。

### Method

描述类的方法

#### 常用方法

##### getName

返回方法名称

##### getParameterTypes

报告参数类型

##### getReturnType

返回值类型

##### getModifiers

返回一个整型数值，用不同的位开关描述public和static这样的修饰符使用情况

##### invoke(隐式参数，Object... args)

执行隐式参数（该对象，如果是静态方法，传null）的当前method方法，参数为args

##### 注意

- 建议不要使用Method对象的回调功能，使用接口进行回调会使得代码的执行速度更快，更易于维护。

### Constructor

描述类的构造器

#### 常用方法

##### getName

返回构造器名称

##### getParameterTypes

报告参数类型

##### getModifiers

返回一个整型数值，用不同的位开关描述public和static这样的修饰符使用情况

### Modifier

分析getModifiers方法返回的整型数值。

#### 常用方法

##### isPublic

判断方法或构造器是否是public

##### isPrivate

判断方法或构造器是否是private

##### isFinal

判断方法或构造器是否是final

### 使用反射

#### 设置使用反射

1. 获取java.util.Class要操作的类的对象，java.util.Class用于表示正在运行的JAVA程序中的类和接口。

   ```java
   // 1.对于对象
   Class obj = Class.forName("java.lang.String");
   // 或者
   Class cls = String.class;
   Class intCls = int.class;
   // 对于基本类型的包装类型
   Class integerCls = Integer.TYPE;
   ```

2. 调用一个方法（例如，`getDeclaredMethods()` 获取该类声明的所有方法列表）来获取该类的相关信息。

3. 使用反射API来操作这些信息

#### 应用

##### 模拟`instanceof` 运算符

```java
package learn.reflect;

public class Instance1 {

    public static void main(String[] args) {

        try {
            Class cls = Class.forName("learn.reflect.A");
            System.out.println(cls.isInstance(new Integer(37)));

            System.out.println(cls.isInstance(new A()));
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

    }

}

class A {}
```



##### 找出关于类的方法

```java
package learn.reflect;

import java.lang.reflect.Method;

public class Method1 {

    private int f1(Object p, int x) throws NullPointerException{
        if (p == null) {
            throw new NullPointerException();
        }
        return x;
    }

    public static void main(String[] args) {

        try {
            Class cls = Class.forName("learn.reflect.Method1");

            Method[] methods = cls.getDeclaredMethods();

            for (int i = 0; i < methods.length; i++) {
                Method m = methods[i];
                System.out.println("name = " + m.getName());
                System.out.println("decl class = " + m.getDeclaringClass());

                Class[] pvec = m.getParameterTypes();
                for (int j = 0; j < pvec.length; j++) {
                    System.out.println("param #" + j + " " + pvec[j]);
                }

                Class[] evec = m.getExceptionTypes();
                for (int j = 0; j < evec.length; j++) {
                    System.out.println("exc #" + j + " " + evec[j]);
                }

                System.out.println("return type = " + m.getReturnType());
                System.out.println("-----------------------------");
            }
        } catch (Throwable e) {
            System.out.println(e);
        }

    }

}
```

##### 获取有关构造函数的信息

```java
package learn.reflect;

import java.lang.reflect.Constructor;

public class Constructor1 {

    protected Constructor1(int i, double d) {

    }

    public Constructor1() {}

    private Constructor1(String name) {

    }

    Constructor1(float a) {

    }

    public static void main(String[] args) {

        try {
            Class cls = Class.forName("learn.reflect.Constructor1");

            Constructor[] constructors = cls.getDeclaredConstructors();
            for (int i = 0; i < constructors.length; i++) {
                Constructor ct = constructors[i];

                System.out.println("name = " + ct.getName());
                System.out.println("decl class = " + ct.getDeclaringClass());

                Class[] pvec = ct.getParameterTypes();
                for (int j = 0; j < pvec.length; j++) {
                    System.out.println("param #" + j + " " + pvec[j]);
                }

                Class[] evec = ct.getExceptionTypes();
                for (int j = 0; j < evec.length; j++) {
                    System.out.println("exc #" + j + " " + evec[j]);
                }

                System.out.println("---------------------");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

    }


}

```



##### 了解类字段

```java
package learn.reflect;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;

public class Field1 {

    private double d;
    public static final int i = 37;
    String s = "testing";

    public static void main(String[] args) {

        try {
            Class cls = Class.forName("learn.reflect.Field1");

            Field[] fields = cls.getDeclaredFields();
            for (int i = 0; i < fields.length; i++) {
                Field fld = fields[i];
                System.out.println("name = " + fld.getName());
                System.out.println("decl class = " + fld.getDeclaringClass());
                System.out.println("type = " + fld.getType());

                int mod = fld.getModifiers();
                System.out.println("modifiers = " + Modifier.toString(mod));
                System.out.println("-------------------");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

    }

}
```



##### 按名称调用方法

```java
package learn.reflect;

import java.lang.reflect.Method;

public class Method2 {

    public int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {

        try {

            Class cls = Class.forName("learn.reflect.Method2");

            Class[] paramTypes = new Class[2];

            paramTypes[0] = Integer.TYPE;
            paramTypes[1] = Integer.TYPE;
            Method m = cls.getMethod("add", paramTypes);

            Method2 m2 = new Method2();
            Object[] argList = new Object[2];
            argList[0] = new Integer(37);
            argList[1] = new Integer(47);

            Object retObj = m.invoke(m2, argList);
            Integer retVal = (Integer) retObj;
            System.out.println(retVal.intValue());
        } catch (Throwable e) {
            System.err.println(e);
        }

    }

}

```



##### 创建新对象

```java
public class Constructor2 {

    public Constructor2() {

    }

    private Constructor2(String str) {
        System.out.println("noParam");
    }

    public Constructor2(int a, int b) {
        System.out.println("a = " + a + " b = " + b);
    }

    public static void main(String[] args) {

        try {
            Class cls = Class.forName("learn.reflect.Constructor2");

            Class[] paramTypes = new Class[2];
            paramTypes[0] = Integer.TYPE;
            paramTypes[1] = Integer.TYPE;

            Constructor ct = cls.getConstructor(paramTypes);

            Object[] argList = new Object[2];
            argList[0] = new Integer(37);
            argList[1] = new Integer(45);

            Object retObj = ct.newInstance(argList);
        } catch (Throwable e) {
            System.err.println(e);
        }

    }

}
```



##### 改变字段的值

```java
package learn.reflect;

import java.lang.reflect.Field;

public class Field2 {

    public double d;

    public static void main(String[] args) {

        try {
            Class cls = Class.forName("learn.reflect.Field2");

            Field field = cls.getField("d");

            Field2 field2 = new Field2();
            System.out.println("d =" + field2.d);

            field.setDouble(field2, 12.34);
            System.out.println("d =" + field2.d);

        } catch (Throwable e) {
            System.err.println(e);
        }

    }

}

```



##### 使用数组

```java
public class Array1 {

    public static void main(String[] args) {

        try {
            Class cls = Class.forName("java.lang.String");

            Object arr = Array.newInstance(cls, 10);
            Array.set(arr, 5, "this is a test");
            String s = (String) Array.get(arr, 5);
            System.out.println(s);
        } catch (Throwable e) {
            System.err.println(e);
        }
    }

}
```

复杂用法---创建三维数组

```java
public class Array2 {

    public static void main(String[] args) {

        // 三维数组各维度长度
        int[] dims = new int[]{5, 10, 15};

        // 创建三维数组
        Object arr = Array.newInstance(Integer.TYPE, dims);

        Object arrObj = Array.get(arr, 3);

        Class cls = arrObj.getClass().getComponentType();
        System.out.println(cls.getName());

        arrObj = Array.get(arrObj, 5);

        Array.setInt(arrObj, 10, 37);

        int[][][] arrCast = (int[][][]) arr;
        System.out.println(arrCast[3][5][10]);
    }

}
```



## 反射与泛型

#### Type接口

##### Class类

描述具体类型

##### TypeVariable接口

描述类型变量，`e.g.：` `T extends Comparable<? super T>` 

##### WildcardType接口

描述通配符，`e.g.:` `? super T` 

##### ParameterizedType接口

描述泛型类或接口类型，`e.g.:` `Comparable<? super T>` 

##### GenericArrayType接口

描述泛型数组，`e.g.:` `T[]` 