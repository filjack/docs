# [`ConcurrentHashMap`](https://mp.weixin.qq.com/s?__biz=MzAwNDA2OTM1Ng==&mid=2453141162&idx=1&sn=72976d5ae28ca6e7cdeaef407d3fe2ca&scene=21#wechat_redirect)

### 1.7

实现：内部由一个 `Segment` 数组构成，每个 `Segment` 节点内部由一个 `HashEntry` 数组构成，就像是一个独立的 `HashMap` 一样。采用[分段锁]()。

结构：

```java
public ConcurrentHashMap(int initialCapacity,
                             float loadFactor, int concurrencyLevel) {
    // 检验参数的合法性
        if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)
            throw new IllegalArgumentException();
        if (concurrencyLevel > MAX_SEGMENTS)
            concurrencyLevel = MAX_SEGMENTS; // 1<<16 = 2^16 = 65536
        // Find power-of-two sizes best matching arguments
        int sshift = 0; // 最大是16
        int ssize = 1; // 最大是 65536
        while (ssize < concurrencyLevel) {
            ++sshift;
            ssize <<= 1; // 翻倍
        }
        this.segmentShift = 32 - sshift;
        this.segmentMask = ssize - 1;
        if (initialCapacity > MAXIMUM_CAPACITY) // 1 << 30 = 1073741824
            initialCapacity = MAXIMUM_CAPACITY;
        int c = initialCapacity / ssize;
        if (c * ssize < initialCapacity)
            ++c;
        int cap = MIN_SEGMENT_TABLE_CAPACITY;
        while (cap < c) // 保证cap是一个比2大的2的次幂
            cap <<= 1;
        // create segments and segments[0]
        Segment<K,V> s0 =
            new Segment<K,V>(loadFactor, (int)(cap * loadFactor),
                             (HashEntry<K,V>[])new HashEntry[cap]);
        Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];
        UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]
        this.segments = ss;
    }
```

外部`put` 方法 

```java
public V put(K key, V value) {
        Segment<K,V> s;
        if (value == null)
            throw new NullPointerException();
        int hash = hash(key);
    // 要映射到大小为ssize的数组中，即该hash & (ssize - 1)，且hash为2的次幂；ssize = 2^sshift，也就是(ssize-1)对应的2进制的位数为sshift，那么就取hash的高sshift位与 (ssize-1)相与；由于hash是32位int型，为求hash的高sshift位，即求 hash >>> (32 - sshift) 也就是 segmentShift
        int j = (hash >>> segmentShift) & segmentMask;
    // 这里是用Unsafe类的原子操作找到Segment数组中j下标的 Segment 对象
        if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck
             (segments, (j << SSHIFT) + SBASE)) == null) //  in ensureSegment
            s = ensureSegment(j);
        return s.put(key, hash, value, false);
    }
```

#### Segment

```java
static final class Segment<K,V> extends ReentrantLock implements Serializable {

    private static final long serialVersionUID = 2249069246763182397L;

    // 和 HashMap 中的 HashEntry 作用一样，真正存放数据的桶
    transient volatile HashEntry<K,V>[] table;

    transient int count;
        // 记得快速失败（fail—fast）么？
    transient int modCount;
        // 大小
    transient int threshold;
        // 负载因子
    final float loadFactor;

}
```

#### `HashEntry` 

```java
    static final class HashEntry<K,V> {
        final int hash;
        final K key;
        volatile V value;
        volatile HashEntry<K,V> next;

        HashEntry(int hash, K key, V value, HashEntry<K,V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }

        /**
         * Sets next field with volatile write semantics.  (See above
         * about use of putOrderedObject.)
         */
        final void setNext(HashEntry<K,V> n) {
            UNSAFE.putOrderedObject(this, nextOffset, n);
        }

        // Unsafe mechanics
        static final sun.misc.Unsafe UNSAFE;
        static final long nextOffset;
        static {
            try {
                UNSAFE = sun.misc.Unsafe.getUnsafe();
                Class k = HashEntry.class;
                nextOffset = UNSAFE.objectFieldOffset
                    (k.getDeclaredField("next"));
            } catch (Exception e) {
                throw new Error(e);
            }
        }
    }
```

注意：

- 关于 `SBASE` 请参考[这里](https://python.iitter.com/other/172390.html) 

### 1.8

采用 `CAS + synchronized` 来保证并发。

