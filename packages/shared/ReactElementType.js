/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type Source = {|
  fileName: string,
  lineNumber: number,
|};

export type ReactElement = {|
  $$typeof: any, // 辨别ReactElement对象

  // 内部属性
  type: any, // 表明节点的种类
  key: any,
  ref: any,
  props: any,
  // ReactFiber  记录创建对象的 Fiber节点，还未与Fiber树关联之前，该属性为null
  _owner: any,

  // __DEV__
  _store: {validated: boolean, ...},
  _self: React$Element<any>,
  _shadowChildren: any,
  _source: Source,
|};
