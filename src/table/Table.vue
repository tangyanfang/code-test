<template>
  <table class="my-table">
    <table-header ref="tableHeaderComponent"
                  :header-data="header"
                  @sort-handle="sortHandleEmit"
    />
    <table-body ref="tableBodyComponent"
                :header-data="header"
                :content-data="content.list"
                :page-size="size"
    />
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

import { defineComponent, reactive, ref } from '@vue/composition-api'
import TableHeader from './table_header/index.vue'
import TableBody from './table_body/index.vue'
import TablePager from './pager/index.vue'

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
      type: Array,
      default: () => {
        return []
      },
    },

    // 表格内容
    contentData: {
      type: Array,
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
      list: props.contentData,
    })
    const size = ref(props.pageSize)
    const tableBodyComponent = ref<any>()
    const tableHeaderComponent = ref<any>()

    // 向body组件发送排序事件
    const sortHandleEmit = (columnId: string, type: string) => {
      tableBodyComponent.value.sortHandle(columnId, type)
    }

    // 向body组件发送分页事件
    const pageHandleEmit = (currentPage: number) => {
      tableBodyComponent.value.pageHandle(currentPage)
    }

    // 向head组件发送初始化排序方式事件
    const initSortTypeEmit = () => {
      tableHeaderComponent.value.initSortType()
    }

    // 获取最大页码
    const maxPage = Math.ceil(content.list.length/size.value)

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
