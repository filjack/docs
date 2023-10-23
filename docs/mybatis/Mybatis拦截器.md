# Mybatis拦截器

> Mybatis允许在已映射语句执行过程中的**某一点**进行**拦截调用**。

默认情况下，Mybatis**允许使用插件来拦截的接口和方法包括**一下（*以下并不都是可以被拦截的*）

- Executor（update、query、flushStatements、commit、rollback、getTransaction、close、isClosed）
- ParameterHandler（getParameterObject、setParameters）
- ResultSetHandler（handleResultSets、handleCursorResultSets、handleOutputParameters）
- StatementHandler（prepare、parameterize、batch、update、query）

## Interceptor接口

插件可以通过实现该接口来对拦截对象和方法进行处理。

```java
package org.apache.ibatis.plugin;

import java.util.Properties;

public interface Interceptor {
    Object intercept(Invocation invocation) throws Throwable;

    default Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    default void setProperties(Properties properties) {
    }
}
```

```xml
    <plugins>
        <plugin interceptor="tk.mybatis.simple.interceptor.CustomInterceptor">
            <property name="" value=""/>
        </plugin>
    </plugins>
```

并通过XML配置方式，设置拦截器的执行顺序，以及配置拦截器的一些属性配置。

## `@Intercepts`与`@Signature`

拦截器上需要标注`@Intercepts`注解，该注解的值为`@Signature`数组。

## 可被拦截的接口及拦截签名写法

### Executor

#### update

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "update",
                args = {MappedStatement.class, Object.class}
        )
})
```

该方法能够拦截Mybatis所有的INSERT、UPDATE、DELETE方法

#### query

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "query",
                args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}
        )
})
```

该方法能够拦截所有SELECT方法

#### queryCursor

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "queryCursor",
                args = {MappedStatement.class, Object.class, RowBounds.class}
        )
})
```

该方法拦截返回值为Cursor的SELECT方法

#### flushStatements

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "flushStatements",
                args = {}
        )
})
```

该方法只有在通过SqlSession方法调用flushStatements方法或执行的接口方法中带有@Flush注解时才被调用

#### commit

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "commit",
                args = {boolean.class}
        )
})
```

该方法只有在通过SqlSession方法调用commit方法时才会被调用

#### rollback

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "rollback",
                args = {boolean.class}
        )
})
```

该方法只有在通过Sqlsession方法调用rollback方法时才会被调用

#### getTransaction

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "getTransaction",
                args = {}
        )
})
```

该方法只有在通过SqlSession方法获取数据库连接时才会被调用

#### close

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "close",
                args = {boolean.class}
        )
})
```

该方法只在延迟加载获取新的Executor后才会被执行

#### isClosed

```java
@Intercepts({
        @Signature(
                type = Executor.class,
                method = "isClosed",
                args = {}
        )
})
```

该方法只有在延迟加载执行查询方法前才会被执行

### ParameterHandler

#### getParameterObject

```java
@Intercepts({
        @Signature(
                type = ParameterHandler.class,
                method = "getParameterObject",
                args = {}
        )
})
```

该方法只在执行存储过程处理出参的时候被调用

#### setParameters

```java
@Intercepts({
        @Signature(
                type = ParameterHandler.class,
                method = "setParameters",
                args = {PreparedStatement.class}
        )
})
```

该方法在所有数据库方法设置SQL参数时被调用

### ResultSetHandler

#### handleResultSets

```java
@Intercepts({
        @Signature(
                type = ResultSetHandler.class,
                method = "handleResultSets",
                args = {Statement.class}
        )
})
```

该方法会在除了存储过程和返回值类型为`Cursor<T>（org.apache.ibatis.cursor.Cursor<T>）`的查询方法中被调用。该方法对于拦截处理Myabtis中的查询结果非常有用，并且由于该接口被调用的位置在处理二级缓存之前，因此通过这种方式处理的结果可以执行二级缓存。

#### handleCursorResultSets

```java
@Intercepts({
        @Signature(
                type = ResultSetHandler.class,
                method = "handleCursorResultSets",
                args = {Statement.class}
        )
})
```

3.4.0版本新增。只在返回值类型为`Cursor<T>`的查询方法中被调用

#### handleOutputParameters

```java
@Intercepts({
        @Signature(
                type = ResultSetHandler.class,
                method = "handleOutputParameters",
                args = {CallableStatement.class}
        )
})
```

该方法只有在使用存储过程处理出参时才会被调用

### StatementHandler

#### prepare

```java
@Intercepts({
        @Signature(
                type = StatementHandler.class,
                method = "prepare",
                args = {Connection.class, Integer.class}
        )
})
```

该方法会在数据库执行前被调用，优先于当前接口中的其他方法而被执行

#### parameterize

```java
@Intercepts({
        @Signature(
                type = StatementHandler.class,
                method = "parameterize",
                args = {Statement.class}
        )
})
```

该方法在prepare方法之后执行，用于处理参数信息

#### batch

```java
@Intercepts({
        @Signature(
                type = StatementHandler.class,
                method = "batch",
                args = {Statement.class}
        )
})
```

在全局设置配置defaultExecutorType="BATCH"时，执行数据操作才会调用该方法。

#### query

```java
@Intercepts({
        @Signature(
                type = StatementHandler.class,
                method = "query",
                args = {Statement.class, ResultHandler.class}
        )
})
```

该方法在执行SELECT方法时调用

#### queryCursor

```java
@Intercepts({
        @Signature(
                type = StatementHandler.class,
                method = "queryCursor",
                args = {Statement.class}
        )
})
```

3.4.0版本新增。只会在返回值类型为`Cursor<T>`的查询中被调用





## 注意

1. 当配置多个拦截器时，若拦截器签名相同，则配置的顺序就是拦截器执行由内而外的顺序（例如A、B、C签名相同，A->B->C即为`C>B>A>target.proceed()>A>B>C`的顺序执行）
2. 当配置多个拦截器时，若拦截器签名不同，则配置顺序就是执行顺序
3. 注意，拦截器方法中，`invocation.proceed()`只可执行一遍，更多遍执行会返回空。