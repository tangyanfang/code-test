<template>
  <div class="table-wrap">
    <TestTable  ref="tableComponent"
               :content-data="data.list"
               :header-data="header">
        
        <!-- 自定义列 -->
        <template v-slot:column="{column, rowData}">
          <span v-if="column === 'column3'">
            {{ `第三列：${rowData.column1}` }}
          </span>
          <span v-else-if="column === 'column4'">
            {{ `第四列：${rowData.column2}` }}
          </span>
          <span v-else="column === 'column2'">
            {{ rowData[column] }}
          </span>
        </template>
    </TestTable>
    <table-pager
      :total="data.list.length"
      @page-handle="pageHandleMethod"
    />
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table'
import TablePager from '../src/table/pager/index.vue'
import { ref, defineComponent, reactive, onMounted } from '@vue/composition-api'
import { headerData } from './test_data'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
    TablePager
  },
  setup() {

    //表格内容
    const data = reactive({
      list: [] as Array<Record<string, any>>,
    })

    // 其他配置数据
    const option = reactive({
      header: headerData
    });
    const tableComponent = ref<any>()

    // 获取表格数据
    const loadData = () => {
      data.list = Array.from(Array(100)).map((v, i) => {
        let num = 100;
        return {
          rowId: i + 1,
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
    const pageHandleMethod = (currentPage?: number, currentSize?: number) => {
      tableComponent.value.pageHandleEmit(currentPage, currentSize)
    }
    onMounted(() => {
      loadData();
    }); 
    return { 
      data, 
      ...option,
      tableComponent,
      pageHandleMethod
     }
  },
})
</script>
