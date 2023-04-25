// const path = require("path")
module.exports = {
  base: '/',
  title: 'NOTE',
  description: 'NOTE',
  themeConfig: {
    nav: [
      {
        text: 'java',
        link: '/java/'
      }
    ],
    // 侧边栏设置
    sidebar: {
      '/java/': [
        '',
        '01-JAVA语言特性',
        '02-JAVA基本语法',
        '03-JAVA数据结构',
        '04-JAVA面向对象设计',
        '05-JAVA集合',
        'ArrayList',
        'ConcurrentHashMap',
        'HashMap',
        'HashMap1.7',
        'Vector',
        '06-JAVA并发',
        '07-JAVA流',
        '08-JAVA的IO',
        '09-JAVA函数式编程',
        '10-脚本、编译与注解处理',
        '11-JAVA异常',
        'Tip-JAVA包',
        'Tip-JAVA编译器和解释器',
        'Tip-JAVA经验之谈',
        'Tip-JAVA类路径的设置',
        'Tip-JAVA命令行参数与main方法',
        'Tip-JAVA小技巧',
        '附录A-一个简单的JAVA应用程序',
        '附录B-常用工具包',
        '附录C-字符串',
        '附录D-Unicode编码',
        '附录E-JAVA常用关键字',
        'fail-fast&fail-safe',
        '附录F-JAVA文档注释',
        '附录G-JAVA反射',
        '附录I-JAVA接口',
        '附录J-JAVA的lambda表达式',
        '附录K-JAVA内部类',
        '附录L-JAVA代理',
        '附录M-JAVA泛型',
        '附录N-正则表达式',
        '附录-JavaBean',
        '附录-类加载器',
        '附录-注解'
      ]
    },
    // 设置页面滚动为平滑滚动
    smoothScroll: true
  }
  // alias: {
  //   '@assert': path.resolve(__dirname, '../assert')
  // }
}