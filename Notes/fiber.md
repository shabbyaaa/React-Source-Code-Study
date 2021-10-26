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
