<template>
  <table class="my-table">
    <table-header ref="tableHeaderComponent"
                  :header-data="header"
                  @sort-handle="sortHandleEmit"
    />
    <table-body ref="tableBodyComponent"
                :header-data="header"
                :content-data="content.list"
                :page-size="size">
        <template v-slot:column="{column, rowData}" >
          <slot name="column" :row-data="rowData" :column="column"></slot>
        </template>
    </table-body>
    <table-pager
      :max-page="maxPage"
      :page-size="size"
      @page-handle="pageHandleEmit"
      @init-sort-type="initSortTypeEmit"
    />
  </table>
</template>

<script lang="ts">

/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent, reactive, ref, computed, watch } from '@vue/composition-api'
import TableHeader from './table_header/index.vue'
import TableBody from './table_body/index.vue'
import TablePager from './pager/index.vue'
import { PropType } from '@vue/runtime-dom';
import type { Row, ColumnTitle } from './types';
import debug from 'debug';
const log = debug('table:Table');

export default defineComponent({
  name: 'Table',
  components: {
    TableHeader,
    TableBody,
    TablePager,
  },
  props: {

    // 表头内容
    headerData: {
      type: Array as PropType<Array<ColumnTitle>>,
      default: () => {
        return []
      },
    },

    // 表格内容
    contentData: {
      type: Array as PropType<Array<Row>>,
      default: () => {
        return []
      },
    },

    // 每页展示的数据条数
    pageSize: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    const header = props.headerData
    const content = reactive({
      list: [] as Array<Record<string, any>>,
    })
    const size = ref(props.pageSize)
    const tableBodyComponent = ref<any>()
    const tableHeaderComponent = ref<any>()

    // 监听父组件的tabledata
    watch(() => props.contentData, newVal => {
      content.list = newVal
    })

    // 向body组件发送排序事件
    const sortHandleEmit = (columnId: string, type: string) => {
      tableBodyComponent.value.sortHandle(columnId, type)
    }

    // 向body组件发送分页事件
    const pageHandleEmit = (currentPage: number, currentSize: number) => {
      size.value = currentSize;
      tableBodyComponent.value.pageHandle(currentPage, currentSize)
      log(`当前页码：${currentPage}，每页数据条数：${currentSize}`);
    }

    // 向head组件发送初始化排序方式事件
    const initSortTypeEmit = () => {
      tableHeaderComponent.value.initSortType()
    }

    // 获取最大页码
    const maxPage = computed(() => Math.ceil(content.list.length/size.value));


    return {
      header,
      content,
      size,
      maxPage,
      sortHandleEmit,
      pageHandleEmit,
      initSortTypeEmit,
      tableBodyComponent,
      tableHeaderComponent,
    }
  },
})
</script>
