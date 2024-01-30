# Lua

轻量小巧的脚本语言，用标准C语言编写并以源码形式开源。其设计目的是为了嵌入应用程序中，从而为应用程序提供灵活的扩展和定制功能。

## 数据类型

- nil
  只有nil值属于该类，表示一个无效值（在条件表达式中相当于false）
- boolean
  包含true、false两个值
- number
  表示双精度类型的实浮点数
- string
  字符串由一对双引号或单引号来表示
- function
  由C或Lua编写的函数
- table
  一个“关联数组”，数组的索引可以是数字（此时类似于java中的数组，key或者说是索引是隐式的，例如[变量](##变量)一节中示例代码。不同的是，lua数组索引从1开始）、字符串（此时类似于java中的Map）或者table类型。在Lua里，table的创建是通过“构造表达式”来完成的，最简单的构造表达式是`{}`，用来创建一个空table。

可以使用`type()`函数来判断某个变量或值是什么类型。

## 变量

声明一个变量需要使用`local`关键字，不需要指明变量的具体类型

```lua
local str = 'hello'
local num = 21
local flag = true
local arr = {'java', 'python', 'lua'}
local map = {name='Jack', age=21}
```

## 运算符

### 逻辑运算符

- and
  逻辑与
- or
  逻辑或
- not
  逻辑非

## 流程控制语句

### 循环

- 循环数组
  ```lua
  local arr = {'java', 'python', 'lua'}
  for index,value in ipairs(arr) do
      print(index, value)
  end
  ```

- 循环table
  ```lua
  local map = {name='jack',age=21}
  for key,value in pairs(map) do
      print(key,value)
  end
  ```

### 条件控制

```lua
if(布尔表达式)
    -- 布尔表达式为true时，执行此处
    then
else
    -- 布尔表达式为false时，执行此处
end
```



## 函数

```lua
function 函数名(argument1,argument2,...)
    return 返回值
end
```

例如

```lua
function printArr(arr)
    for index,value in ipairs(arr) do
        print(value)
    end
end
```

