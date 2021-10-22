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
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { headerData } from './test_data'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const data = reactive({
      list: [],
    })
    const header = reactive(headerData)
    const pageSize = ref(5)

    // 获取表格数据
    const loadData = () => {
      data.list = Array.from(Array(20)).map((v, i) => {
        return {
          columnId: i + 1,
          column2: i + '1',
          column1: i + '2',
          column3: i + '3',
          column6: i + '4',
          column5: i + '5',
          column4: i + '6',
        }
      })
    }
    loadData()
    return { data, loadData, header,  pageSize }
  },
})
</script>
