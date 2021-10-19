### ReactFiberBeginWork.js

```javascript
// render 递阶段开始
beginWork() {
  
  switch (wrokInProgress.tag) {
    case ClassComponent: {
      return updateClassComponent()
    }
  }
}

// 处理类组件 对未初始化的类组件进行初始化，对已经初始化的组件更新重用
updateClassComponent(
	current, // workInPregress会赋值给current树 current在初始化时为null 第一次fiber调和之后，workInPregress会赋值给current树
  workInProgress, // 当前正在调和的fiber树  当遍历到一个fiber时 该fiber会指向workInProgress  和current树构成双缓存机制
  Component, // class组件
  nextProps, // 在一次更新时新的props
  renderLanes // 优先级相关
) {
  const instance = workInProgress.stateNode
  let shouldUpdate

  if (instance === null) {  // 初始走mount阶段 组件实例不存在 证明还没有被挂载
    // constructor在此方法执行
    constuctClassInstance(workInProgress, Component, nextProps) // new Component()
    mountClassInstance(workInProgress, Component, nextProps, renderLanes) //初始化挂载
    shouldUpdate = true
  }


  const nextUnitOfWork = finishClassComponent(
    current,
    workInProgress,
    shouldUpdate,
    hasContext,
    renderLanes
  )
}


finishClassComponent() {
  nextChildren = instance.render()
  
  if (current === null) {
    // 开始调和
    reconcileChildren()
  } else {
    forceUnmountCurrentAndReconcile()
  }
}

reconcileChildren() {
     * export const reconcileChildFibers = ChildReconciler(true);
     * export const mountChildFibers = ChildReconciler(false);
  if (current === null) { // mount时
    workInProgress.child = mountChildFibers(
    	workInProgress,
      null,
      nextChildren,
      renderLanes
    )
  } else { // update时
    workInProgress.child = renconcileChildFibers(
    	workInProgress,
      current.child,
      nextChildren,
      renderLanes
    )
  }
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
    
    // memoizedState即上面的方法 执行了 getDerivedStateFromProps 生命周期后得到的合并的state
    instance.state = workInProgress.memoizedState
  }
    
   if (typeof ctor.getDerivedStateFromPorps !== 'function' && typeof instance.getSnapshotBeforeUpdate !== 'function' && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
     // 执行 componentWillMount life-cycle
   }
    
   // 标记componentDidMount 待到提交阶段更新完 dom 后执行
   if (typeof instance.componentDidMount === 'functin') {
     let fiberFlags = Update
     
     workInProgress |= fiberFlags
   }
}
```



























