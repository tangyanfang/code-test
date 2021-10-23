export const contentData = Array.from(Array(100)).map((v, i) => {
  return {
    rowId: i + 1,
    column2: i + '1',
    column1: i + '2',
    column3: i + '3',
    column6: i + '4',
    column5: i + '5',
    column4: i + '6',
  }
})

export const headerData = [{
  title: '标题111',
  columnProp: 'column1',
  sortable: true,
  scale: 1,
}, {
  title: '标题2',
  columnProp: 'column2',
  sortable: false,
  scale: 1,
}, {
  title: '标题13',
  columnProp: 'column3',
  sortable: false,
}, {
  title: '标题4',
  columnProp: 'column4',
  sortable: false,
}, {
  title: '标题5',
  columnProp: 'column5',
  sortable: false,
}, {
  title: '标题6',
  columnProp: 'column6',
  sortable: false,
}]

// 测试排序数据
export const sortData = Array.from(Array(2)).map((v, i) => {
  return {
    rowId: i + 1,
    column1: i,
    column2: i + '2',
    column3: i + '3',
    column6: i + '4',
    column5: i + '5',
    column4: i + '6',
  }
})

export const desSortData = [
  {
    rowId: '01',
    column1: 1,
    column2: '12',
    column3: '13',
    column6: '14',
    column5: '15',
    column4: '16',
  }, {
    rowId: '11',
    column1: 0,
    column2: '02',
    column3: '03',
    column6: '04',
    column5: '05',
    column4: '06',
  }]

// 第一列表数据
export const column1SortData = [0, 1];
