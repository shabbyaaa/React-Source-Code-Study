### ReactFiberBeginWork.js

```javascript
const instance = workInProgress.stateNode

if (instance === null) {
  constuctClassInstance(workInProgress, Component, nextProps) // new Component()
  mountClassInstance(workInProgress, Component, nextProps, renderLanes) //初始化挂载
}
```

