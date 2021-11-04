<template>
  <div class="my-table-body">
    <div v-if="fixedRowData.length">
      <div v-for="item in fixedRowData"
         :key="item.rowId"
         class="row-content">
        <td v-for="column in item.columns"
            :key="column.id"
            :id="item.rowId + column.id"
            :title="column.value"
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

import { toRefs, defineComponent,  reactive, watch } from '@vue/composition-api'
import { compare, hanledRowData, getTdWidth } from '../utils';
import debug from 'debug';
import { PropType } from '@vue/runtime-dom';
import { cloneDeep } from 'lodash-es'
import type { Row } from '../types';
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
    const state = reactive({
      columnTitle: props.headerData,
      fixedRowData: [] as Array<Record<string, any>>, // 渲染到页面上的数据
      resourceData: [] as Array<Record<string, any>>, // 数据处理后的数据备份
      currentPageSource: [] as Array<Record<string, any>> // 当前页原始数据
    });

    // 监听父组件的tabledata
    watch(() => props.contentData, newVal => {
      state.fixedRowData =hanledRowData(newVal, state.columnTitle);
      state.resourceData = cloneDeep(state.fixedRowData);

      //////////////
      // 需要优化 //
      pageHandle(1, props.pageSize);
      log(`第一页数据：${state.fixedRowData}`);
    })

    // 排序方法
    const sortHandle = (columnId: string, type: string) => {
      if (type !== 'reset') {
        state.fixedRowData = state.fixedRowData.sort(compare(columnId, type))
        log(`排序列：${columnId}，类型：${type}`);
        return;
      }
      state.fixedRowData = cloneDeep(state.currentPageSource);
    }

    // 分页方法
    const pageHandle = (currentPage: number, currentSize: number) => {
      let size = props.pageSize;
      if (currentSize) {
        size = currentSize;
      }
      state.fixedRowData = state.resourceData.slice((currentPage - 1) * size, currentPage * size)
      log(`分页页码：${currentPage}，每页数量：${currentSize}`);

      // 切换页码后，保存原始数据
      state.currentPageSource = cloneDeep(state.fixedRowData);
    };
    return {  
      ...toRefs(state),
      getTdWidth, 
      sortHandle, 
      pageHandle 
    }
  },
})
</script>
