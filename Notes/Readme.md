### 启动流程

> 无论是Legacy,Concurrent或Blocking模式，react在初始化时，都会创建3个全局对象

1. ReactDOMRoot对象（属于react-dom）包，暴露有render,unmount方法，调用该实例的render方法，可以引导react应用启动
2. fiberRoot对象（属于react-reconciler包，作为react-reconciler在运行过程的全局上下文，保存fiber构建过程所依赖的全局对象）
3. HostRootFiber对象(属于react-reconciler包，这是react应用的第一个fiber对象，是fiber树的根节点，节点的类型是HostRoot)

blocking模式已在最新的main分支中被移除，在17.0.2的tag中还存在

#### Legacy下的启动

> 通常React项目在Legacy模式下启动都是通过
> ReactDOM.render(<App />, document.getElementById('app'))
> 在react-dom/ReactDOM中可以看到render方法来自ReactDOMLegacy.js
>
> Hydrate ssr相关 hydrate 描述的是 ReactDOM 复用 ReactDOMServer 服务端渲染的内容时尽可能保留结构，并补充事件绑定等 Client 特有内容的过程。

大致方法调用 legacyRenderSubtreeIntoContainer => createContainer => createFiberRoot => createHostRootFiber => createFiber => new FIberNode

最后根节点fiber上的mode对应三种不同的模式，其根据上面方法的tag决定 

eg: Legacy模式下 createContainer(LegacyRoot)

```jsx
type RootTag = 0 | 1
type LegacyRoot = 0
type ConcurrentROot = 1
```

```jsx
function render(
	element: React$Element(any),
  container: COntainer,
  callback: ?function
) {
  return legacyRenderSubtreeIntoCOntainer(null, element, container, false, callback)
}

function legacyRenderSubtreeIntoContainer(
	parentComponent,
  children,
  container,
  forceHydrate,
  callback
) {
    let root = container._reactRootContainer
    let fiberRoot: FiberRoot
    
    if (!root) {
      root = container._reactRootContainer = legacyCreateRootFromCOntainer(container, horceHydrate)
      fiberRoot = root
      
      if (typeof callback === 'function') {
        const originalCallback = callback
        callback = function() {
          // instance最终指向children(入参，例如(<APP />生成的dom节点))
          const instance = getPublicRootInstance(fiberROot)
          originalCallback.call(instance)
        }
      }
      // 更新容器
      unbatchUpdates(() => {
        updateContainer(children, fiberRoot, parentComponent, callback)
      })
    } else {
      fiberRoot = root
      ...     // callback update
    }
}
    
function legacyCreateRootFromDOMContainer() {
  const root = createContainer()
}
// react-reconciler
function createContainer() {
  return createFiberRoot()
}
    
function createFiberRoot() {
  const root = new FiberRootNode()
  
  const uninitializedFiber = createHostRootFiber() // createFiber()
  
  root.current = uninitializedFiber
  uninitalizedFiber.stateNode = root
  
  if (enableCache) {
    const initialCache = new Map()
    
    root.pooledCache = initialCache
    
    const initialState = {
      element: null,
      cache: inintalCache
    }
    
    unitializedFiber.memoizedState = initialState // 缓存current树的state
  } else {
    const initialState = {
      element: null
    }
    uninitializedFiber.memoizedState = initialState
  }
  
  initializedUpdateQueue(uninitializedFiber) // 初始化更新对队列 updateQueue  uninitializedFiber.updateQueue = queue: UpdateQueue<State>;
  
  return root
}
```



## render渲染器 reconciler构造器 scheduler调度器

1. 渲染器 react-dom
   - 将react-reconciler构造出来的fiber树表现出来，生成dom节点，生成字符串（ssr） 
2. 构造器 reconciler
   - 装载渲染器
   - 接收react-dom包（初次render）和react包（后续更新）发起的更新请求
   - 将Fiber树的构造过程包装在一个回调函数中，并将此回调函数传入到scheduler包等待调度

3. 调度器
   - 把react-reconciler提供的回调函数，包装到一个任务对象中
   - 在内部维护一个更新队列，优先级高的排在最前面
   - 循环消费队列，直到队列清空

## Fiber

### ReactElement对象
所有采用jsx语法书写的节点，都会被编译器转换，最终会以React.createElement()的方式，创建一个与之对应的ReactElement对象
#### shared/ReactElementType.js
```jsx
  type ReactElement = {
    $$type: any, // 辨别ReactElementdui对象

    type: any, // 表明节点的种类
    key: any,
    ref: any,
    props: any,

    // ReactFiber 记录创建本对象的Fiber节点，还未与Fiber树关联之前，该属性为null
    _owner: any
  }
```

### react-reconciler包是React应用的中枢，连接渲染器（react-dom）和调度中心（scheduler），同时自身也负责fiber树的构造
#### ReactInternalTypes.js
```jsx
  type Fiber = {
    tag: WorkTag, // Fiber类型，根据ReactElement组件的type进行生成
    key: null | string,
    elementType: any,
    type: any,
    stateNode: any, // 与Fiber关联的局部状态节点（eg: HostComponent类型只想与Fiber节点对应的dom节点根节点（FiberRoot)，class类型其指向class实例）
    return: Fiber | null, // 父节点
    child: Fiber | null, // 第一个子节点
    sibling: Fiber | null, // 下一个兄弟节点
    index: number, // Fiber在兄弟节点中的索引，如果是单节点默认为0
    ref: RefObject, // reconciler 阶段会将 string类型的ref转换为一个function类型
    pendingProps: any, // 输入属性，从ReactElement对象传入的props，用于和Fiber.memoizedProps比较得出属性是否变动
    memoizedProps: any, // 上一次生成节点时的属性
    updateQueue: mixed, // 存储update更新对象的队列，每一次发起更新，都需要在该队列上创建一个update对象
    memoizedState: any, //上一次生成子节点之后保存在内存中的局部状态
    dependencies: Dependencies | null, // 该Fiber节点所依赖的（context，events）
    mode: TypeOfMode, // 继承自父节点，影响此Fiber节点及其子树中所有节点，与React应用的运行模式有关（ConcurrentMode, BolckingMode, NoMode）

    // Effect副作用相关
    flags: Flags, // 标记位
    subtreeFlags: Flags,
    deletions: Array<Fiber> | null, // 存储将要被删除的子节点
    nextEffect: Fiber | null, // 单项链表，只想下一个有副作用的Fiber节点
    firstEffect: Fiber | null, // 只想副作用链表的第一个Fiber节点
    lastEffect: Fiber | null, // 最有一个Fiber节点

    // 优先级相关
    lanes: Lanes, //此Fiber节点的优先级
    childLanes: Lanes, //子节点的优先级
    alternate: Fiber | null, // 只想内存中另一个Fiber 每个被更新过得Fiber在内存中都是成对出现的（current和workInProgress)
  }
```
#### ReactWorkTags.js
```jsx
  export const FunctionComponent = 0;
  export const ClassComponent = 1;
  export const IndeterminateComponent = 2; // Before we know whether it is function or class
  export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
  export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
  export const HostComponent = 5;
  export const HostText = 6;
  export const Fragment = 7;
  export const Mode = 8;
  export const ContextConsumer = 9;
  export const ContextProvider = 10;
  export const ForwardRef = 11;
  export const Profiler = 12;
  export const SuspenseComponent = 13;
  export const MemoComponent = 14;
  export const SimpleMemoComponent = 15;
  export const LazyComponent = 16;
  export const IncompleteClassComponent = 17;
  export const DehydratedFragment = 18;
  export const SuspenseListComponent = 19;
  export const ScopeComponent = 21;
  export const OffscreenComponent = 22;
  export const LegacyHiddenComponent = 23;
  export const CacheComponent = 24;
```

## UpdateQueue

> 在Fiber中并没有pendingState，那么新的state如何和memoizedState做比较呢

更新队列updateQueue作为Fiber对象的一个属性，通过shared将各个更新对象Update 串联起来

Fiber和ReactElement共同构成了一个树形结构

#### ReactUpdateQueue.js

```jsx
type Update<State> = {
  eventTime. 
  lane,
  tag, // Update的种类 UpdateState，ReplaceState，ForceUpdate，CaptureUpdate
  payload, // Update真正需要更新的数据，可以设置为一个回调函数或者对象
  callback, // 回调函数，commit完成之后调用
  next: Update<State> | null // 指向链表的下一个，UpdateQueue为环形链表，最后一个Update.next指向第一个Update对象
}

type SharedQueue<State> = {
  pending: Update<State> | null, // 指向即将输入Update队列，在class组件调用setState()之后，沪江新的Update对象添加打这个队列中
  interleaved: Update<State> | null,
  Lanes: Lanes
}

type UpdateQueue<State> = {
  baseState: State, // 表示此队列基础state
  firstBaseUpdate: Update<State> | null, // 指向基础队列队首
  lastBaseUpdate: Update<State> | null, // 队尾
  shared: SharedQueue<State> | null, // 共享队列
  effects: Array<Update<State>> // 用于保存callback回调函数的Update对象，在commit之后会依次执行里面的回调函数
}
```

## Scheduler - Task

> scheduler负责调度 维护一个任务队列 taskQueue, 

#### Scheduler.js

```jsx
  var expirationTime = startTime + timeout;

  // 最小堆
  var newTask = {
    id: taskIdCounter++, // 唯一标识
    callback, // 指向react-reconciler包所提供的的回调函数
    priorityLevel, // 优先级
    startTime, // 时间戳 代表task的开始时间（创建时间+延时时间）
    expirationTime, // 过期时间
    sortIndex: -1, // 控制task在队列中的次序 值越小约靠前
  };
```





## 项目启动

#### react-dom包中暴露出render unmount方法

```jsx
// react-dom/src/client/ReactDOMRoot.js
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

// updateContainer 来自 react-reconciler/src/ReactFiberReconciler
ReactDOMRoot.prototype.render = function(children: ReactNodeList) {
  updateContainer(children, root, null, null)
}

ReactDOMRoot.prototype.unmount = function() {
  const root = this._internalRoot
  const container = root.containerInfo
  
  updateContainer(null, root, null, () => {
    unmarkContainerAsRoot(container)
  })
}

// react-reconciler/src/ReactFiberReconciler.js
function UpdateContainer(
	 element: ReactNodeList,
   container: QueueRoot,
   parentComponent,
   callback
) {
  const current = container.current
  const eventTime = requestEventTime() // 获取程序运行到目前为止的时间，用于进行优先级排序
  const lane = requestUpdateLane(current) // 获取优先级
  
  const update = createUpdate(eventTime, lane)
  update.payload = { element } // 实际要更新的值
     
  enqueueUpdate(current, update, lane)
   //scheduleUpdateOnFiber 首次渲染或者后续更新都会调用此api
   // 在ReactFiberWorkLoop.js中 调用 performSyncWorkOnRoot(root)
  const root = scheduleUpdateOnFiber(current, lane, eventTime)
  
  if (root !== null) {
    entangleTransitions(root, current, lane)
  }
     
  return lane
}
```

