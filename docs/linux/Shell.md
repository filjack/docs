# [Shell](https://www.runoob.com/linux/linux-shell.html) 

> 充当解释器，用户键入的命令，Linux内核无法直接理解，一般都是由各种Shell来充当解释器，翻译给Linux内核来执行命令。例如`cd`命令，需要被Shell翻译给Linux内核才能被执行。国内一般使用`bash`

## 脚本格式

1. 文档以 `#!/bin/bash`开头
2. 文件需要有可执行权限

## 脚本执行

1. 赋予脚本可执行权限，通过 `./xx.sh`直接执行
2. 不赋予脚本可执行权限，但是通过 `sh xx.sh`执行

## 变量

- 系统变量，例如 `$HOME、$PWD、$SHELL`等，可以使用[`set`](./其他常用命令.md) 来查看所有系统变量

- 用户自定义变量
  ```shell
  变量名=值
  ```

  - `unset 变量名`
    撤销变量
  - `readonly 变量名=值`
    声明静态变量，静态变量不能撤销
  - 使用`$`来获取变量的值

### 定义变量的规则

1. 变量名可以由数字、字母、下划线组成，但是不能由数字开头，一般为大写

2. 变量赋值时等号两侧不能有空格

3. 将命令执行结果赋值给变量
   ```shell
   A=`date`
   B=$(date)
   ```

### [设置环境变量](./软件管理.md) 

### 位置参数变量

> 执行`shell`脚本时，希望读取命令行参数时使用，例如 `./xx.sh 100 200`，脚本中需要读取100、200这两个参数

- `$n`，n从0开始，0代表脚本本身，1代表第一个参数，以此类推，当超过10时，需要用大括号包起来`${10}`
- `$*`，获取所有参数，参数被当做一个整体，也就是不可循环
- `$@`，获取所有参数，参数被当做一个列表，也就是可以循环
- `$#`，获取所有参数的个数总和

### 预定义变量

- `$$`，返回当前进行的进程号（`pid`）
- `$!`，返回后台运行的最后一个进程的进程号
- `$?`，返回最后一次执行的命令的执行结果状态，0则表示执行成功，非0则表示未正确执行成功

## 注释

### 单行注释

`#`

### 多行注释

```shell
:>>!
内容
!
```

## 运算符

1. `$(())`

   ```shell
   RES1=$(((2+3)*4))
   ```

2. `$[]`

   ```shell
   RES2=$[(2+3)*4]
   ```

3. `expr`

   - 使用`expr`时，运算符与操作数之间需要有空格
   - 运算符为 `+ - \* /` 
   - 最多只能两个操作数参与运算
   - 需要将表达式结果赋值给变量时，需要使用反引号括起来表达式

   ```shell
   TEMP=`expr 2 + 3`
   RES3=`expr $TEMP \* 4`
   ```

## 基本语句

### 条件判断

- `[ 条件 ]`
  注意，中括号与条件之间有空格，非空则返回true，为空则返回false

- ```shell
  a=10
  b=20
  if [ $a == $b ]
  then
     echo "a 等于 b"
  elif [ $a -gt $b ]
  then
     echo "a 大于 b"
  elif [ $a -lt $b ]
  then
     echo "a 小于 b"
  else
     echo "没有符合的条件"
  fi
  ```

- ```shell
  echo '输入 1 到 4 之间的数字:'
  echo '你输入的数字为:'
  read aNum
  case $aNum in
      1)  echo '你选择了 1'
      ;;
      2)  echo '你选择了 2'
      ;;
      3)  echo '你选择了 3'
      ;;
      4)  echo '你选择了 4'
      ;;
      *)  echo '你没有输入 1 到 4 之间的数字'
      ;;
  esac
  ```

### 循环语句

- ```shell
  for loop in 1 2 3 4 5
  do
      echo "The value is: $loop"
  done
  ```

- ```shell
  SUM=0
  for(( i=1; i<100; i++ ))
  do
  	SUM=$[$SUM+$i]
  done
  echo "总和为$SUM"
  ```

- ```shell
  SUM=0
  i=0
  while [ $i -le 10 ]
  do
  	SUM=$[$SUM+$i]
  	i=$[$i+1]
  done
  echo "执行结果$SUM"
  ```

- ```shell
  #!/bin/bash
  int=1
  while(( $int<=5 ))
  do
      echo $int
      let "int++"
  done
  ```



## 输入输出

- `read`

  ```shell
  #!/bin/bash
  # 读取控制台输入的一个数字，赋值到NUM1
  read -p "请输入一个数字" NUM1
  echo $NUM1
  
  # 读取控制台输入的一个数字，赋值到NUM2，超过10秒未输入自动退出
  read -t 10 -p "请输入一个数字，10秒内输入NUM2" NUM2
  echo $NUM2
  
  ```

## 函数

### 系统函数

- `basename`
  获取文件名

  ```shell
  basename /home/test/aaa/text.txt
  > text.txt
  basename /home/test/aaa/text.txt .txt
  > text
  ```

- `dirname`
  返回文件路径

  ```shell
  dirname /home/test/aaa/text.txt
  > /home/test/aaa/
  ```

  

### 自定义函数

```shell
#!/bin/bash
function getSum() {

        SUM=$[$n1+$n2]
        echo "两个数的和是$SUM"

}

read -p "请输入一个数字n1=" n1
read -p "请输入一个数字n2=" n2

getSum $n1 $n2
```

