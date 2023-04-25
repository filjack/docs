# 常用函数工具

## 数学函数

在Math类中，为了达到最快的性能，所有方法都使用[计算机浮点单元中的例程]()；如果结果的可预测性比运行速度更重要，应该使用StrictMath类，该类使用“自由发布的Math库”（[fdlibm]()）实现算法，确保在所有平台上得到相同的结果。

### Math类

- 求平方根（sqrt）

```java
double y = Math.sqrt(double x);
```

- 幂运算（pow）

```java
double y = Math.pow(double a, double b);
```

- 整数取余（`floorMod`）

```java
// 获得时钟时针位置
floorMod(position + adjustment, 12) = ((position + adjustment)%12 + 12)%12
```

- 舍入运算（round）

```java
double x = 9.997;
int nx = (int)Math.round(x); // 10
```

- 三角函数

```java
Math.sin
Math.cos
Math.tan
Math.atan
Math.atan2
```

- 指数函数以及自然对数和以10为底的对数

```
Math.exp
Math.log
Math.log10
```

- `Π` 和 `e` 的常量

```
Math.PI
Math.E
```

- `random()` ，返回`[0,1)` 之间的一个随机浮点数

```java
(int) (Math.random() * n) // 得到一个[0,n-1]之间的随机整数
```

