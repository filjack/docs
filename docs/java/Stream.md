

# Stream

JAVA SE 8提供，一种让程序员可以在比[集合]()更高的概念级别上指定计算的数据[视图](./集合.md)。通过使用流，程序员可以说明想要完成什么任务，而不是说明如何去实现它。我们将操作的调度留给具体实现去解决，流库可以对计算进行优化。（让程序员以一种**声明的方式**去**处理数据**）

## 基本概念

Stream是一个来自数据源的元素队列，并支持聚合操作。它并不会储存元素，而是**按需计算**。

- 元素，特定类型的对象形成的队列

## 流与集合

### 差异

1. 流并不存储其元素。这些元素可能存储在底层的集合中，或是按需生成的。
2. 流的操作不会修改其数据源。
3. 流的操作是尽可能惰性执行的。者意味着直至需要其结果时，操作才会执行。例如，如果我们只想查找前5个单词而不是所有单词，那么filter方法就会在匹配到第5个单词后停止过滤。因此，我们甚至可以操作无线流。

## 流的使用

### 创建操作

#### Collection接口的stream方法

该方法可以将任何一个集合转换为一个流。

#### `Stream.of(T... t)`

该方法可以通过数组创建一个流。

#### `Array.stream(T[] t, int from, int to)`

该方法可以从数组t中的 [from, to)（前闭后开区间）区间的元素创建一个流

#### `Stream.empty()`

创建不包含任何元素的流。

#### `Stream.generate(Supplier<T> s)`

该方法接收一个Supplier接口对象，可以用来创建无限流

```java
Stream<String> echos = Stream.generate(()->"Echos");
```

或是像下面这样获取一个随机数流

```java
Stream<Double> randoms = Stream.generate(Math::random);
```

#### `Stream.iterate(T seed, UnaryOperation<T> function)`

该方法接收一个“种子”值（seed），以及一个函数，并且会反复地将函数应用到之前的结果上，可以用来创建无限流。

```java
Stream<BigInteger> integers = Stream.iterate(BigInteger.ZERO, n->n.add(BigInteger.ONE));
```

#### `Pattern.splitAsStream(CharSequence str)`

该方法会按照某个正则表达式来分隔一个`CharSequence`对象。

```java
Stream<String> words = Pattern.complie("\\PL+").splitAsStream(contents);
```

#### `Files.lines(Path path, Charset cs)`

该方法接收一个Path路径对象，以及编码格式来通过文件生成一个流

```java
Path path = Paths.get("./test.txt");
Stream<String> lines = Files.lines(path, StandardCharsets.UTF-8);
```



### 中间操作

将初始流转换为其他流的中间操作，可能包含多个步骤。

#### `filter(Predicate<? super T> function)`

根据过滤函数对初始流进行过滤，true保留。不修改初始流。

#### `map(Function<? super T, ? extends R> mapper)`

按照某种方法将传入的流的值映射为新的值。通常结合lambda表达式使用。

```java
Stream<String> lowercaseWords = words.stream().map(String::toLowerCase);
```

#### `flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)`

作用与[map](#####map)相同，但是如果映射的结果是流的流，可以进行摊平，例如

```java
public class AppTest {

    public static void main(String[] args) {
        List<String> words = Arrays.asList("y", "o", "u", "r", "b", "o", "o", "t");

        Stream<Stream<String>> result = words.stream().map(w -> letters(w));

        Stream<String> flatResult = words.stream().flatMap(w -> letters(w));
    }

    public static Stream<String> letters(String s) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < s.length(); i++) {
            result.add(s.substring(i, i + 1));
        }
        return result.stream();
    }  
    
}
```

#### `limit(long n)`

该方法截取前n个元素后结束，如果传入流的元素的个数小于n，那么就提前结束。

#### `skip(long n)`

该方法跳过传入流的前n个元素。

#### `Stream.concat(Stream<? extends T> s1, Stream<? extends T> s2)`

该静态方法用来链接两个流，前提是，第一个流不能是无限流，否则第二个流永远都不会得到处理的机会。

#### `distinct()`

该方法将传入流的元素按照转入的顺序剔除重复元素。

#### `sorted()`

该方法传入流的元素是实现了Comparable接口的元素

#### `sorted(Comparator<? super T> comparator)`

该方法接收一个Comparator对象来进行排序。

#### `peek(Comparator<? super> T action)`

该方法会产生另一个流，它的元素与原来流中的元素相同，但是在每次获取一个元素时，都会调用一个函数。方便用于调试。经常搭配lambda表达式使用。

```java
Object[] powers = Stream.iteratr(1.0, p->p*2)
.peek(e->System.out.println("Fetching " + e))
.limit(20)
.toArray();
```

当实际访问一个元素时，就会打印出来一条信息。通过这种方式，可以验证iterate返回的无限流是被惰性处理的。

### 终止操作

应用终止操作，从而产生结果。该操作会强制执行之前的[惰性操作](###流与集合)，从此之后，这个流就再也不能使用了。

#### 约简

约简是一种终结操作，它们会将流约简为可以在程序中使用的非流值。

##### `long count()`

该方法返回流中元素的数量。（long类型）

##### `Optional<T> max(Comparator<? super T> comparator)`

该方法返回最大值

##### `Optional<T> min(Comparator<? super T> comparator)`

该方法返回最小值

##### `Optional<T> findFirst()`

该方法返回非空集合中第一个值。通常与[filter](#####filter(Predicate<? super T> function))方法结合使用

##### `Optional<T> findAny()`

该方法返回非空集合中任意一个值，通常在并行处理流时很有效。

##### `boolean anyMatch(Predicate<? super T> predicate)`

该方法在给定流中任意元素匹配给定断言返回true

```java
boolean aWordStartWithQ = words.parallel().anyMatch(s->s.startWith("Q"));
```



##### `boolean allMatch(Predicate<? super T> predicate)`

该方法在给定流中所有元素匹配给定断言返回true

##### `boolean noneMatch(Predicate<? super T> predicate)`

该方法在给定流中没有任何元素匹配给定断言时返回true

#### reduce操作

#### Optional类型

JDK8新增，`Optional<T>`对象是一种包装器对象，要么包装了类型T的对象（称这种值是存在的），要么没有包装任何对象。它被当作一种更安全的方式，用来替代类型T的引用，Optional引用**要么引用某个对象，要么为null**。

##### 使用

当值不存在的情况下会产生一个可替代物，而只有在值存在时才会使用这个值。**注意Optional的正确使用，因为某些方法在值不存在时还是会抛出异常的。** 

值不存在：

- `T orElse(T other)`
- `T orElseGet(Supplier<? extends T> other)`
- `<X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier)`

值存在：

- `void ifPresent(Consumer<? super T> consumer)`

- `<U> Option<U> map(Function<? super T, ? extends U> mapper)`

  ```java
  Option<Boolean> added = optionValue.map(results::add);
  ```

  

##### 创建

- `static <T> Optional<T> of(T value)`
  产生一个给定值的Optional，如果value为null则抛出NPE

- `static <T> Optional<T> empty()`
  产生一个空Optional

- `static <T> Optional<T> ofNullable(T value)`
  产生一个给定值的Optional，如果value为null则产生一个empty
- Optional的`flatMap`方法可以平摊Optional的Optional

##### 收集

###### `Iterator<T> iterator()`

产生一个用于获取当前流中各个元素的迭代器。

###### `void forEach(Consumer<? suuper T> action)`

在流的每个元素上调用action。

###### `void forEachOrdered(Consumer<? super T> action)`

###### `Object[] toArray()`

产生一个对象数组。

###### `<A> A[] toArray(IntFunction<A[]> generator)`

产生一个对象数组，在将引用A[]::new 传递给构造器时，返回一个A类型的数组。

###### `<R, A> R collect(Collector<? super T,A,R> collector)`

使用给定的收集器来收集当前流中的元素。[Collectors]()类有用于多种收集器的工厂方法。

## 流的类型

### 基本类型流

#### `IntStream`

boolean、byte、char、short、int

#### `LongStream`

long

#### `DoubleStream`

float、double

#### 常用方法

##### 对象流转基本类型流

- `mapToInt`
- `mapToLong`
- `mapToDouble`

##### 基本类型流转对象流

- boxed

### 并行流

并行流使用fork-join池来操作流的各个部分。

#### 创建

只要在终结方法执行时，流处于并行模式，那么所有的中间操作都将被并行化。

##### `Collection.parallelStream()`

任何集合可以调用此方法创建并行流。

##### `parallel()`

任意顺序流可以调用此方法转换为并行流。

#### 使用

为了让并行流正常工作，需要满足大量条件：

- 数据应该已经在内存中。必须等到数据到达是非常低效的。
- 流应该可以被高效地分成若干个子部分。由数组或平衡二叉树支撑的流都可以工作得很好，但是`Stream.iterate`返回的结果不行。
- 流操作的工作量应该具有较大的规模。如果总工作负载并不是很大，那么搭建并行计算时所付出的代价就没有什么意义。
- 流不应该被阻塞。

不要将所有流都转换为并行流，只有在对已经位于内存中的数据执行大量计算操作时，才应该使用并行流。
