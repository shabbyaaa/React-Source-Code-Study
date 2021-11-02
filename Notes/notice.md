#### React可中断渲染并没有在稳定版本中暴露

> 如题，我一直以为React已经在稳定版本暴露了可中断的渲染，但最近阅读React源码发现并非如此。。。

从大二时第一次接触到React这个框架开始，就对于这个用于构建用户界面的 JavaScript 库情有独钟。

在去年秋招面试的时候，投递的公司都会看其技术框架是否为React，对于React的面试题也恶补了一番。记得很清楚，问道React相关的题目时，基本都会问到React最新的Fiber架构，是怎么实现可中断的渲染的，也就从那时，我就一直认为这是已经正式落地实现的功能，直到。。。


在React最稳定的17.02中，可中断的渲染虽然已经实现，但并没有在稳定版暴露出API，只能安装alpha版本才能体验该特性。

直到这个消息对我来说内心其实是五味杂陈的，不知道说点啥，引用7kms大佬的话吧

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b50ae2258d4455986cd55549f7ba902~tplv-k3u1fbpfcp-watermark.image?)










最后给推荐两位对阅读React源码有帮助的两位博主,希望能让大家阅读React源码时少走点弯路。
- [卡老师](https://react.iamkasong.com/#%E5%AF%BC%E5%AD%A6%E8%A7%86%E9%A2%91)
- [7kms](https://github.com/7kms/react-illustration-series) 
