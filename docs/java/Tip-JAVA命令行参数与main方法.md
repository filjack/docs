# main方法与命令行参数

#### 命令行参数

```java
public static void main(String[] args) {

}
```

`String[] args` 代表接收到的命令行参数，例如：

```java
public class Message {
	public static void main(String[] args){
		if(args.length == 0 || args[0].equals("-h")) {
			System.out.println("Hello,");
		} else if (args[0].equals("-g")) {
			System.out.println("Goodbye,");
		}
		for(int i = 1;i<args.length;i++){
			System.out.println(" " + args[i]);
		}
		System.out.println("!");
	}
}
```

当使用命令行执行该程序

```shell
java Message -g cruel world
```

`args` 数组包含下列字段

```
args[0]: "-g"
args[1]: "cruel"
args[2]: "world"
```

程序执行结果

```
Goodbye, cruel world!
```

#### main方法

每个类可以最多有一个main方法，可以用来做单元测试。
