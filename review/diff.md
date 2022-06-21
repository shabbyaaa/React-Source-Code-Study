## 单一节点的diff

上次更新时的Fiber节点是否存在对应dom节点 => 否 新生成
 ||> 是
dom节点是否可以复用 =》是 将上次更新的Fiber节点的副本作为本次新生成的Fiber节点并返回

标记dom需要被删除

新生成一个Fiber节点并返回

比较current Fiber和jsx对象


## 为降低算法复杂度，react对diff的三个限制

1. 只对同级元素进行diff。如果一个dom节点在前后两次更新中跨越了层级，那么react不会尝试复用
2. 两个不同类型的元素会产生不同的树。如果元素type变了，则会销毁新建
3. 可通过key进行优化


## 多节点diff  array

reconcileChildrenArray

分为两次遍历 第一次遍历更新的  第二次其他的 

