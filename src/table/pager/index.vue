<template>
  <ul class="my-table-pager">
    <li v-for="pager in pagers"
        :key="pager"
        :class="{ active: currentPage === pager }"
        class="number"
        @click="onPagerClick(pager)"
    >
      {{ pager }}
    </li>
  </ul>
</template>
<script lang="ts">

/**
 * 分页组件
 */

import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'TablePager',
  props: {
    maxPage: {
      type: Number,
      default: 1,
    },
  },
  emits: ['page-handle', 'init-sort-type'],
  setup(props, context) {
    const currentPage = ref(1) // 当前页码
    const pagers = Array.from(Array(props.maxPage)).map((v, i) => i+1) // 所有页码

    // 选择页码
    const onPagerClick = (page: number): void => {
      currentPage.value = page

      // 抛出分页事件、初始化排序方式事件
      context.emit('page-handle', currentPage.value)
      context.emit('init-sort-type')
    }

    return { currentPage, pagers, onPagerClick }
  },
})
</script>
