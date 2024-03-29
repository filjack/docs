// const path = require("path")
module.exports = {
  base: '/',
  port: 9999,
  title: 'NOTE',
  description: 'NOTE',
  themeConfig: {
    nav: [
      {
        text: 'JAVA',
        link: '/java/'
      },
      {
        text: 'WEB',
        link: '/web/'
      },
      {
        text: 'SQL',
        link: '/sql/'
      },
      {
        text: 'SPRING',
        link: '/spring/'
      },
      {
        text: 'MYBATIS',
        link: '/mybatis/'
      },
      {
        text: '操作系统',
        link: '/os/'
      },
      {
        text: '数据结构',
        link: '/ds/'
      },
      {
        text: '设计模式',
        link: '/dp/'
      },
      {
        text: 'LINUX',
        link: '/linux/'
      },
      {
        text: '小册子',
        link: '/bk/'
      },
      {
        text: '工具',
        link: '/tools/'
      }
    ],
    // 侧边栏设置
    sidebar: {
      '/spring/': [
        '',
        // 'spring',
        'Spring5',
        'IoC',
        'AOP',
        'Transaction',
        'springMVC',
        'spring-boot-test',
        'spring-boot',
        'Spring项目常用注解',
        '参数校验注解',
        '使用问题',
      ],
      '/mybatis/': [
        '',
        'Mybatis缓存',
        'Mybatis拦截器'
      ]
      ,
      '/tools/': [
        '',
        'UML',
        'maven',
      ],
      '/sql/': [
        '',
        'mysql',
        'mysql全球化和本地化',
        'mysql安全机制',
        'mysql_NULL详解',
        'mysql事件',
        'mysql事务处理',
        'mysql数据类型',
        'mysql触发器',
        'mysql存储引擎',
        '索引',
        'SQL优化',
        'SQL范式'
      ],
      '/java/': [
        '',
        '语言特性',
        '基本语法',
        '数组',
        '面向对象',
        '接口',
        'Object类',
        '集合',
        '异常',
        '包与导入',
        '泛型',
        'lambda',
        'Stream',
        'IO',
        '并发',
        '常用工具包',
        '常用关键字',
        '正则表达式',
        '序列化',
        '网络编程',
        '日期与时间',
        '加密解密',
        'ClassPath',
        'ArrayList',
        'ConcurrentHashMap',
        'HashMap',
        'HashMap1.7',
        'Vector',
        '10-脚本、编译与注解处理',
        'Tip-JAVA编译器和解释器',
        'Tip-JAVA经验之谈',
        'Tip-JAVA命令行参数与main方法',
        'Tip-JAVA小技巧',
        '附录A-一个简单的JAVA应用程序',
        '附录C-字符串',
        '附录D-Unicode编码',
        'fail-fast&fail-safe',
        '附录G-JAVA反射',
        '附录K-JAVA内部类',
        '附录L-JAVA代理',
        '附录-JavaBean',
        '附录-类加载器',
        '附录-注解',
        '文档注释',
        '编程规约'
      ],
      '/os/': [
        '',
        '基本概念',
        '进程',
        '线程',
        '调度',
        '进程调度',
        '调度算法',
        '同步与互斥',
        '进程互斥',
        '信号量',
        '管程',
        '死锁',
        '死锁处理策略',
        '内存基本知识',
        '内存管理',
        '内存空间扩充',
        '内存空间的分配与回收',
        '动态分区分配算法',
        '具有块表的地址变换机构',
        '两级页表',
        '基于段式存储管理',
        '段页式管理',
        '虚拟存储技术',
        '请求分页管理方式',
      ],
      '/ds/': [
        '',
        '数组和字符串',
        '链表'
      ],
      '/dp/': [
        '',
        '评价代码指标',
        '面向对象vs面向过程',
        '面向对象编程',
        '接口vs抽象类',
        '基于接口而非实现原则',
        '组合优于继承原则',
        '基于贫血模型vs基于充血模型',
        '单一职责原则',
        '开闭原则',
        '里氏替换原则',
        '接口隔离原则',
        '依赖反转原则',
        '关注点分离原则',
        '设计模式',
        '基于角色的访问控制方式',
      ],
      '/bk/': [
        '',
        '操作系统课后习题小册'
      ],
      '/web/': [
        '',
      ],
      '/linux/': [
        '',
        '分区',
        '目录结构',
        'vi和vim',
        '开机和关机命令',
        '用户管理命令',
        '权限管理命令',
        '文件目录命令',
        '时间日期类命令',
        '搜索查找类命令',
        '压缩与解压缩命令',
        '管道与输出重定向命令',
        '其他常用命令',
        '网络连接的三种方式',
        '系统运行级别',
        '定时任务调度命令',
        '磁盘分区与挂载',
        '网络配置',
        '进程管理',
        'Shell',
        '问题记录',
      ]
    },
    // 设置页面滚动为平滑滚动
    smoothScroll: true
  }
  // alias: {
  //   '@assert': path.resolve(__dirname, '../assert')
  // }
}