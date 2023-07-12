# Servlet

> *Servlet 为创建基于 web 的应用程序提供了基于组件、独立于平台的方法，可以不受 CGI 程序的性能限制。Servlet 有权限访问所有的 Java API，包括访问企业级数据库的 JDBC API。* 

## Servlet基本概念

Servlet是一套规范，指代了一个运行在物理服务器上的程序，能够接收来自客户端的请求，并将物理服务器上的诸如数据库、应用程序的响应返回回去。

请求URL与对应资源的映射

<img :src="$withBase='/img/servlet-1.png'" class="align-center" />

### Servlet生命周期

- Servlet初始化后调用init()方法
- 调用service()方法处理客户端请求
- Servlet销毁前调用destroy()方法

#### init()

一个生命周期只调用一次，在第一次创建Servlet时使用，Servlet的创建一般是用户第一次调用对应于该Servlet的URL时，或者可以设置成服务器第一次启动时。**一般一个URL对应的Servlet只会在第一次访问时创建一次，也就是生命周期内是单实例的。** 

#### service()

执行实际任务的主要方法。Servlet调用service()方法来处理请求，并进行响应的返回。服务器没接收到一个Servlet请求，就产生一个新线程调用初始化时建好的实例的service()方法。

#### destroy()

在Servlet生命周期结束时被调用，只会被调用一次。做一些清理工作。

### 客户端与服务端常用请求方式

#### GET

明文传输数据，数据都体现在url里，所以能够传输数据的大小依赖与浏览器或服务端允许的url的长度。

#### POST

密文传输，能够传输数据的大小依赖与服务器的设置和服务器内存大小

# Cookie

## Cookie基本概念

Cookie是浏览网站时由网络服务器创建并由网页浏览器存放在用户计算机或其他设备的小文本文件。

Cookie使Web服务器能在用户的设备存储状态信息（如添加到在线商店购物车中的商品）或跟踪用户的浏览活动（如点击特定按钮、登录或记录历史）

Cookie大小限制与浏览器有关，基本上都是4kb左右。

## Cookie结构

一般包括名，值，[各种属性](https://zh.wikipedia.org/zh-hans/Cookie)

<img :src="$withBase='/img/cookie-1.png'" class="align-center" />

<img :src="$withBase='/img/cookie-2.png'" class="align-center" />

## Cookie分类

### 会话Cookie

会话Cookie仅在浏览网站时临时存储，关闭浏览器后会自动过期或删除。

### 持久Cookie

持久Cookie只在其创建者设置的特定日期后过期，期间一直有效。

### 安全Cookie

安全Cookie只能通过加密连接传输（HTTPS）。它们不能通过未加密的连接传输（HTTP），使Cookie不易被盗。

## Cookie用途

### 会话管理

虽然最初引入cookie是为了让用户在浏览网站时记录要购买的物品。但现在用户购物车的内容通常存储在服务器的数据库中，而不再是客户端的cookie中。

当前会话cookie的常见用途是登录。当用户访问网站的登录页面时，Web服务器通常会向客户端发送一个包含唯一会话标识符的cookie。当用户成功登录时，服务器会记住该特定会话标识符已经过身份验证，并授予用户访问其服务的权限。

### 喜好设定

许多网站用cookie存储用户偏好等设置，向用户显示喜好内容。

### 跟踪

跟踪cookie用于跟踪记录用户的网络浏览习惯，如用户的购物习惯。
