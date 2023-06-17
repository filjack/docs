# 包（package）

使用包是为了确保类名的唯一性。

### 类的导入

#### 类名前加完整包名（不建议）

#### import

一个类可以使用所属包中的所有类，以及其他包中的共有类。

- 可以只导入所需的类

  ```java
  import java.time.LocalDate;
  ```

- 导入整个包

  ```java
  import java.time.*;
  ```

  这样语法比较简单，对代码的大小没有任何负面影响，但是不够清晰。*号只能导入一个包，不能使用 `import java.*.*` 之类的写法。

- 如果导入两个完整包里有相同的类名，而我们只取其一

  ```java
  import java.util.*;
  import.java.sql.*;
  import java.util.Date;
  ```

- 如果导入两个完整包里有相同的类名，而我们都要用，那么就在每个类前加完整包名来使用

- 默认导入 `java.lang`包下所有类

### 静态导入

import导入静态方法和静态域

```java
import static java.lang.System.*;

public class App {
	public static void main(String[] args) {
		out.println("Goodbye, World!");
		exit(0);
	}
}
```

编译器在编译源文件的时候不检查目录结构，例如：

```java
package com.mycompany;
```

即使这个源文件没有在子目录 `com/mycompany` 下，也可以进行编译，如果不依赖其他包，就不会出现编译错误。但是最终程序无法运行，除非先将所有类文件移到正确的位置上。如果包与目录不匹配，虚拟机就找不到类。