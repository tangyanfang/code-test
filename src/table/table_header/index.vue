<template>
  <div class="my-table-header">
    <tr>
      <th v-for="item in data.list"
          :key="item.title"
          :class="{ cansort: item.sortable, ascending: item.sortType === 'asc', descending: item.sortType === 'des'}"
          @click="handleSortClick(item)"
      >
        <span>{{ item.title }}</span>
        <span v-if="item.sortable"
            class="caret-wrapper">
          <button class="sort-caret ascending">
          </button>
          <button class="sort-caret descending">
          </button>
        </span>
      </th>
    </tr>
  </div>
</template>
<script lang="ts">

/**
 * 表格头
 */

import { PropType } from '@vue/runtime-dom';
import { defineComponent, reactive } from '@vue/composition-api'
import type { ColumnTitle } from '../types';
export default defineComponent({
  name: 'TableHeader',
  props: {
    headerData: {
      type: Array as PropType<Array<ColumnTitle>>,
      default: () => {
        return []
      },
    },
  },
  emits: ['sort-handle'],
  setup(props, context) {
    const data = reactive({
      list: props.headerData,
    })

    // 表头数据添加sortType属性
    data.list = data.list.map(item => {
      return {
        ...item,
        sortType: 'reset',
      }
    })

    // 抛出排序事件
    const handleSortClick = (item: any): void => {
      const SORT_TYPE = ['asc', 'des', 'reset'];
      if (!item.sortable) {
        return;
      }
      let newIndex = SORT_TYPE.indexOf(item.sortType) + 1;
      if (newIndex >= SORT_TYPE.length) {
        newIndex = 0;
      }
      item.sortType = SORT_TYPE[newIndex];
      context.emit('sort-handle', item.columnProp, item.sortType)
    }

    // 初始化排序状态
    const initSortType = (): void => {
      data.list.forEach(item => {
        item.sortType = ''
      })
    }
    return { data, handleSortClick, initSortType }
  },
})
</script>


