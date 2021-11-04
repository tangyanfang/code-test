<template>
  <div class="my-table-header">
    <tr>
      <th v-for="item in list"
          :key="item.title"
          :class="useClasses(item)"
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
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import type { ColumnTitle } from '../types';
import { 
  SORT_TYPES, 
  ASC_CLS,
  DES_CLS
} from '../const';

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
  setup(props, {emit}) {
    const state = reactive({
      list: props.headerData,
      sortName: '',
      sortType: ''
    })

    // 获取排序图标类
    const useClasses = (item: ColumnTitle) => {
      if (state.sortName !== item.columnProp) return;
      return state.sortType === SORT_TYPES.asc ? ASC_CLS : (state.sortType === SORT_TYPES.des ? DES_CLS : '');
    }

    // 抛出排序事件
    const handleSortClick = (item: ColumnTitle): void => {
      if (!item.sortable) {
        return;
      }
      state.sortName = item.columnProp;

      // 排序方式循环
      const sortTypes = [SORT_TYPES.asc, SORT_TYPES.des, SORT_TYPES.reset];
      const newIndex = (sortTypes.indexOf(state.sortType || SORT_TYPES.reset) + 1) % sortTypes.length;
      state.sortType = sortTypes[newIndex];
      emit('sort-handle', state.sortName, state.sortType)
    }

    // 接收分页后排序事件
    const sortCurrentPage = () => {
     emit('sort-handle', state.sortName, state.sortType)
    };
    return { 
      ...toRefs(state),
      handleSortClick,
      useClasses,
      sortCurrentPage
    }
  },
})
</script>


