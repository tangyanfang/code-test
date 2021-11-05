<template>
  <table class="my-table">
    <table-header ref="tableHeaderComponent"
                  :header-data="header"
                  @sort-handle="sortHandle"
    />
    <table-body ref="tableBodyComponent"
                :header-data="header"
                :content-data="list"
                @sort-current-page="sortCurrentPage">
        <template v-slot:column="{column, rowData}" >
          <slot name="column" :row-data="rowData" :column="column"></slot>
        </template>
    </table-body>
  </table>
</template>

<script lang="ts">

/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, ref } from '@vue/composition-api'
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
    }
  },
  setup(props) {
    const header = props.headerData
    const tableBodyComponent = ref<any>()
    const tableHeaderComponent = ref<any>()

    // 获取表格数据
    const useConvertProps = (props: any) => {
      const list = computed(() => {
        return props.contentData;
      })
      return { list };
    }
    const { list } = useConvertProps(props);

    // 调用body组件排序方法
    const sortHandle = (columnId: string, type: string) => {
      tableBodyComponent.value.sortHandle(columnId, type);
    }

    // 调用body组件分页后排序方法
    const sortCurrentPage = () => {
      const headerComponentValue = tableHeaderComponent.value;
      if (!headerComponentValue || !headerComponentValue.sortName || !headerComponentValue.sortType) {
        log('不存在需要排序的列！');
        return;
      }
      sortHandle(headerComponentValue.sortName, headerComponentValue.sortType);
    };
    return {
      header,
      list,
      sortHandle,
      sortCurrentPage,
      tableBodyComponent,
      tableHeaderComponent,
    }
  },
})
</script>
