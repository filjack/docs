# `HashMap`

## 作用

映射中的key是不可变对象。不可变对象是指该对象在创建后它的哈希值不会被改变。如果对象的哈希值发生变化，Map对象很可能就定位不到映射的位置了。

底层使用**数据+链表**的存储方式，**Node数组**，但是每个节点又是一个**链表结构**，因为存储键值对的位置是hash出来的，所以在有限的数组长度上很有可能会出现一样的，此时Node就是一个链表结构。

### **特性** 

- 线程不安全的
- 不能保证存储顺序的（有可能随着时间的推移，顺序都不一样）
- **最多允许一条数据的键为 `null`** ，允许多条数据的值为 `null`  
- 迭代时间与 其容量 `buckets` （哈希表的桶的数量）的数量 和 其初始大小（初始时的键值对的数量）成正比

**如果需要线程安全，可以使用下面的方法** 

```java
Collections.synchronizedMap(Map)
```

- 新的entry节点进入链表，在1.8之前采用的是头插法，因为作者认为后来者使用频率应该更高，这样可以提升查找效率（但是头插法当并发插入的时候，resize方法调整之后有可能产生[环形链表](./HashMap1.7.md)）；在1.8之后则采用尾插法，在扩容时会保持链表元素原本的顺序。

## 源码

### **哈希桶数组** 

<img :src="$withBase='/img/05-hashMap.jpg'" class="align-center"/> 

```java
transient Node<K,V>[] table;  // 初始化容量(默认值是16)，哈希桶数组table的长度length大小必须为2的n次方(一定是合数)，主要是为了在取模和扩容时做优化，同时为了减少冲突，HashMap定位哈希桶索引位置时，也加入了高位参与运算的过程。（一般来说素数导致冲突的概率要小于合数）
```

###  **`Node` 内部类** 

```java
static class Node<K,V> implements Map.Entry<K,V> {
        final int hash; // 用来定位数据索引位置
        final K key;
        V value;
        Node<K,V> next;  // 链表的下一个node

        Node(int hash, K key, V value, Node<K,V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }

        public final K getKey()        { return key; }
        public final V getValue()      { return value; }
        public final String toString() { return key + "=" + value; }

        public final int hashCode() {
            return Objects.hashCode(key) ^ Objects.hashCode(value);
        }

        public final V setValue(V newValue) {
            V oldValue = value;
            value = newValue;
            return oldValue;
        }

        public final boolean equals(Object o) {
            if (o == this)
                return true;
            if (o instanceof Map.Entry) {
                Map.Entry<?,?> e = (Map.Entry<?,?>)o;
                if (Objects.equals(key, e.getKey()) &&
                    Objects.equals(value, e.getValue()))
                    return true;
            }
            return false;
        }
    }
```

 解决 `hash` 冲突的方法为**链地址法** ，也就是数组每个元素上都是一个链表，当数据被 `Hash` 后，得到对用数组的下标，然后将数据存到对应下标的链表上。当链表长度太长（默认超过8）时，链表就转换为红黑树。

### **构造函数初始化字段** 

```java
transient int size; // 此映射中包含的键值映射数
transient int modCount; // 此哈希映射在结构上被修改的次数（结构上被修改是指：键值对数量改变、内部结构改变（再哈希rehash）），这个字段用于在集合视图上的hashmap的迭代器快速失败
int threshold; // 所能容纳的key-value对极限，阈值(capacity * load factor)
// threshold就是在此Load factor和length(数组长度)对应下允许的最大元素数目，超过这个数目就重新resize(扩容)，扩容后的HashMap容量是之前容量的两倍。
final float loadFactor;  // 默认值为0.75f
```

### 功能方法

#### 确定`hash` 桶数组索引位置

```java
方法一：
static final int hash(Object key) {   //jdk1.8 & jdk1.7
     int h;
     // h = key.hashCode() 为第一步 取hashCode值
     // h ^ (h >>> 16)  为第二步 高位参与运算
     return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
方法二：
static int indexFor(int h, int length) {  //jdk1.7的源码，jdk1.8没有这个方法，但是实现原理一样的
     return h & (length-1);  //第三步 取模运算
}
```

模运算消耗比较高，这里采用`h & (table.length -1)`来得到该对象的保存位，而`HashMap`底层数组的长度总是2的n次方，这是`HashMap`在速度上的优化。当`length`总是2的n次方时，`h& (length-1)`运算等价于对`length`取模，也就是`h%length`，但是`&`比`%`具有更高的效率。

在`JDK1.8`的实现中，优化了高位运算的算法，通过`hashCode()`的高16位异或低16位实现的：`(h = k.hashCode()) ^ (h >>> 16)`，主要是从速度、功效、质量来考虑的，这么做可以在数组`table`的`length`比较小的时候，也能保证考虑到高低`Bit`都参与到`Hash`的计算中，同时不会有太大的开销。

<img :src="$withBase='/img/05-obtain-index-of-hash-bucket.jpg'" class="align-center"/> 

#### put方法

<img :src="$withBase='/img/05-put-method-for-hash-map.jpg'" class="align-center"/>

源码

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0) // 判断哈希桶是否为空
        n = (tab = resize()).length; // 为空则进行扩容
    if ((p = tab[i = (n - 1) & hash]) == null) // 判断该hash值索引位置是否为空
        tab[i] = newNode(hash, key, value, null); // 是则直接插入新节点
    else {
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k)))) // key存在
            e = p;
        else if (p instanceof TreeNode) // 判断该节点是否为树节点----红黑树
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else { // 该链为链表
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    // 链表长度大于 8 做红黑树转换处理
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                // key已经存在则直接覆盖value
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    // 超过最大容量，就进行扩容
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

#### 扩容

扩容分为两步：

1. resize方法进行扩容，容量为原数组的两倍大小

   ```java
   final Node<K,V>[] resize() {
       Node<K,V>[] oldTab = table;
       // 求出原哈希桶容量
       int oldCap = (oldTab == null) ? 0 : oldTab.length;
       // 求原极限键值对个数
       int oldThr = threshold;
       int newCap, newThr = 0;
       if (oldCap > 0) {
           // 原容量超过最大值
           if (oldCap >= MAXIMUM_CAPACITY) {
               threshold = Integer.MAX_VALUE;
               return oldTab;
           }
           // 原容量没超过最大值，那么阈值扩充为原来的二倍
           else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                    oldCap >= DEFAULT_INITIAL_CAPACITY)
               newThr = oldThr << 1; // double threshold
       }
       // 用阈值替换容量
       else if (oldThr > 0) // initial capacity was placed in threshold 
           newCap = oldThr;
       // 用默认值初始化容量和阈值---
       else {               // zero initial threshold signifies using defaults
           newCap = DEFAULT_INITIAL_CAPACITY;
           newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
       }
       // 计算新阈值
       if (newThr == 0) {
           float ft = (float)newCap * loadFactor;
           newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                     (int)ft : Integer.MAX_VALUE);
       }
       threshold = newThr;
       @SuppressWarnings({"rawtypes","unchecked"})
       Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
       table = newTab;
       if (oldTab != null) {
           for (int j = 0; j < oldCap; ++j) {
               Node<K,V> e;
               if ((e = oldTab[j]) != null) {
                   // 消除原数组引用，循环结束，原数组再无引用
                   oldTab[j] = null;
                   if (e.next == null)
                       newTab[e.hash & (newCap - 1)] = e;
                   else if (e instanceof TreeNode)
                       ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                   else { // preserve order
                       // 链表优化 重新hash的代码块
                       // 不需要更新位置的节点链表
                       Node<K,V> loHead = null, loTail = null;
                       // 需要更新位置的节点链表
                       Node<K,V> hiHead = null, hiTail = null;
                       Node<K,V> next;
                       do {
                           next = e.next;
                           // 原索引
                           // 假设 1010 & 10000
                           if ((e.hash & oldCap) == 0) {
                               if (loTail == null)
                                   loHead = e;
                               else
                                   loTail.next = e;
                               loTail = e;
                           }
                           // 原索引 + oldCap
                           else {
                               if (hiTail == null)
                                   hiHead = e;
                               else
                                   hiTail.next = e;
                               hiTail = e;
                           }
                       } while ((e = next) != null);
                       // 原索引放到bucket中
                       if (loTail != null) {
                           loTail.next = null;
                           newTab[j] = loHead;
                       }
                       // 原索引 + oldCap 放到 bucket中
                       if (hiTail != null) {
                           hiTail.next = null;
                           newTab[j + oldCap] = hiHead;
                       }
                   }
               }
           }
       }
       return newTab;
   }
   ```

   

2. 对原map中的键值对进行重新hash运算