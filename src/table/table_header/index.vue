<template>
  <div class="my-table-header">
    <tr>
      <th v-for="item in data.list"
          :key="item.title"
      >
        <span>{{ item.title }}</span>
        <span v-if="item.sortable">
          <button :disabled="item.sortType === 'asc'" @click="handleSortClick(item, item.columnProp, 'asc')">
            升序
          </button>
          <button :disabled="item.sortType === 'des'" @click="handleSortClick(item, item.columnProp, 'des')">
            降序
          </button>
          <button :disabled="!item.sortType" @click="handleSortClick(item)">
            恢复
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
import { columnTitle } from '../types';
export default defineComponent({
  name: 'TableHeader',
  props: {
    headerData: {
      type: Array as PropType<Array<columnTitle>>,
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
        sortType: '',
      }
    })

    // 抛出排序事件
    const handleSortClick = (item: any, columnProp?: string, type?: string): void => {
      item.sortType = type || ''
      context.emit('sort-handle', columnProp, type)
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


