# MAVEN

## 为什么使用maven？

1. 管理依赖包的工具，使得对于依赖的管理更加清晰，能够自动管理依赖包之间的关系，并且通过配置仓库地址，可以实现自动下载依赖包以及间接依赖的依赖包。
2. 作为构建（指的是项目从编译、测试、运行、打包、安装 、部署整个过程都交给 maven 进行管理,这个过程称为构建）项目的工具

## 什么是maven？

> Maven 是一个用 Java 语言开发的程序，它必须基于 JDK 来运行

是一款专门为java项目提供的**构建**和**依赖管理**支持的工具。

<img :src="$withBase='/img/maven核心图.png'" class="align-center"/>

### 构建

构建通俗来讲是利用原材料生成产品的过程。例如，通过java源代码、html、图片、配置文件之类的“原材料”得到一个可以在服务器上运行的项目。

- 清理：删除上一次构建的结果
- 编译：java源文件编译成class文件
- 测试：单元测试，整合了junit工具
- 报告：针对测试结果生成一个整理的信息
- 打包：java----jar包  web----war包
- 安装：把一个maven工程经过打包操作生成的jar或war包存入maven仓库
- 部署：
  - 部署jar包：把一个 jar 包部署到 Nexus 私服服务器上
  - 部署 war 包：借助相关 Maven 插件（例如 cargo），将 war 包部署到 Tomcat 服务器上

### 依赖管理

如果A工程依赖于B工程中的资源，则称A依赖B

依赖管理要解决的问题：

- jar 包的下载：使用 Maven 之后，jar 包会从规范的远程仓库下载到本地
- jar 包之间的依赖：通过依赖的**传递性**自动完成
- jar 包之间的冲突：通过对依赖的**配置**进行调整，让某些jar包不会被导入

## 怎么配置maven？

### 配置本地仓库

```xml
  <!-- localRepository
   | The path to the local repository maven will use to store artifactFs.
   |
   | Default: ${user.home}/.m2/repository
  <localRepository>/path/to/local/repo</localRepository>
  -->
  <!--配置本地仓库，该目录maven会自动创建-->
  <localRepository>F:\TalkFreely\local-repository</localRepository>
```

### 配置镜像仓库

Maven 下载 jar 包默认访问境外的中央仓库，而国外网站速度很慢。改成阿里云提供的镜像仓库，访问国内网站，可以让 Maven 下载 jar 包的时候速度更快。

```xml
  <mirrors>
    <!-- mirror
     | Specifies a repository mirror site to use instead of a given repository. The repository that
     | this mirror serves has an ID that matches the mirrorOf element of this mirror. IDs are used
     | for inheritance and direct lookup purposes, and must be unique across the set of mirrors.
     |
    <mirror>
      <id>mirrorId</id>
      <mirrorOf>repositoryId</mirrorOf>
      <name>Human Readable Name for this Mirror.</name>
      <url>http://my.repository.com/repo/path</url>
    </mirror>
     -->
    <mirror>
      <id>alimaven</id>
      <name>aliyun maven</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
      <mirrorOf>central</mirrorOf>  <!--表示是中央仓库的一个镜像-->      
    </mirror>
  </mirrors>
```

### 配置JDK版本（选）

如果按照默认配置运行，Java 工程使用的默认 JDK 版本是 1.5，我们可以改变默认版本

```xml
<profiles>
    <profile>
	    <id>jdk-1.8</id>
	    <activation>
		    <activeByDefault>true</activeByDefault>
		    <jdk>1.8</jdk>
	    </activation>
	    <properties>
		    <maven.compiler.source>1.8</maven.compiler.source>
		    <maven.compiler.target>1.8</maven.compiler.target>
		    <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
	    </properties>
	  </profile>
</profiles>    
```

## maven坐标

### ①数学中的坐标

<img :src="$withBase='/img/maven坐标.png'" class="align-center"/>

使用 x、y、z 三个**『向量』**作为空间的坐标系，可以在**『空间』**中唯一的定位到一个**『点』**。

### ②Maven中的坐标

#### [1]向量说明

使用三个**『向量』**在**『Maven的仓库』**中**唯一**的定位到一个**『jar』**包。

- **groupId**：公司或组织的 id
- **artifactId**：一个项目或者是项目中的一个模块的 id
- **version**：版本号

#### [2]三个向量的取值方式

- groupId：公司或组织域名的倒序，通常也会加上项目名称
  - 例如：com.atguigu.maven
- artifactId：模块的名称，将来作为 Maven 工程的工程名
- version：模块的版本号，根据自己的需要设定
  - 例如：SNAPSHOT 表示快照版本，正在迭代过程中，不稳定的版本
  - 例如：RELEASE 表示正式版本

举例：

- groupId：com.atguigu.maven
- artifactId：pro01-atguigu-maven
- version：1.0-SNAPSHOT

### ③坐标和仓库中 jar 包的存储路径之间的对应关系

坐标：

```xml
  <groupId>javax.servlet</groupId>
  <artifactId>servlet-api</artifactId>
  <version>2.5</version>
```

上面坐标对应的 jar 包在 Maven 本地仓库中的位置：

```text
Maven本地仓库根目录\javax\servlet\servlet-api\2.5\servlet-api-2.5.jar
```

## 使用命令生成maven工程

<img :src="$withBase='/img/mvn-archetype命令.png'" class="align-center" />

## maven的pom文件

```xml
<!--project 根标签 ，表示对当前工程进行配置、管理 -->
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <!-- modelVersion ，从maven2开始固定是4.0.0。代表当前pom所采用的标签结构 -->
  <modelVersion>4.0.0</modelVersion>

  <!-- 坐标信息 -->
  <!-- groupId，坐标向量之一，代表公司或组织开发的某一个项目 -->
  <groupId>com.xpf</groupId>
  <!-- artifactId，坐标向量之一，代表项目下的某一个模块 -->
  <artifactId>mvndemo</artifactId>
  <!-- version，坐标向量之一，代表当前模块的版本 -->
  <version>1.0-SNAPSHOT</version>

  
  <!-- packaging ，当前项目的打包方式 -->
  <!-- jar：生成jar包，说明当前工程是一个java工程 -->
  <!-- war：生成war包，说明当前工程是一个web工程 -->
  <!-- pom：说明当前工程是用来管理其它工程的工程 -->
  <packaging>jar</packaging>

  <!-- name，当前工程的名字 -->
  <name>mvndemo</name>
  <!-- url，maven官网地址，一般没用 -->
  <url>http://maven.apache.org</url>

  <!--properties，用来在maven中定义属性值，可以是maven提供的，也可以是自定义的  -->
  <properties>
    <!-- 在构建过程中读取源码使用的字符集 -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <!-- dependencies，配置具体依赖信息，可以包含多个dependency -->
  <dependencies>
    <!-- dependency，用来配置一个具体的依赖信息 -->
    <dependency>
      <!-- 配置需要导入依赖的坐标信息 -->
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <!-- scope，配置当前依赖的作用范围 -->
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

### pom含义

> 将项目或者说是工程，通过特殊的语言进行描述，比如maven中的坐标，这样可以使用这种高度抽象，高度概括的表述来更加清晰、更加简易的进行管理或者说使用该项目

POM：**P**roject **O**bject **M**odel，项目对象模型。和 POM 类似的是：DOM（Document Object Model），文档对象模型。它们都是模型化思想的具体体现。

POM 表示将工程抽象为一个模型，再用程序中的对象来描述这个模型。这样我们就可以用程序来管理项目了。我们在开发过程中，最基本的做法就是将现实生活中的事物抽象为模型，然后封装模型相关的数据作为一个对象，这样就可以在程序中计算与现实事物相关的数据。

## maven约定的目录结构

目录结构是由一个超级POM规定好的。

<img :src="$withBase='/img/maven约定的目录结构.png'" class="align-center"/>

另外还有一个 target 目录专门存放构建操作输出的结果.

### 约定目录结构的意义

Maven 为了让构建过程能够尽可能自动化完成，所以必须约定目录结构的作用。例如：Maven 执行编译操作，必须先去 Java 源程序目录读取 Java 源代码，然后执行编译，最后把编译结果存放在 target 目录。

### 约定大于配置

Maven 对于目录结构这个问题，没有采用配置的方式，而是基于约定。这样会让我们在开发过程中非常方便。如果每次创建 Maven 工程后，还需要针对各个目录的位置进行详细的配置，那肯定非常麻烦。

目前开发领域的技术发展趋势就是：**约定大于配置，配置大于编码。**

可以将约定理解为默认的配置，当然默认的配置都是可覆盖的。