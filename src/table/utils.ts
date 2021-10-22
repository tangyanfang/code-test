// 工具方法

// 排序
export const compare = (property: string, type: string) => {
  return function(a: Object ,b: Object){
    const value1 = a[property]
    const value2 = b[property]
    if (type === 'asc') {
      return value1 - value2
    }
    return value2 - value1
  }
}
