# Servlet

> *Servlet 为创建基于 web 的应用程序提供了基于组件、独立于平台的方法，可以不受 CGI 程序的性能限制。Servlet 有权限访问所有的 Java API，包括访问企业级数据库的 JDBC API。* 

## Servlet基本概念

Servlet是一套规范，指代了一个运行在物理服务器上的程序，能够接收来自客户端的请求，并将物理服务器上的诸如数据库、应用程序的响应返回回去。

请求URL与对应资源的映射

<img :src="$withBase='/img/servlet-1.png'" class="align-center" />

![](F:\TalkFreely\learn-demo\docs\docs\.vuepress\public\img\servlet-1.png) 

### Servlet生命周期

当servlet被部署在应用服务器中（应用服务器中用于管理Java组件的部分被抽象成为容器）以后，由容器控制servlet的生命周期。除非特殊指定，否则在容器启动的时候，servlet是不会被加载的，servlet只会在第一次请求的时候被加载和实例化。servlet一旦被加载，一般不会从容器中删除，直至应用服务器关闭或重新启动。但当容器做存储器回收动作时，servlet有可能被删除。也正是因为这个原因，第一次访问servlet所用的时间要大大多于以后访问所用的时间。

servlet在服务器的运行生命周期为，在第一次请求（或其实体被内存垃圾回收后再被访问）时被加载并执行一次初始化方法，跟着执行正式运行方法，之后会被常驻并每次被请求时直接执行正式运行方法，直到服务器关闭或被清理时执行一次销毁方法后实体销毁。

- Servlet初始化后调用init()方法
- 调用service()方法处理客户端请求
- Servlet销毁前调用destroy()方法

#### init()

一个生命周期只调用一次，在第一次创建Servlet时使用，Servlet的创建一般是用户第一次调用对应于该Servlet的URL时，或者可以设置成服务器第一次启动时。**一般一个URL对应的Servlet只会在第一次访问时创建一次，也就是生命周期内是单实例的。** 

#### service()

执行实际任务的主要方法。Servlet调用service()方法来处理请求，并进行响应的返回。服务器每接收到一个Servlet请求，就产生一个新线程调用初始化时建好的实例的service()方法。

#### destroy()

在Servlet生命周期结束时被调用，只会被调用一次。做一些清理工作。

### 客户端与服务端常用请求方式

#### GET

明文传输数据，数据都体现在url里，所以能够传输数据的大小依赖与浏览器或服务端允许的url的长度。

#### POST

密文传输，能够传输数据的大小依赖与服务器的设置和服务器内存大小

## Servlet工作模式

1. 客户端发送请求至服务器
2. 服务器启动并调用Servlet，Servlet根据客户端请求生成响应内容并将其传给服务器
3. 服务器将响应返回给客户端
4. 其他操作

## Servlet与JSP关系

Java服务器页面（JSP）是HttpServlet的扩展。由于HttpServlet大多是用来响应HTTP请求，并返回Web页面（例如HTML、XML），所以不可避免地，在编写servlet时会涉及大量的HTML内容，这给servlet的书写效率和可读性带来很大障碍，JSP便是在这个基础上产生的。其功能是使用HTML的书写格式，在适当的地方加入Java代码片段，将程序员从复杂的HTML中解放出来，更专注于servlet本身的内容。

JSP在首次被访问的时候被应用服务器转换为servlet，在以后的运行中，容器直接调用这个servlet，而不再访问JSP页面。JSP的实质仍然是servlet。