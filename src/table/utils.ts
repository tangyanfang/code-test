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

// 表格数据处理
export let getColumns = (row: any, headers: any[]) => {
  const handleColumns: any = []
  headers.forEach((item: any) => {
    handleColumns.push({
      id: item.columnProp,
      value: row[item.columnProp],
      scale: item.scale || 1,
    })
  })
  return handleColumns;
}
export let hanledRowData = <T>(tableData: Array<T>, columnTitle: any): Array<T> => {
  return tableData.map((row) => {
    return {
      ...row,
      columns: getColumns(row, columnTitle),
    }
  })
}

// 获取每个td的宽度方法
export let getTdWidth = (scale: number, column: any) => {
  return `${scale/(column.length) * 100}%`
}
