# `ClassPath`

类的路径必须与包名匹配。

### 共享类

1. 把类放到同一个目录下，目录是类（包括包名）的基目录

   ```java
   // 目录
   /home
   // 类名（包括包名）
   com.corejava.Employee
   // 则Employee.class必须位于
   /home/com/corejava中
   ```

2. 将JAR文件放在同一个目录中

3. 设置类路径（class path）。类路径是包含所有类文件的集合。

#### 设置类路径

1. class文件在另一个目录下

   ```shell
   java -classpath 路径 .class文件
   ```

2. class文件在jar包中

   ```shell
   java -classpath jar文件路径
   ```

   

### 虚拟机查找类文件的方式

假设类路径设置为

```
/home/user/classdir;.;/home/user/archives/archive.jar
```

虚拟机要查找`com.corejava.Employee`类文件

1. 查找存储在`jre/lib`和`jre/lib/ext`目录下的系统类文件
2. 查找 `/home/user/classdir/com/corejava/Employee.class`
3. 从当前目录开始 `com/corejava/Employee.class`
4. 查找`/home/user/archives/archive.jar`

### 编译器查找类文件

如果引用了一个类，而没有指出这个类所在的包，例如：

源代码指令包含如下：

```java
import java.util.*;
import com.corejava.*;
```

并且源代码引用了Employee类

1. 首先查找包含这个类的包，并询查所有import命令：

   ```
   查找java.lang.Employee(因为java.lang包被默认导入)、java.util.Employee、com.corejava.Employee和当前包中的Employee
   ```

   如果找到不止一个，编译错误（类必须是唯一的）

2. 查看源文件是否比类文件新，是则重新编译