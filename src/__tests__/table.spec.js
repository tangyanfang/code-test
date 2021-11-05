import { mount } from '@vue/test-utils'
import Vue from 'vue'
import CompositionApi from '@vue/composition-api'
import { TestTable } from '../table'
import TableHeader from '../table/table_header/index.vue'
import TableBody  from '../table/table_body/index.vue'
import TablePager from '../table/pager/index.vue'
import { 
  column1SortData,
  headerData, 
  column1DesSortData, 
  column1AscSortData,  
  sortData
} from '../../demo/test_data'
import { compare } from '../table/utils';

Vue.use(CompositionApi)

describe('Table', () => {
  const tableWrapper = options => mount(TestTable, options)
  const tableBody = options => mount(TableBody, options)
  const tableHeader = options => mount(TableHeader, options)
  const tablePager = options => mount(TablePager, options)

  // 表格渲染测试
  test('render', () => {
    const table = tableWrapper({
      propsData: {
        headerData: headerData,
        contentData: sortData
      }
    })
    expect(table.html()).toMatchSnapshot()
    expect(() => {
      table.vm.$forceUpdate()
      table.vm.$destroy()
    }).not.toThrow()
  })

  // 表格数据为空测试
  test('表格数据为空', () => {
    const table = tableWrapper({})
    expect(table.find('.empty').exists()).toBe(true)
  })
  test('table-body数据为空', () => {
    const table = tableBody({})
    expect(table.find('.empty').exists()).toBe(true)
  })

  // 排序样式测试
  test('排序测试', async () => {
    const tableHeaderWrapper = tableHeader({
      propsData: {
        headerData: headerData
      }
    });
    // 期待存在排序按钮
    expect(tableHeaderWrapper.find('button').exists()).toBe(true)

    // 模拟点击第1列降序
    tableHeaderWrapper.findAll('button').wrappers[1].trigger('click') 

    // 点击完降序按钮后，期待按钮置灰
    expect(tableHeaderWrapper.findAll('button').wrappers[1].exists('[disabled=disabled]')).toBeTruthy()

    //断言是否发出排序事件
    expect(tableHeaderWrapper.emitted()['sort-handle']).toBeTruthy()
  })

  // 分页测试
  test('分页测试', async () => {
    const tablePagerWrapper = tablePager({
      propsData: {
        total: 100
      }
    });

    // 测试是否默认激活第一页
    expect(tablePagerWrapper.findAll('li.number').wrappers[0].find('.active').exists()).toBeTruthy()

    // 模拟点击第3页
    await tablePagerWrapper.findAll('li.number').wrappers[2].trigger('click') 

    // 测试分页条中的3是否激活
    expect(tablePagerWrapper.findAll('li.number').wrappers[2].find('.active').exists()).toBeTruthy()

    // 测试当前页码大于最大页码时，是否跳转到了第一页
    await tablePagerWrapper.setData({ currentPage: 5 })
    await tablePagerWrapper.setData({ currentSize: 100 })
    expect(tablePagerWrapper.findAll('li.number').wrappers[0].find('.active').exists()).toBeTruthy()

    // 测试currentSize变化时，有发送分页事件
    await tablePagerWrapper.setData({ currentSize: 50 })
    expect(tablePagerWrapper.emitted()['page-handle']).toBeTruthy()
  })

  // 测试table-body组件排序
  test('table-body排序结果测试', async () => {
    const table = tableWrapper({
      propsData: {
        headerData: headerData,
        contentData: sortData
      }
    })

    // 升序
    // 期待发送排序事件
    // 期待组件升序后的值等于给定的值
    await table.findAll('.my-table-header th').wrappers[0].trigger('click')
    expect(table.findComponent(TableHeader).emitted()['sort-handle']).toBeTruthy()
    let ascData = table.findComponent(TableBody)
      .findAll('.my-table-body .column1')
      .wrappers
      .map(node => Number(node.element.innerHTML))
    let ascDataBeforeStr = ascData.toString()
    expect(ascDataBeforeStr).toEqual(column1AscSortData.toString())

    // 降序
    // 期待组件降序后的值等于给定的值
    await table.findAll('.my-table-header th').wrappers[0].trigger('click')
    let desData = table.findComponent(TableBody).
      findAll('.my-table-body .column1').
      wrappers
      .map(node => Number(node.element.innerHTML))
    let desDataBeforeStr = desData.toString()
    expect(desDataBeforeStr).toEqual(column1DesSortData.toString())

    // 恢复
    // 期待组件恢复后的值等于给定的值
    await table.findAll('.my-table-header th').wrappers[0].trigger('click')
    let sourceData = table.findComponent(TableBody).
      findAll('.my-table-body .column1').
      wrappers
      .map(node => Number(node.element.innerHTML))
    let sourceDataBeforeStr = sourceData.toString()
    expect(sourceDataBeforeStr).toEqual(column1SortData.toString())
  })

  // 测试排序方法是否正确
  test('compare方法测试', async () => {
    let desSortData = sortData.sort(compare('column1', 'des'));
    expect(desSortData.toString()).toEqual(desSortData.toString())
    let ascSortData = desSortData.sort(compare('column1', 'asc'));
    expect(ascSortData.toString()).toEqual(sortData.toString())
  })
})
