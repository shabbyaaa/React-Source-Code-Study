## babel babel-transform-jsx

React.createElement()

```js
function  createElement(type, config, children) {
  return ReactElement
}

```

## mount阶段 递归 beginWork completeWork 

首次mount只有整个应用的根节点有current，有effectTag: placement
每个hostCompoment(元素dom节点)节点completeWork后都会createElement，通过appendAllChildren将创建的dom挂载到父节点，其dom结构保存在stateNode中
最终都挂载到根节点上

## update阶段



