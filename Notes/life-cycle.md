### ReactFiberBeginWork.js

```javascript
const instance = workInProgress.stateNode

if (instance === null) {  // 初始走mount阶段
  // constructor在此方法执行
  constuctClassInstance(workInProgress, Component, nextProps) // new Component()
  mountClassInstance(workInProgress, Component, nextProps, renderLanes) //初始化挂载
}
```

### ReactFiberClassComponent.js

```javascript
mountClassInstance(workInProgress, ctor: Component, newProps, renderLanes) {
  const getDerivedStateFromPorps = ctor.getDerivedStateFromPorps
  
  if (typeof getDerivedStateFromPorps === 'function') {
    // 执行getDerivedStateFromProps 得到合并的state
    ==>
    const prevState = workInProgress.memoizedState
    let partialState = getDerivedStateFromPorps(nextPorps, prevState)
    const memoizedState = partialState === null || partialState === undefined ? prevState ?
          Object.assign({}, prevState, partialState)
    
    workInProgress.memoizedState = memoizedState
    
    instance.state = workInProgress.memoizedState
  }
    
   if (typeof ctor.getDerivedStateFromPorps !== 'function' && typeof instance.getSnapshotBeforeUpdate !== 'function' && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
     // 执行 componentWillMount life-cycle
   }
}
```



























