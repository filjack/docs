# String

### 对象设定

JAVA字符串中的字符是不能更改的，所以，String类对象称为**不可变字符串** ，编译器对于这些不可变字符串是**共享的** （[虚拟机]()只有字符串常量是共享的，而对于 `+` 或 `substring` 操作产生的结果并不是共享的）。

JAVA字符串由 `char` 值序列组成。

### 常用方法

#### 子串

- substring(start, end)，区间范围**[start,end)**;

```java
String greeting = "hello";
String s = greeting.substring(0,3);
```

#### 拼接

- `+` ，可以用来拼接**字符串或`char`类型的字符**，当字符串 `+` 非字符串时，非字符串自动转字符串（`toString()`方法）

```java
String expletive = "（substring）";
String PG13 = "deleted";
String message = expletive + PG13; // "Expletivedeleted"
```

- join，用定界符分隔多个字符串

```java
String all = String.join(" / ","S","M","L","XL"); 
// "S / M / L / XL"
```

#### 比较

注意，不要使用 `==` 来进行比较，这只能确定两个字符串是否存储在同一位置上：同一位置上必然相等，但是也有可能相同字符串存储在不同位置。

- equals

```java
s.equals(t);
// s与t相等，则返回true
```

- `equalsIgnoreCase`
  忽略大小写

### 空串与Null值

空串是一个Java对象，“”，是长度为0，内容为空的字符串，可以采用以下方式检验一个字符串是否为空：

```java
if(str.length() == 0) {};
// 或者
if(str.equals("")) {};
```

Null值表示当前变量未与任何对象关联，要检查Null值要使用以下条件：

```java
if(str == null) {};
```

### `CharSequence`接口

所有字符串都属于这个接口。例如：String、CharBuffer、StringBuilder、StringBuffer。

### 构建字符串

#### [字符串连接](https://www.jb51.net/article/215179.htm) 

使用 `+` 号连接，但是这种方法效率较低：每次连接字符串，都会构建一个新的String对象，既耗时，又浪费空间。

#### `StringBuilder`

在单线程中使用

#### `StringBuffer`

在多线程中使用，效率较`StringBuiler`来说略低
