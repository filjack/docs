# JAVABEAN

## 规范

1. 类中定义的成员变量也称为“字段”，属性则是通过getter/setter方法得到的，属性只与类中的方法有关，与是否存在对应成员变量没有关系。例如，存在`getA()`方法和`setA(String)`方法，无论类中是否定义了字段`String a`，我们都认为该类中存在属性a。

<!--脚注-->

[^1]: 具体可以参考[JavaBean Specification](https://download.oracle.com/otndocs/jcp/7224-javabeans-1.01-fr-spec-oth-JSpec/)。

 