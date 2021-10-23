import { mount } from '@vue/test-utils'
import Vue from 'vue'
import CompositionApi from '@vue/composition-api'
import { TestTable } from '../table'
import TableHeader from '../table/table_header/index.vue'
import TableBody  from '../table/table_body/index.vue'
import TablePager from '../table/pager/index.vue'
import { contentData, headerData, sortData, column1SortData, desSortData} from '../../demo/test_data'
import { compare } from '../table/utils';

Vue.use(CompositionApi)

describe('Table', () => {
  const TableMount = options => mount(TestTable, options)
  const tableHeader = options => mount(TableHeader, options)
  const tableBody = options => mount(TableBody, options)
  const tablePager = options => mount(TablePager, options)

  test('render', () => {
    const wrapper = TableMount()
    expect(wrapper.html()).toMatchSnapshot()
    expect(() => {
      wrapper.vm.$forceUpdate()
      wrapper.vm.$destroy()
    }).not.toThrow()
  })

  // 排序测试
  test('排序测试', async () => {
    const wrapper = TableMount()

    const tableHeaderWrapper = tableHeader({
      propsData: {
        headerData: headerData
      }
    });
    const tableBodyWrapper = tableBody({
      propsData: {
        headerData: headerData,
        contentData: sortData,
        pageSize: 20
      }
    });

    // 模拟点击第1列降序
    await tableHeaderWrapper.findAll('button').wrappers[1].trigger('click') 
    tableHeaderWrapper.vm.$emit('sort-handle', 'column1', 'des');

    // 检查是否降序排序了
    tableHeaderWrapper.vm.$nextTick(() => {
      const column1Data = tableBodyWrapper.findAll('.my-table-body .column1').wrappers.map(node => Number(node.element.innerHTML))
      const column1SortBeforeStr = column1Data.toString()
      expect(column1SortBeforeStr).toEqual(column1SortData.sort((a, b) => b - a).toString())
    })
  })

  // 分页测试
  test('测试分页2', async () => {
    const tableBodyWrapper = tableBody({
      propsData: {
        headerData: headerData,
        contentData: contentData,
        pageSize: 20
      }
    });
    const tablePagerWrapper = tablePager({
      propsData: {
        maxPage: 3
      }
    });

    // 测试是否默认激活第一页
    expect(tablePagerWrapper.findAll('li.number').wrappers[0].find('.active').exists()).toBeTruthy()

    // 模拟点击第3页
    await tablePagerWrapper.findAll('li.number').wrappers[2].trigger('click') 

    // 测试分页条中的3是否激活
    expect(tablePagerWrapper.findAll('li.number').wrappers[2].find('.active').exists()).toBeTruthy()
  })

  // 测试排序方法是否正确
  test('compare方法测试', async () => {
    let desSortData = sortData.sort(compare('column1', 'des'));
    expect(desSortData.toString()).toEqual(desSortData.toString())
    let ascSortData = desSortData.sort(compare('column1', 'asc'));
    expect(ascSortData.toString()).toEqual(sortData.toString())
  })
})
