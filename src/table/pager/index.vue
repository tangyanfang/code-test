<template>
  <div class="my-table-pager">
    <span>选择每页展示的数据条数：</span>
    <select v-model="currentSize"
            class="size-select">
      <option v-for="item in pageSizes"
              :key="item"
              :value ="item">{{item}}</option>
    </select>
    <ul class="pager-list">
      <li v-for="pager in pagers"
          :key="pager"
          :class="{ active: currentPage === pager }"
          class="number"
          @click="onPagerClick(pager)"
      >
        {{ pager }}
      </li>
    </ul>
  </div>
  
</template>
<script lang="ts">

/**
 * 分页组件
 */

import { defineComponent, reactive, toRefs, watch, computed } from '@vue/composition-api'
import debug from 'debug';
const log = debug('table:pager');

export default defineComponent({
  name: 'TablePager',
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
  emits: ['page-handle'],
  setup(props, {emit}) {

    // 基本数据
    const option = reactive({
      pageSizes: [20, 50, 100],
      currentSize: 20,
      currentPage: 1
    });
    const useConvertProps = (props: any) => {
      const maxPage =  computed(() => {
        return Math.ceil(props.total/option.currentSize);
      });

      // 获取所有页码
      const pagers = computed(() => Array.from(Array(maxPage.value)).map((v, i) => i+1)); 
      return  { maxPage, pagers };
    };
    const { maxPage, pagers } = useConvertProps(props);

    // 监听maxPage变化
    watch(maxPage, (newV) => {
      if (newV < option.currentPage) {
        option.currentPage = 1;
      }
    });

    // 监听currentSize变化
    watch(() => option.currentSize, (newV) => {
      changePage(option.currentPage, newV);
    });

    // 监听currentPage变化
    watch(() => option.currentPage, (newV) => {
      changePage(newV, option.currentSize);
    });

    // 选择页码
    const onPagerClick = (page: number): void => {
      option.currentPage = page;
    };

    // 抛出分页事件
    const changePage = (val: number, currentSize: number) => {
      emit('page-handle', val, currentSize)
    };
    return { 
      ...toRefs(option), 
      pagers,
      maxPage, 
      useConvertProps,
      onPagerClick, 
      changePage
    }
  },
})
</script>
