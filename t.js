class EventEmitter {
  constructor() {
    // this.listeners = {}

    if (!EventEmitter.instance) {
      this.listeners = {}
      EventEmitter.instance = this
    }
    return EventEmitter.instance
  }

  // static getInstance() {
  //   if (!this.instance) {
  //     this.instance = new EventEmitter()
  //   }

  //   return this.instance
  // }

  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  }

  emit() {
    const arr = Array.prototype.slice.call(arguments)
    const type = arr[0]
    const params = arr.slice(1)
    if (this.listeners[type]) {
      this.listeners[type].forEach(callback => {
        callback.apply(this, params)
      })
    }
  }

  off(type, callback) {
    if (this.listeners[type]) {
      const index = this.listeners[type].findIndex(i => i === callback)

      if(index !== -1) {
        this.listeners[type].splice(index, 1)
      }

      if (this.listeners[type].length === 0) {
        delete this.listeners[type]
      }
    }
  }

  offAll(type) {
    if (this.listeners[type]) {
      delete this.listeners[type]
    }
  }
}

const eventBus = new EventEmitter()
const eventBus1 = new EventEmitter()

// console.log(eventBus === eventBus1)

function handleClick(param1, param2) {
  console.log('param1 :>> ', param1);
  console.log('param2 :>> ', param2);
  console.log(param1, param2)
}
// eventBus.on('click', handleClick)
// eventBus.emit('click', 'foo', 'bar') // 打印输出: foo bar


// const A = (arr) => {
//   let res = []
//   for(let i = 0; i < arr.length; i++) {
//     if(res.indexOf(arr[i]) == -1) {
//       res.push(arr[i])
//     }
//   }
// }

function check(array) {
  var direction 
  if (array[0] < array[1]) {
    direction = {
      type: 'asc', fn: (a, b) => a < b
    }
  } else if (array[0] > array[1]) {
    direction = {
      type: 'desc', fn: (a, b) => a > b
    } 
  } else {
    direction = {
      type: 'ping', fn: (a, b) => a == b
    } 
  }
  
  return array.every((v, i, a) => !i || direction.fn(a[i - 1], v))
      ? direction.type
      : 'no';
}

// console.log([[15, 7, 3, -8], [4, 2, 30], [1, 2, 3], [1,1,1,1,1]].map(check));

const arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
]

function arrToTree (arr) {
  let res
  const map = {}

  for(let item of arr) {
    const id = item.id
    const pid = item.pid

    if (!map[id]) {
      map[id] = {
        children: []
      }
    }

    map[id] = {
      ...item,
      children: map[id]['children']
    }

    const root = map[id]

    if(pid === 0) {
      res = root
    } else {
      if (!map[pid]) {
        map[pid] = {
          children: []
        }
      }
      map[pid].children.push(root)
    }
  }

  return res
}

function ToTree(arr){
  return arr
          .sort((a, b) => b.pid - a.pid)
          .filter(item=>{
              item.children = arr.filter(subitem=> subitem.pid === item.id);
              return item.pid === 0;
          })
}

// console.log('arrToTree :>> ', JSON.stringify(arrToTree(arr)));

// console.log('ToTree :>> ', JSON.stringify(ToTree(arr)));



// Promise




const PENDING = 'PENDING' // 等待态: 初始状态，不是成功或失败状态。
const FULFILLED = 'FULFILLED' // 完成态: 意味着操作成功完成。
const REJECTED = 'REJECTED' // 失败态: 意味着操作成功失败。
// 当 promise 处于 Pending 状态时，可以转变为 Fulfilled 或者 Rejected

class Promise {
  constructor(executor) {
    // 存储订阅的onFulfilled函数和onRejected函数
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    this.status = PENDING
    this.value = undefined // value 是任意的 JavaScript 合法值(包括 undefined)
    this.reason = undefined // reason 是用来表示 promise 为什么被拒绝的原因

    // 当 promise 状态为 Pedding 时: resolve 函数可以将 promise 由 Pending 转变为
    //  Fulfilled，并且更新 promise 的 value 值。reject 函数可以将 promise 由 Pending 
    // 转变为 Rejected，并且更新 promise 的 reason 值

    // this 指向问题。箭头函数
    // 在 Promise 中调用为默认调用，this 非严格模式指向 window ，严格模式指向 undefined。 ES6 class 默认为严格模式，因此指向 undefined。
    // 所以使用普通函数，我们获取不到 Promise 中的 value 属性。
    const resolve = value => {
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED
        this.onFulfilledCallbacks.forEach(cb => cb(this.value))
      }
    }

    const reject = reason => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.onRejectedCallbacks.forEach(cb => cb(this.reason))
      }
    }

    try {
      // executor 有两个参数，分别为 resolve，reject，且两个参数都是函数
      // executor 会立即执行
      executor(resolve, reject)
    } catch (e){
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    // 当 onFulfilled/onRejected 为非函数类型，Promise 会分别发生值传递和异常传递。
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v
    onRejected = typeof onRejected === 'function' ? onRejected : (e) => { throw e }

    let promise = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        try {
          let x = onFulfilled(this.value)
          resolve(x)
        } catch (e) {
          reject(e)
        }
      }

      if (this.status === REJECTED) {
        try {
          let x = onRejected(this.reason)
          resolve(x)
        } catch (e) {
          reject(e)
        }
      }

      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value)
            resolve(x)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.reason) 
            resolve(x)
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise
  }
}

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  });
});
p1.then((v) => v + 1)
  .then((v) => v * 2)
  .then()
  .then((v) => console.log(v));

// 输出 Error1，说明链式调用仍然是成功的。
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(1);
  });
});
p2.then(
  () => {},
  (r) => new Error(r)
).then(
  (v) => console.log("v", v),
  (r) => console.log("r", r)
);


// Promise.all  方法类似于一群兄弟们并肩前行，参数可以类比为一群兄弟，只有当兄弟全部快乐，
// all 老大才会收获快乐；只要有一个兄弟不快乐，老大就不会快乐。

Promise.all = function (promises) {
  const result = []; // 存储promise成功数据
  let count = 0; // promise总数
  let fulfilledCount = 0; //完成promise数量
  return new Promise((resolve, reject) => {
    // 捕获代码执行中的异常
    try {
      for (let p of promises) {
        // i为遍历的第几个promise
        // 使用let避免形成闭包问题
        let i = count;
        count++; // promise总数 + 1
        Promise.resolve(p)
          .then((data) => {
            fulfilledCount++; // 完成的promise数量+1
            // 将第i个promise成功数据赋值给对应位置
            result[i] = data;
            if (count === fulfilledCount) {
              // 代表最后一个promise完成了
              // 返回result数组
              resolve(result);
            }
          })
          .catch(reject);
        // 传入promise数量为0
        if (count === 0) {
          resolve(result); // 返回空数组
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};




// Promise.allSettled() 方法接受一个数组作为参数，数组的每个成员都是一个 Promise 对象，
// 并返回一个新的 Promise 对象。只有等到参数数组的所有 Promise 对象都发生状态变
// 更（不管是 fulfilled 还是 rejected），返回的 Promise 对象才会发生状态变更。

Promise.allSettled = function (promises) {
  const result = [];
  let count = 0;
  let totalCount = 0; //完成promise数量
  return new Promise((resolve, reject) => {
    try {
      for (let p of promises) {
        let i = count;
        count++; // promise总数 + 1
        Promise.resolve(p)
          .then((res) => {
            totalCount++;
            // 成功时返回成功格式数据
            result[i] = {
              status: "fulfilled",
              value: res,
            };
            // 执行完成
            if (count === totalCount) {
              resolve(result);
            }
          })
          .catch((error) => {
            totalCount++;
            // 失败时返回失败格式数据
            result[i] = {
              status: "rejected",
              reason: error,
            };
            // 执行完成
            if (count === totalCount) {
              resolve(result);
            }
          });
        if (count === 0) {
          resolve(result);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};


// 只要某个 promise 改变状态就返回其对应结果。
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
      for (let p of promises) {
          // Promise.resolve将p进行转化，防止传入非Promise实例
          // race执行机制为那个实例发生状态改变，则返回其对应结果
          // 因此监听
          Promise.resolve(p).then(resolve).catch(reject);
      }
  })
}

// any 方法与 race 方法很像，也存在短路特性，只要有一个实例变成 fulfilled 状态，
// 就会返回成功的结果；如果全部失败，则返回失败情况。
Promise.any = function(promises) {
  return new Promise((resolve,reject) => {
      let count = 0;
      let rejectCount = 0;
      let errors = [];
      let i = 0;
      for (let p of promises) {
          i = count;
          count ++;
          Promise.resolve(p).then(res => {
              resolve(res)
          }).catch(error => {
              errors[i] = error;
              rejectCount ++;
              if (rejectCount === count) {
                  return reject(new AggregateError(errors))
              }
          })
      }
      if(count === 0) return reject(new AggregateError('All promises were rejected'))        
  })
}

function tryNTimes (asyncFn, n) {
  const arr = []
  for(let i = 0; i < n; i++) {
    arr.push(asyncFn)
  }
  for(let item of arr) {

  }

  const result = []; // 存储promise成功数据
  let count = 0; // promise总数
  let fulfilledCount = 0; //完成promise数量
  return new Promise((resolve, reject) => {
    // 捕获代码执行中的异常
    try {
      for (let p of arr) {
        // i为遍历的第几个promise
        // 使用let避免形成闭包问题
        let i = count;
        count++; // promise总数 + 1
        Promise.resolve(p)
          .then((data) => {
            fulfilledCount++; // 完成的promise数量+1
            // 将第i个promise成功数据赋值给对应位置
            result[i] = data;
            if (count === fulfilledCount) {
              // 代表最后一个promise完成了
              // 返回result数组
              resolve(result);
            }
          })
          .catch(reject);
        // 传入promise数量为0
        if (count === 0) {
          resolve(result); // 返回空数组
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}
function ReverseList(pHead)
{
    // write code here
    let list = null;
    let p = pHead;
    let q = null
    if (p === null) return null
    while(p.next !== null){
        q = p.next;
        p.next = list;
        list = p;
        p = q;
    }
    p.next = list;
    list = p;
    return list
}

// 输入: 1->2->3->4->5->NULL
// 输出: 5->4->3->2->1->NULL
// var reverseList = function(head) {
//   let list = null, p = null, q = head
//   if (q === null) return null

//   while(q.next) {
//       p = q.next // 2,3,4  3,4  4
//       q.next = list // null  1  2,1
//       list = q // 1  2,1  3,2,1
//       q = p // 2,3,4 // 3,4   4
//   }

//   q.next=list
//   console.log(q)
//   return q
// };

'use strict'

function getExpirationDate(year, month, day, n) {
  // TODO
  const m = month + n
  const y = Math.floor(m / 12)
  month = m % 12
  year += y

  // if (month > 11) {
  //   month = 1
  //   year += 1
  // } else {
  //   month += 1
  // }
  const nextMonthDays = getDaysByYearAndMonth(year, month)

  // 处理下月天数没有当前天多时 eg: 下个月为 2月 或是 31 => 30
  if (nextMonthDays < day) {
    day = nextMonthDays
  }

  return [year, month, day];
}

 // 根据年月获取天数
function getDaysByYearAndMonth(year, month) {
  let isRYear = false
  let days

  if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
    isRYear = true
  }

  switch (month) {
    case 4:
    case 6:
    case 9:
    case 11:
      days = 30
      break
    case 2:
      days = isRYear ? 29 : 28
      break
    default:
      days = 31
      break
  }

  return days
}

console.log(getExpirationDate(2018, 12, 10, 12))
// console.log(getExpirationDate(2018, 12, 10))
// console.log(getExpirationDate(2018, 1, 30))
// console.log(getExpirationDate(2019, 4, 30))
// console.log(getExpirationDate(2019, 5, 31))