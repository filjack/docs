# javadoc

### 注释的插入

注释应该放置在所描述特性的前面，以 `/**` 开头，并以 `*/` 结尾。每个 `/**....*/` 文档注释在标记之后紧跟着**自由格式文本（free-form text）** 。标记由 @开始， 例如@author ，@param。在自由文本中可以使用HTML修饰符。建议为以下部分添加注释：

- 包
- 公有类与接口
- 公有的和受保护的构造器及方法
- 公有的和受保护的域

### 类注释

必须放在import语句之后，类定义之前。

```java
/**
 * A {@code Card} ...
 *
 */
```

没有必要在每一行的开始使用 * 号，下面的写法也是合法的

```java
/**
  A {@code Card} ...
 */
```

### 方法注释

必须放在所描述方法之前。

### 常用标记

- @param 变量描述
- @return 返回值描述
- @throws 异常类描述
- @literal 显示的文本，不会将文本解释为HTML标签或javadoc标签

```java
/**
 * Raise the salary of an employee
 * @param byPercent the percentage by which to raise the salary (e.g. 10 means 10%)
 * @return the amount of the raise
 * {@literal }
 */
public double raiseSalary(double byPercent) {
	double raise = salary * byPercent / 100;
	salary += raise;
	return raise;
} 
```

### 域注释

只需要对公有域（通常指的是静态常量）建立文档。

```java
/**
 * The "Hearts" card suit
 */
public static final int HEARTS = 1; 
```

### 通用注释

- @author 姓名
- @version 版本号
- @since 始于...
- @deprecated 废弃
- @see 引用
- @link 链接

### 包与概述注释

可以直接将类、方法和变量的注释放置在JAVA源文件中，只要用 `/**...*/` 文档注释界定就好了。但是，要想产生包注释，需要在每一个包目录中添加一个单独的文件：

- 提供一个以 `package.html`命名的HTML文件。在标记 `<body>...</body>` 之间的所有文本都会被抽取出来
- 提供一个以 `package-info.java`命名的JAVA文件。这个文件必须包含一个初始的以 `/**...*/` 界定的`Javadoc`注释，跟随在一个包语句之后。这个文件不应该包含更多的代码或注释。

要为所有源文件提供一个概述性注释，这个注释要放在一个名为`overview.html`的文件中。这个文件位于包含所有源文件的父目录中。标记 `<body>...</body>` 之间的所有文本将本抽取出来。当用户从导航栏选择 “overview” 时，就会显示这些注释内容。

### 注释的抽取

假设HTML文件将被存放到目录 `docDirectory` 下，步骤如下：

1. 切换到包含想要生成文档的源文件目录。如果有嵌套的包要生成文档，例如 com.corejava，就必须切换到包含子目录com的目录（如果存在overview.html文件的话，这也是它的所在目录）

2. 如果是一个包，执行命令

   ```
   javadoc -d docDirectory nameOfPackage;
   ```

   或对于多个包生成文档

   ```
   javadoc -d docDirectory nameOfPackage1 nameOfPackage2 ...
   ```

   [更多选项](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html) 

   [怎么更好的添加`javadoc`注释](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html) 