# 编译器与解释器

## 编译器

### **编译源程序的方法** 

```
javac Employee.java;
// 使用通配符
javac Employee*.java;
```

在编译期间，编译器会**自动寻找**被编译的程序所引用的其他源程序的**class文件**，如果找不到会去找**源程序**并进行编译，并且，如果源程序版本较class文件**版本更新**，编译器会**重新编译**该文件。

### **编译带有继承关系的类**

```bash
javac A.java B.java
```

需要同时编译继承链上所有类

## 解释器

**`java`** 

当class文件有包名（package），应该在该包外部执行java命令

```shell
java package.class
```

