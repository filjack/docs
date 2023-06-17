# Object类

object类是JAVA中所有类的超类（默认，如果没有明确指出，那么该类的直接超类就是object）。

可以使用Object类型的变量引用任何类型的对象，除了基本类型，当然可以使用基本类型对应的[包装类型]() 。

所有数组类型，不论是对象数组还是基本类型的数组都扩展了Object

```java
Object obj;
Employee[] staff = new Employee[10];
obj = staff; // OK
obj = new int[10]; // OK
```

## equals

Object类中，用来判断两个对象是否具有相同的引用。但是，通常需要比较两个对象的状态是否相等更有意义。

`Objects.equals(a,b)` 

- a，b都为null，`Objects.equals(a, b)`返回true
- 只有其中一个为null，返回false
- 都不为null，则调用 `a.equals(b)` 

### 特性

1. 自反性：对于任何非空引用x，`x.equals(x)`应该返回true
2. 对称性：对于任何引用x和y，当且仅当`y.equals(x)`返回true，`x.equals(y)`也应该返回true
3. 传递性：对于任何引用x、y、z，如果`x.equals(y)`返回true，`y.equals(z)`返回true，那么`x.equals(z)`也要返回true
4. 一致性：如果x和y引用的对象没有发生变化，反复调用`x.equals(y)`应该返回同样的结果
5. 对于任意非空引用x，`x.equals(null)`应该返回false

### 重写

#### 重写注意事项

1. 如果子类能够拥有自己的相等概念，则对称性需求将强制采用`getClass`进行检测
2. 如果由超类决定相等的概念，那么就可以使用`instanceof` 进行检测，这样可以在不同子类的对象之间进行相等的比较。

#### 重写建议

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

### 使用建议

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

## hashCode()

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



## toString()

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
