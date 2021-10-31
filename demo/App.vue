<template>
  <div>
    <TestTable :content-data="data.list"
               :header-data="header"
               :page-size="pageSize"
    />
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table'
import { defineComponent, reactive, onMounted } from '@vue/composition-api'
import { headerData } from './test_data'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {

    //表格内容
    const data = reactive({
      list: [],
    })

    // 其他配置数据
    const option = reactive({
      header: headerData,
      pageSize: 20
    });


    // 获取表格数据
    const loadData = () => {
      data.list = Array.from(Array(100)).map((v, i) => {
        return {
          rowId: i + 1,
          column2: i + '1',
          column1: i + '2',
          column3: i + '3',
          column6: i + '4',
          column5: i + '5',
          column4: i + '6',
        }
      })
    }
    onMounted(() => {
      loadData()
    }); 
    return { data, ...option }
  },
})
</script>
