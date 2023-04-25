# 安全失败与快速失败

## fast-fail

### 释义

是java Collection中的一种错误机制。在用迭代器遍历一个集合对象时，如果遍历过程中对集合对象的**结构**进行了修改（**增加、删除**），则会抛出`ConcurrentModificationException`异常。

### 原理

集合维护了一个`modCount`变量，当对集合结构进行改变时，会改变`modCount`的值。迭代器使用了`expectedmodCount`值维护了`modCount`值，当进行迭代时，会校验这两个值是否相等。

**Tip**：*这里异常的抛出条件是检测到 `modCount！=expectedmodCount` 这个条件。如果集合发生变化时修改`modCount`值刚好又设置为了`expectedmodCount`值，则异常不会抛出。* 

## safe-fail

### 释义

安全失败机制在迭代器的设计上没有设计抛出`ConcurrentModificationException` 

> [《吊打面试官》系列-`ConcurrentHashMap & Hashtable`](https://mp.weixin.qq.com/s?__biz=MzAwNDA2OTM1Ng==&mid=2453141162&idx=1&sn=72976d5ae28ca6e7cdeaef407d3fe2ca&scene=21#wechat_redirect) 
>
> [一文彻底弄懂fail-fast、fail-safe机制（带你撸源码）](https://juejin.cn/post/6879291161274482695#comment) 
>
> [快速失败(fail-fast)和安全失败(fail-safe)的学习笔记](https://blog.csdn.net/tcben/article/details/124797857 )



<!--参考-->

[快速失败(fail-fast)和安全失败(fail-safe)的学习笔记]: https://blog.csdn.net/tcben/article/details/124797857

