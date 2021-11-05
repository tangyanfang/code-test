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
              <span :class="column.id">{{ column.value }}</span>
            </slot>
        </td>
      </div>
    </div>
    <div v-else 
      class="empty">
      暂无数据
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 表格body
 */

import { toRefs, defineComponent,  reactive, watch, computed } from '@vue/composition-api'
import { compare, getTdWidth } from '../utils';
import debug from 'debug';
import { PropType } from '@vue/runtime-dom';
import { cloneDeep } from 'lodash-es'
import type { ColumnTitle, Row, Column } from '../types';
const log = debug('table:body');

export default defineComponent({
  name: 'TableBody',
  props: {
    headerData: {
      type: Array as PropType<Array<ColumnTitle>>,
      default: () => {
        return []
      },
    },
    contentData: {
      type: Array as PropType<Array<Row>>,
      default: () => {
        return []
      },
    }
  },

  setup(props, { emit }) {
    const state = reactive({
      columnTitle: props.headerData,
      fixedRowData: [] as Array<Row>, // 渲染到页面上的数据
    });

    // 获取表格当前页原始数据
    const useConvertProps = (props: any) => {

      // 表格中的列数据添加列属性
      const getColumns = (row: any, headers: Array<ColumnTitle>) => {
        const handleColumns: Array<Column> = []
        headers.forEach((item: ColumnTitle) => {
          handleColumns.push({
            id: item.columnProp,
            value: row[item.columnProp],
            scale: item.scale || 1,
          })
        })
        return handleColumns;
      }

      // 将每行的列数据处理成数组
      const hanledRowData = (tableData: Array<Row>, columnTitle: Array<ColumnTitle>): Array<Row> => {
        return tableData.map((row) => {
          return {
            ...row,
            columns: getColumns(row, columnTitle),
          }
        })
      }
      const currentPageSource = computed(() => {
        return hanledRowData(props.contentData, state.columnTitle);
      })
      return { currentPageSource };
    }
    const { currentPageSource } = useConvertProps(props);

    // 监听currentPageSource
    watch(() => currentPageSource.value, newVal => {
      if (!newVal.length) {
        log('原始数据不存在！')
        return;
      }
      state.fixedRowData = cloneDeep(newVal); // 将分页完的数据复制给fixedRowData
      emit('sort-current-page'); // 分页后对数据重新排序
    }, { immediate: true })

    // 排序方法
    const sortHandle = (columnId: string, type: string) => {
      if (type !== 'reset') {
        state.fixedRowData = state.fixedRowData.sort(compare(columnId, type))
        log(`排序列：${columnId}，排序类型：${type}`);
        return;
      }
      state.fixedRowData = cloneDeep(currentPageSource.value);
    }
    return {  
      ...toRefs(state),
      currentPageSource,
      getTdWidth, 
      sortHandle
    }
  },
})
</script>
