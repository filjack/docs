# `ArrayList`

## 作用

存储数据，内部存储结构是 `Object[] elementData` 。对于 `int、short、char、byte、long、double、float` 基本类型，要存储对应的包装类型。

由于内部存储结构用的是数组，所以查询速率较快，但是增删速率较慢。

线程不安全。

## 源码

### 扩容

```java
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;    

private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }

    
private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }
```

1. 扩容至1.5倍
2. 若够用则不变，否则变为所需大小
3. 若容量大于规定最大容量，则比较实际所需大小与规定最大容量。
4. 若实际所需大小较大，则新数组大小为`Integer.MAX_VALUE`；否则为规定最大容量。

### 初始化

```java
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                                               initialCapacity);
        }
    }
```

调用带有初始容量的构造方法要注意，它并不会初始化数组的大小（size字段）

## 对比

### 与Vector

Vector是线程安全的，简单来说就是每个方法都加synchronized关键字。`ArrayList`不是线程安全的，但是可以通过`Collections.synchronizedList`方法将一个普通的`ArrayList`包装成一个线程安全版本的数组容器，原理同Vector一样，就是给所有方法套上一层synchronized。

### Disruptor[^1] 

内部使用环形数组实现的超高性能队列。

### 与LinkedList

#### 遍历性能

`ArrayList`遍历要比LinkedList快得多，因为`ArrayList`的存储结构在内存中是连续的，CPU的内部缓存结构会缓存连续的内存片段，可以大幅度降低读取内存的性能开销。

## 构建`ArrayList`

#### 使用`Arrays.asList(T... t)`

注意，使用该方法构建的`ArrayList`属于Arrays类内部自己实现的`ArrayList`类，该类没有实现add和remove方法，调用会抛出父类的`UnsupportedOperationException`。

[^1]: 更多详情可参考[LMAX Disruptor](https://lmax-exchange.github.io/disruptor/) 

