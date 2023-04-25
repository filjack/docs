# I/O

## 概念

### 输入流

可以从其中读入一个字节序列的对象称做输入流

### 输出流

可以向其中写出一个字节序列的对象称做输出流

### 面向字节的流

InputStream/OutputStream，以字节为基本单位进行读出和写入。可以处理单个字节或字节数组。

#### InputStream

该类有一个抽象方法

```java
public abstract int read()
```

该方法将读入一个字节，并以int的形式返回该字节，或者在遇到输入源结尾时返回-1。该方法的线程在执行时直到字节确实被读入前一直处于阻塞状态。

#### OutputStream

该类有一个抽象方法

```java
public abstract void write(int b)
```

该方法可以向某个输出位置（例如文本文件）写出一个字节。该方法的线程在执行时直到字节确实被写出前一直处于阻塞状态。

### 面向字符的流

从抽象类Reader和Writer中继承出来的专门用于处理Unicode字符的单独的类层次结构。这些类拥有的读出和写入操作都是基于两字节的Char值的（即[Unicode码元]()），而不是基于byte值。

#### Reader

该类有一个抽象方法

```java
abstract int read()
```

该方法返回一个[Unicode码元]()（一个在0-65535之间的整数），或者在碰到文件结尾时返回-1。

#### Writer

该类有一个抽象方法

```java
abstract void write(int c)
```

该方法在调用时，需要传递一个[Unicode码元]()。

# I/O流

## I/O类

### [`InputStream`](####InputStream)

#### `AudioInputStream`

#### `ByteArrayInputStream`

#### `FileInputStream`

#### `PipedInputStream`

#### `FilterInputStream`

##### 	`BufferedInputStream`

##### 	`CheckedInputStream`

##### 	`CipherInputStream`

##### 	`DigestInputStream`

##### 	`InflaterInputStream`

###### 		`GZIPInputStream`

###### 		`ZipInputStream`

​			`JarInputStream`

##### 	`LineNumberInputStream`

##### 	`ProgressMonitorInputStream`

##### 	`PushbackInputStream`

##### 	`DataInputStream`

#### `SequenceInputStream`

#### `StringBufferInputStream`

#### `ObjectInputStream`

### [`OutputStream`](####OutputStream) 

#### `ByteArrayOutputStream`

#### `FileOutputStream`

#### `FilterOutputStream`

##### 	`BufferedOutputStream`

##### 	`CheckedOutputStream`

##### 	`CipherOutputStream`

##### 	`DigestOutputStream`

##### 	`DeflaterOutputStream`

###### 		`GZIPOutputStream`

###### 		`ZipOutputStream`

​			`JarOutputStream`

##### 	`PrintStream`

##### 	`DataOutputStream`

#### `PipedOutputStream`

#### `ObjectOutputStream`

### [`Reader`](####Reader) 

#### [`BufferedReader`](####BufferedReader类) 

##### 	`LinedNumberReader`

#### `CharArrayReader`

#### `FilterReader`

##### 	`PushbackReader`

#### [`InputStreamReader`](####InputStreamReader类) 

##### 	`FileReader`

#### `PipedReader`

#### `StringReader`

### [`Writer`](####Writer) 

#### `BufferedWriter`

#### `CharArrayWriter`

#### `FilterWriter`

#### [`OutputStreamWriter`](####OutputStreamWriter类) 

##### 	`FileWriter`

#### `PipedWriter`

#### [`PrintWriter`](####PrintWriter类) 

#### `StringWriter`

## 分类

### 输入/输出流

#### [定义](##概念) 

- 输入流：在JAVA API中，可以从其中读入一个字节序列的对象称作输入流
- 输出流：在JAVA API中，可以向其中写入一个字节序列的对象称作输出流
- 面向字节：可以读写单个字节或字节数组
- 面向[Unicode](./附录D-Unicode编码.md) 字符：面向字节的流不便于处理Unicode形式存储的信息，所以从抽象类Reader和Writer中继承出来了一个专门用于处理Unicode字符的单独的类层次结构。这些类拥有的读入和写出操作都是基于两字节的Char值的（即，Unicode码元），而不是基于byte值的。

抽象类InputStream和OutputStream构成了输入/输出（I/O）类层次结构的基础。

***注意流之间的组合使用以及过滤器流的配合使用。*** 



### 文本输入/输出

#### OutputStreamWriter类

该类使用选定的字符编码方式，把[Unicode码元]()的输出流转换为字节流。

#### PrintWriter类

该类中拥有以文本格式打印字符串和数字的方法等

#### InputStreamReader类

该类将包含字节（用某种字符编码方式表示的字符）的输入流转换为可以产生Unicode码元的读入器。

#### BufferedReader类

该类可以用来处理文本的输入。其中readline方法会产生一行文本，或者在无法获得更多的输入时返回null。

### 二进制数据输入/输出

#### DataInputStream类

该类实现了DataInput接口，可以对二进制数据进行读入操作

#### DataOutputStream类

该类实现了DataOutput接口，可以对二进制数据进行写出操作

#### `RandomAccessFile`类

随机访问文件，可以在文件中的任何位置查找或写入数据。

#### `ZipInputStream`类

#### `ZipOutputStream`类

#### `JarInputStream`类 

#### `JarOutputStream`类

### 对象输入/输出与序列化

#### 保存和加载序列化对象

##### `ObjectOutputStream` 类

`writeObject(T extends Serializable)` 方法可以直接保存对象

##### `ObjectInputStream` 类

`<T extends Serializable> T  readObject()` 

#### Serializable接口

该接口没有任何方法，但是只有实现该接口才可以进行序列化。

当一个对象被多个对象共享时，该对象作为它们各自状态的一部分，根据**序列号**进行序列化操作：

1. 每个对象引用都关联一个序列号
2. 对于每个对象，当第一次遇到时，保存其对象数据到输出流
3. 如果对象之前已经被保存过，那么只写出“与之前保存过的序列号为x的对象相同”（这里是一个比喻）
4. 读出时，对于对象输入流中的对象，在第一次遇到其序列号时，构建它，并使用流中数据来初始化它，然后记录这个顺序号和新对象之间的关联。
5. 当遇到“与之前保存过的序列号为x的对象相同”（这里是一个比喻）标记时，获取与这个顺序号相关联的对象引用

##### 序列化机制

###### 不可序列化的数据域

例如，只对本地方法有意义的存储文件句柄或窗口句柄的整数值，这些信息是序列化时无用的，不需要序列化。

可以使用 `transient` 关键字标记，放在类型前任意位置即可。

###### 修改序列化时默认的读写行为

可以在实现`Serializable` 接口的类中定义**私有的** 以下方法签名方法：

```java
private void writeObject(ObjectOutputStream out) throws IOException {

}

private void readObject(ObjectInputStream in) throws IOException{

}
```

这样，在序列化时会改为调用类中定义的方法。

除了让序列化机制来保护和恢复对象数据，类还可以定义它们自己的机制，此时需要实现 `Externalizable`接口

```java
public interface Externalizable extends java.io.Serializable {
    void writeExternal(ObjectOutput out) throws IOException;

    void readExternal(ObjectInput in) throws IOException, ClassNotFoundException;
}
```

这些方法对包括超类数据在内的整个对象的存储和恢复负全责。在写出对象时，序列化机制在输出流中仅仅只是记录该对象所属的类。在读入可外部化的类时，对象输入流将用无参构造器创建一个对象，然后调用`readExternal`方法。

```
public class Employee {

	public void readExternal(ObjectInput s) throws IOException {
		name = s.readUTF();
		salary = s.readDouble();
		hireDay = LocalDate.ofEpochDay(s.readLong());
	}

}
```

`readObject`和`writeObject`方法是私有的，且只能被序列化机制调用。`readExternal`和`writeExternal`方法是公有的，特别是，`readExternal`还潜在地允许修改现有对象的状态。

##### 序列化版本管理

使用序列化时，不可避免发生已经被序列化的对象所属的类型在实际使用过程中发生演化，例如多了或少了几个属性等。

由于对象的SHA指纹会随着类的变化而变化，而对象输入流会拒绝读入具有不同指纹的对象。但是可以通过版本指纹来类对早期版本的兼容。JAVA默认通过`serialVersionUID` （没有显示声明的话需要进行计算）来标识。

```java
static final long serialVersionUID = -1814239825517340645L;
```

该类的所有较新版本都必须把serialVersionUID常量定义为与最初版本相同的值。此时，序列化系统可以读入该类的对象的不同版本，并进行简单的处理

- 只有方法发生变化，那么在读入新对象数据时不会有任何问题
- 对象流只考虑非瞬时非静态数据域，如果名字匹配而类型不匹配，对象输入流不会尝试进行类型转换，此时两个对象不兼容
- 如果被序列化的对象具有当前版本的对象所不具备的数据域，那么这些数据域将被对象输入流忽略。
- 如果当前版本的对象具有被序列化的对象所不具备的数据域，那么这些数据域将被设置为默认值（对象是null，数字是0，boolean是false）

#### 枚举类的序列化

如果是JAVA的enum类型，那么JAVA会处理好一切。

如果维护的是旧时类似枚举的遗留代码

```java
public class Orientation {
	public static final Orientation HORIZONTAL = new Orientation(1);
	public static final Orientation VERTICAL = new Orientation(2);
	
	private int value;
	private Orientation(int v) {
		value = v;
	}
}
```

当该类实现序列化接口时，假设写入一个Orientation类型的值，并再次读回，此时返回的值是一个Orientation类型的全新的对象，它与任何预定义的常量都不相同。即使构造器是私有的，序列化机制也可以创建新的对象。

为了解决这种问题，需要在类中定义`readResolve`的特殊序列化方法。该方法在对象被序列化之后调用，必须返回一个对象，返回的对象会成为`readObject`的返回值。

```java
protected Object readResolve() throws ObjectStreamException {
	if (value == 1) return Orientation.HORIZONTAL;
	if (value == 2) return Orientation.VERTICAL;
	throw new ObjectStreamException();
}
```



切记向遗留代码中所有类型安全的枚举类以及所有支持单例设计模式的类中添加`readResolve`方法

#### 利用序列化机制来进行克隆（不建议）

由于反序列化得到的对象是一个新的对象，利用这个特性可以对目标对象进行克隆（该类实现`Serializable`接口）

直接将对象序列化到输出流中，然后将其读回。这样产生的新对象是对现有对象的一个[深拷贝（deep copy）](./附录I-JAVA接口.md)。在此过程中，不需要将对象写到文件中，可以使用`ByteArrayOutputStream`将数据保存到字节数组中。

### 操作文件

#### `Path` 

表示的是一个目录名序列，其后还可以跟着一个文件名。以根部件开头则表示的路径为绝对路径；否则就是相对路径

```java
Path absolute = Paths.get("/home", "harry");
Path relative = Paths.get("myprog", "conf", "user.properties");
```



- `Paths.get(String... params)` ：该方法接收一个或多个字符串，并将它们使用默认文件系统的路径分隔符连接起来。

- `resolve()` ：当调用`p.resolve(q)` 时，如果q是一个绝对路径，那么结果就是q；如果q是相对路径，那么结果为以p为根路径来描述q

- `resolveSibling()`：解析指定路径的父路径产生其兄弟路径。

  ```java
  // workPath是/opt/myapp/work
  Path tempPath = workPath.resolveSibling("temp");
  // 将创建/opt/myapp/temp
  ```

- `relativize()` ：`p.relativize(q)` 从路径p的角度来描述q（通过相对路径的方式）

  ```
  // p : /home/cry
  // q : /home/fred/myprog
  p.relativize(q)  ../fred/myprog
  ```

- `normalize()`：移除所有冗余的`.`和`..`部件（或者文件系统认为冗余的所有部件）

  ```java
  /home/cay/../fred/./myprog
  将变为
  /home/fred/myprog
  ```

- `toAbsolutePath()`：将产生给定路径的绝对路径，从根部件开始

- `getParent()` 

- `getFileName()`

- `getRoot()`

  ```java
  Path p = Paths.get("/home", "myprog.properties");
  Path parent = p.getParent(); // /home/fred
  Path file = p.getFileName(); // myprog.properties
  Path root = p.getRoot(); // /
  ```

  **Path接口有个`toFile`方法，File接口有个`toPath`方法** 



#### `Files` 

*适合用来操作中等大小的文件* 

- `readAllBytes(Path)`： 读取文件所有内容，返回byte数组

- `readAllLines(Path, Charset)`：对文件进行按行读取，返回`List<String>` 

- `write(Path, byte[], OpenOption... options)` ：将byte数组以options方式写到文件中，返回Path对象

- `createDirectory(Path)` ：创建新目录，其中Path对象除了最后一个路径部件外，其他的路径部件要求必须存在，返回一个Path对象

- `createDirectories(Path)`：创建新目录，不要求Path的中间部件存在，不存在会自动创建

- `createFile(Path)` ：创建一个空文件，如果文件已经存在，抛出异常。
  ***注意：*** 检查文件是否存在和创建文件是原子性的，如果文件不存在，该文件就会被创建，并且其他程序在此过程中是无法执行文件创建操作的。

- `createTempFile(Path dir, String prefix, String suffix)`

- `createTempFile(String prefix, String suffix)`

- `createTempFile(Path dir, String prefix)`

- `createTempFile(String prefix)`
  在给定位置或系统指定位置创建临时文件或临时目录。其中prefix和suffix可以为null。返回一个Path对象

  ```
  Files.createTempFile(null, ".txt")
  // 可能会返回/tmp/1234405522364837194.txt这样的路径
  ```

- `copy(Path fromPath, Path toPath)` ：将文件从一个位置复制到另一个位置。

- `copy(InputStream from, Path to, CopyOption... options)` ：将一个输入流复制到文件中，返回复制的字节数（long）

- `copy(Path from, OutputStream to, CopyOption... options)` ：将一个文件复制到输出流中，返回复制的字节数（long）

- `move(Path fromPath, Path toPath, CopyOption... options)` ：移动文件（复制并删除原文件）

- `delete(Path path)` ：删除文件，如果删除文件不存在则抛出异常

- `deleteIfExists(Path path)` 

- `exists(Path path)` 

- `isHidden(Path path)`

- `isReadable(Path path)`

- `isWritable(Path path)`

- `isExecutable(Path path)` 

- `isRegularFile(Path path)`

- `isDirectory(Path path)`

- `isSymbolicLink(Path path)` 

- `size(Path path)` ：返回文件的字节数

- `list(Path path)` ：返回一个可以读取目录中各个项的`Stream<Path>`对象。该方法不会进入子目录。因为读取目录涉及到需要关闭的系统资源，应该使用try-with

- `walk(Path path)` ：会遍历子目录，无论何时，只要遍历的项是目录，那么在进入它之前，会继续访问它的兄弟项。

- `newDirectoryStream(Path path)` ：返回一个`DirectoryStream`，该类继承自`Iterable`，而不是`java.util.stream.Stream`，可以使用`forEach`

- `walkFileTree(Path path, FileVisitor visitor)`

#### 用于文件操作的标准选项

<img :src="$withBase='/img/08-files-standard-ops1.png'" class="align-center"/>

<img :src="$withBase='/img/08-files-standard-ops2.png'" class="align-center"/>

#### 内存映射文件

操作系统利用虚拟内存实现来将一个文件或文件的一部分“映射”到内存中。该文件就可以当作内存数组一样地访问，这比传统的文件操作要快得多。

对于中等尺寸文件的顺序读入没必要使用内存映射。

##### JAVA实现

1. 从文件中获得一个通道（channel）：通道是用于磁盘文件的一种抽象，使我们可以访问诸如内存映射、文件加锁机制以及文件间快速数据传递等操作系统特性。

   ```java
   FileChannel channel = FileChannel.open(Path path, OpenOption... options)
   ```

2. 通过调用`FileChannel`类的map方法从这个通道中获得一个`ByteBuffer`。可以指定想要映射的文件区域与映射模式，映射模式有

   ```
   FileChannel.MapMode.READ_ONLY: 
   所产生的缓冲区是只读的，任何对该缓冲区写入的尝试都会导致ReadOnlyBufferException异常。
   
   FileChannel.MapMode.READ_WRITE:
   所产生的缓冲区是可写的，任何修改都会在某个时刻写回到文件中。注意，其他映射同一个文件的程序可能不能立即看到这些修改，多个程序同时进行文件映射的确切行为是依赖于操作系统的。
   
   FileChannel.MapMode.PRIVATE:
   所产生的缓冲区是可写的，但是任何修改对这个缓冲区来说都是私有的，不会传播到文件中。
   ```

3. 有了缓冲区之后，可以通过`ByteBuffer`类和`Buffer`超类的方法进行读写数据了。缓冲区支持顺序和随机数据访问，它有一个可以通过get和put操作来移动的位置。

##### 缓冲区及Buffer

缓冲区是由具有相同类型的数值构成的数组。

缓冲区的结构：

- 一个容量，它永远不能改变
- 一个读写位置，下一个值将在此进行读写
- 一个界限，超过它进行读写是没有意义的
- 一个可选的标记，用于重复一个读入或写出操作
- <img :src="$withBase='/img/08-structure-of-buffer'" class="align-center"/>
- 满足 `0<=标记<=位置<=界限<=容量`

Buffer类是一个抽象类，有众多具体子类：`ByteBuffer、CharBuffer、DoubleBuffer、IntBuffer、LongBuffer、ShortBuffer`。（***`StringBuffer`与这些缓冲区没有关系***）

##### 文件锁

在多个同时执行的程序需要修改同一个文件的情形下，这些程序需要以某种方式进行通信来保证文件不被损坏。文件锁用来解决这个问题，它可以控制对文件或文件中某个范围的字节的访问。

###### 锁定文件

调用FileChannel类的lock或tryLock方法

```java
FileChannel channel = FileChannel.open(path);
FileLock lock = channel.lock();

FileLock lock = channel.tryLock();
```

lock()方法会阻塞直到可获得锁；tryLock()调用将立即返回，要么返回锁，要么在锁不可获得的情况下返回null。

加锁情况下，该文件将保持锁定状态，直到整个通道关闭，或者在锁上调用了release方法。

可以通过以下方法锁定部分文件：

```java
FileLock lock(long start, long size, boolean shared);

FileLock tryLock(long start, long size, boolean shared);
```

如果shared标志为false，则锁定文件的目的是读写，而如果为true，则这是一个共享锁，它允许多个进程从文件中读入，并阻止任何进程获得独占的锁。并非所有的操作系统都支持共享锁，因此可能会在请求共享锁的时候得到的是独占的锁。调用`FileLock`类的`isShared`方法可以查询所持有的锁的类型。

如果锁定了文件的尾部，而这个文件的长度随后增长超过了锁定的部分，那么增长出来的额外区域是未锁定的，要想锁定所有的字节，可以使用Long.MAX_VALUE来表示尺寸。

不要忘记释放锁，可以放在try-with语句中。

由于文件加锁机制是依赖于操作系统的，需要注意以下几点：

- 在某些系统中，文件加锁仅仅是建议性的，如果一个应用未能得到锁，它仍旧可以向被另一个应用并发锁定的文件执行写操作。
- 在某些系统中，不能在锁定一个文件的同时将其映射到内存中
- 文件锁是由整个JAVA虚拟机持有的。如果由两个程序是由同一个虚拟机启动的（例如Applet和应用程序启动器），那么它们不可能每一个都获得一个在同一个文件上的锁。当调用`lock`和`tryLock`方法时，如果虚拟机已经在同一个文件上持有了另一个重叠的锁，那么这两个方法将抛出`OverlappingFileLockException`
- 在一些系统中，关闭一个通道会释放由JAVA虚拟机持有的底层文件上的所有锁。因此，在同一个锁定文件上应该避免使用多个通道
- 在网络文件系统上锁定文件是高度依赖于系统的，因此应该尽量避免
