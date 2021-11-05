// 工具方法

import { SORT_TYPES } from './const';

// 排序
export let compare = (property: string, type: string) => {
  return function(a: any ,b: any){
    const value1 = a[property]
    const value2 = b[property]
    if (type === SORT_TYPES.asc) {
      return value1 - value2;
    }
    return value2 - value1;
  }
}

// 获取每个td的宽度方法
export let getTdWidth = (scale: number, column: Array<any>) => {
  return `${scale/(column.length) * 100}%`
}
