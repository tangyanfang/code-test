/* eslint-disable @typescript-eslint/no-explicit-any */

import { string } from 'vue-types'
import type { PropOptions, PropType } from 'vue-types/dist/types'
type Prop<T, D = T> = PropOptions<T, D> | PropType<T>
type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T]

type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>
type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? Record<string, any>
      : T extends BooleanConstructor | { type: BooleanConstructor }
        ? boolean
        : T extends Prop<infer V, infer D>
          ? unknown extends V
            ? D
            : V
          : T

// eslint-disable-next-line @typescript-eslint/ban-types
export type IxPublicPropTypes<O> = O extends object
  ? { [K in PublicRequiredKeys<O>]: InferPropType<O[K]> } & { [K in PublicOptionalKeys<O>]?: InferPropType<O[K]> }
  : { [K in string]: any }

// 定义表头列类型
export interface ColumnTitle {
  title: string,
  columnProp: string,
  sortable: boolean,
  scale?: number,
  sortType?: string,
  sortCls?: string
};

// 定义表格内容每个单元格类型
export interface Column {
  id: string,
  value: string,
  scale: number
};

// 定义表格行数据类型
export interface Row {
  rowId: string,
  column1: string,
  column2: string,
  column3: string,
  column4: string,
  column5: string,
  column6: string,
  columns?: Array<Column>,
  [propName: string]: any,
};



