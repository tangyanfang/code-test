<template>
  <div>
    <TestTable :table-data="data">
    </TestTable>
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table'
import { defineComponent, ref } from '@vue/composition-api'
import { getTestData } from './test_data'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const data = ref(getTestData())

    return { data }
  },
})
</script>
