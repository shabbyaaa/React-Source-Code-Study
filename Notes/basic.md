# 基础包架构

1. react

React基础包，只提供定义react组件(ReactElement)的必要函数，一般来说需要和渲染器
(react-dom, react-native)一起使用，在编写react应用时，大部门都是调用此包的API

2. react-dom

react渲染器之一，是react与web平台链接的桥梁(可以在浏览器和nodejs环境中使用),将
react-reconciler中的运行结果输出到web界面上，在编写react时，大多数场景下，能用
到此包的就是一个入口函数`ReactDom.render(<App />, document.getElementById('root'))`，其余使用的api，基本时react包提供的。

3. react-reconciler

> react得以运行的核心包(综合协调`react-dom, react, shheduler`各包之间的条用与
配合),管理react应用状态的输入和输出的结果，将输入信号最终转换成输出信号传递给渲
染器

- 接受输入(schedulerUpdateOnFiber)，将`fiber`树生成罗技封装到一个回调函数中
- 吧此回调函数(`performSyncWorkOnRoot`和`performConcurrentWorkOnRoot`)送
如`scheduler`进行调度
- `scheduler`会控制回调函数执行的时机。回调函数执行完成后得到全新的`fiber`树
= 再条用渲染器(`react-dom`, `react-native`等)将`fiber`树形结构最终反映到界面上

4. scheduler

> 调度机制的核心实现，控制由`react-reconciler`送入的回调函数的执行时机。再`concurrent`模式下可以实现任务分片。
- 核心人物就是执行回调
- 通过控制回调函数的执行时机，来达成任务分片的目的，实现可中断渲染
