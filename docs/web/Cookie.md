

# Cookie

## Cookie基本概念

Cookie是浏览网站时由网络服务器创建并由网页浏览器存放在用户计算机或其他设备的小文本文件。

Cookie使Web服务器能在用户的设备存储状态信息（如添加到在线商店购物车中的商品）或跟踪用户的浏览活动（如点击特定按钮、登录或记录历史）

Cookie在同一个域名下是全局的。也就是说，在同一个域名下，cookie是共享的，但是一旦跨域，cookie则不能共享。

Cookie大小限制与浏览器有关，基本上都是4kb左右。

## Cookie结构

一般包括名，值，[各种属性](https://zh.wikipedia.org/zh-hans/Cookie)

<img :src="$withBase='/img/cookie-1.png'" class="align-center" />

![](F:/TalkFreely/learn-demo/docs/docs/.vuepress/public/img/cookie-1.png)

<img :src="$withBase='/img/cookie-2.png'" class="align-center" />

![](F:/TalkFreely/learn-demo/docs/docs/.vuepress/public/img/cookie-2.png) 

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