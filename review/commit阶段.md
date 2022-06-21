



## before mutation

commit阶段开始时执行
flushPassiveEffects()执行之前useEffect的销毁函数和执行useEffect的回调
没有遗留的effect时才开始commit阶段

getSnapshotBeforeUpdate生命周期执行
此时还没产生页面可见的更新

调度useEffect 在commit后异步执行

## mutation 

遍历包含effectTag的链条

insertBefore或者appendAllChild

执行componentWillUnmount生命周期

## layout

componentDidMount和componentDidUpdate

双缓存树 将当前的workInProgress赋值给current
root.current = finishedWork  

this.setState的第二个参数在此阶段执行