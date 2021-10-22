<template>
  <div class="my-table__body">
    <div v-for="item in fixedRowData.list"
         :key="item.columnId"
         class="row-content"
    >
      <td v-for="column in item.columns"
          :key="column.id"
          :style="`width: ${getTdWidth(column.scale)}`"
      >
        {{ column.value }}
      </td>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 表格body
 */

import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import { compare } from '../utils'

export default defineComponent({
  name: 'TableBody',
  props: {
    headerData: {
      type: Array,
      default: () => {
        return []
      },
    },
    contentData: {
      type: Array,
      default: () => {
        return []
      },
    },
    pageSize: {
      type: Number,
      default: 20,
    },
  },

  setup(props) {

    // 数据处理，给列数据添加属性
    const getColumns = (row: any, header: any) => {
      const handleColumns: any = []
      header.forEach((item: any) => {
        handleColumns.push({
          id: item.columnProp,
          value: row[item.columnProp],
          scale: item.scale || 1,
        })
      })
      return handleColumns
    }
    const hanledRowData = (tableData: any): void => {
      return tableData.map((row: any) => {
        return {
          ...row,
          columns: getColumns(row, columnTitle),
        }
      })
    }

    // data数据
    const rowData = reactive(props.contentData)
    const columnTitle = props.headerData
    const size = ref(props.pageSize)
    const fixedRowData = reactive({
      list: hanledRowData(rowData), // 渲染到页面上的数据
    })

    const resourceData = fixedRowData.list // 数据处理后的数据备份
    const currentPageSource = {
      list: [],
    } // 当前页原始数据

    // 排序方法
    const sortHandle = (columnId: string, type: string) => {

      if (columnId) {
        fixedRowData.list = fixedRowData.list.sort(compare(columnId, type))
        return
      }
      fixedRowData.list = JSON.parse(JSON.stringify(currentPageSource.list))
    }

    // 分页方法
    const pageHandle = (currentPage: number) => {
      const resource = resourceData
      fixedRowData.list = resource.slice((currentPage - 1)*size.value, currentPage * size.value)

      // 切换页码后，保存原始数据
      currentPageSource.list = JSON.parse(JSON.stringify(fixedRowData.list))
    }

    // 获取每个td的宽度方法
    const getTdWidth = (scale: number) => {
      return `${scale/(columnTitle.length) * 100}%`
    }

    onMounted(() => {
      pageHandle(1)
    })

    return { rowData, fixedRowData, currentPageSource, columnTitle, getTdWidth, sortHandle, pageHandle }
  },
})
</script>
