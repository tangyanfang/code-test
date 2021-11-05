<template>
  <div class="table-wrap">
    <test-table 
      ref="tableComponent"
      :content-data="showData"
      :header-data="state.headers">
        
        <!-- 自定义列 -->
        <template v-slot:column="{column, rowData}">
          <span v-if="column === 'column3'">
            {{ `第三列：${rowData.column1}` }}
          </span>
          <span v-else-if="column === 'column4'">
            {{ `第四列：${rowData.column2}` }}
          </span>
          <span v-else
                :class="column">
            {{ rowData[column] }}
          </span>
        </template>
    </test-table>
    <table-pager
      :total="state.list.length"
      @page-handle="pageHandle"
    />
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table'
import TablePager from '../src/table/pager/index.vue'
import { ref, defineComponent, reactive, onMounted, computed } from '@vue/composition-api'
import { headerData } from './test_data'
import { Row } from 'src/table/types'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
    TablePager
  },
  setup() {
    const tableComponent = ref<any>()

    //表格内容
    const state = reactive({
      list: [] as Array<Row>,
      headers: headerData,
      currentPage: 1,
      pageSize: 20
    })

    // 表格展示数据
    const showData = computed(() => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      return state.list.slice(startIndex, startIndex + state.pageSize)
    })

    // 获取表格原始数据
    const loadData = () => {
      return new Array(100).fill(1).map((v, i) => {
        let num = 100;
        return {
          rowId: i + '1',
          column2: num - i,
          column1: i + '2',
          column3: i + '3',
          column6: i + '4',
          column5: i + '5',
          column4: i + '6',
        }
      })
    }

    // 向body组件发送分页事件
    const pageHandle = (currentPage: number, pageSize: number) => {
      state.currentPage = currentPage;
      state.pageSize = pageSize;
    }
    onMounted(() => {
      state.list = loadData();
    }); 
    return { 
      state,
      showData,
      tableComponent,
      pageHandle
     }
  },
})
</script>
