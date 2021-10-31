<template>
  <div v-if="tableBody.showBody"
       class="my-table-body">
    <div v-if="fixedRowData.list.length">
      <div v-for="item in fixedRowData.list"
         :key="item.rowId"
         class="row-content">
        <td v-for="column in item.columns"
            :key="column.id"
            :id="item.rowId + column.id"
            :title="column.innerText"
            :style="`width: ${getTdWidth(column.scale, columnTitle)}`"
            class="ellipsis">
            <slot name="column" :row-data="item" :column="column.id">
              <span>{{ column.value }}</span>
            </slot>
        </td>
      </div>
    </div>
    <div v-else>暂无数据</div>
  </div>
</template>

<script lang="ts">
/**
 * 表格body
 */

import { defineComponent,  reactive, watch, nextTick } from '@vue/composition-api'
import { compare, hanledRowData, getTdWidth } from '../utils';
import debug from 'debug';
import { PropType } from '@vue/runtime-dom';
import type { Row, Column } from '../types';
const log = debug('table:body');

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
      type: Array as PropType<Array<Row>>,
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
    let tableBody = reactive({
      showBody: true
    })
    const columnTitle = props.headerData;
    const fixedRowData = reactive({
      list: [] as Array<Record<string, any>>, // 渲染到页面上的数据
    })

    let resourceData = [] as Array<Record<string, any>>; // 数据处理后的数据备份
    const currentPageSource = { // 当前页原始数据
      list: [] as Array<Record<string, any>>,
    };

    // 监听父组件的tabledata
    watch(() => props.contentData, newVal => {
      fixedRowData.list =hanledRowData(newVal, columnTitle);
      resourceData = JSON.parse(JSON.stringify(fixedRowData.list));
      pageHandle(1, props.pageSize);
      log(`第一页数据：${fixedRowData.list}`);
    })

    // 排序方法
    const sortHandle = (columnId: string, type: string) => {
      if (type !== 'reset') {
        fixedRowData.list = fixedRowData.list.sort(compare(columnId, type))
        return;
      }
      fixedRowData.list = JSON.parse(JSON.stringify(currentPageSource.list))
      getInnerText(fixedRowData.list);
    }

    // 分页方法
    const pageHandle = (currentPage: number, currentSize: number) => {
      let size = props.pageSize;
      if (currentSize) {
        size = currentSize;
      }
      fixedRowData.list = resourceData.slice((currentPage - 1) * size, currentPage * size)
      getInnerText(fixedRowData.list);

      // 切换页码后，保存原始数据
      currentPageSource.list = JSON.parse(JSON.stringify(fixedRowData.list))
    };

    // 获取单元格里边的内容
    const getInnerText = (fixedRowData: Array<Record<string, any>>) => {
      nextTick(() => {
        fixedRowData.forEach((item) => {
          item.columns.forEach((column: any) => {
            column.innerText = document.getElementById(item.rowId + column.id)?.getElementsByTagName('span')[0].innerText;
          })
        })
        tableBody.showBody = false;
        tableBody.showBody = true;
      })
    };
    return { tableBody, fixedRowData, currentPageSource, columnTitle, getTdWidth, sortHandle, pageHandle, getInnerText }
  },
})
</script>
