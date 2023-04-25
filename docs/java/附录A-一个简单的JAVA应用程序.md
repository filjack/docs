# 一个简单的JAVA应用程序

```java
public class FirstSample
{
	public static void main(String[] args) {
		System.out.println("We will not use 'Hello, World!'");
	}
}
```

1. JAVA程序区分大小写
2. `public` 访问修饰符，控制程序的其他部分对这段代码的访问级别
3. `class` 一个加载程序逻辑（程序的行为）的容器
4. 类名，字母开头，字母与数字的组合。不能使用保留字。建议驼峰格式。源代码的文件名必须与 `public` 类名相同

   ```
   在java中，字母与数字的范围很广，字母包括A-Z,a-z,_,$或是在某种语言中表示字母的任何Unicode字符；数字也是一样。
   可以使用 Character类中的isJavaIdentifierStart和isJavaIdentifierPart方法来检查
   ```

5. `main` 方法
6. `{}` 标识方法体的开始和结束，`;` 语句以分号结束
7. 一般使用对象名**.**方法名来调用