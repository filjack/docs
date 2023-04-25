# Spring

## IoC

控制反转，将依赖对象的创建与初始化交给容器来执行。

### BeanFactory

基础的Bean容器接口，提供基础的bean管理操作。该容器使用懒加载策略，只有当真正使用某一个bean时，才会对该bean进行创建与初始化。

### ApplicationContext

高级的bean容器接口，继承自BeanFactory。该容器对于所有单例bean，在容器启动时会全部进行创建和初始化操作。

### 容器功能实现的各个阶段

<img :src="$withBase='/img/container-function-implement.png'" class="align-center"/>

### bean生命周期

<img :src="$withBase='/img/spring-bean-life-cycle.png'" class="align-center"/>

#### singleton

同一IoC容器中是单例模式，生命周期约等于容器的生命周器。

#### prototype

多例，当使用者向容器请求该bean时，容器生成一个新的实例返回给使用者，同时，该实例的剩余生命周期交由使用者来管理。

#### request

用于web环境中，多例，每一个网络请求对应一个实例，当请求结束，实例的生命周期结束。

#### session

用于web环境中，多例，每一个session对应一个实例，当session结束，实例的生命周期结束

#### global session

同session

## AOP