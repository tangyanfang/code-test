/**
 * 表格头
 */

 import { defineComponent, h, ref } from '@vue/composition-api'
 
 export default defineComponent({
   name: 'TableHeader',
   props: {
     tableTitleList: {
        type: Array,
        default: () => {
          return []
        }
    }
   },
   setup(props, { slots }) {
     window.console.log(props.tableTitleList);
     return () => {
       return (
          h(
            'div',
            {
              class: "my-table-header"
            },
            [
              h('tr', {},
              [
                // test.map(item => {
                //   h('th', {}, item.columnTitle)
                // })
              ])
            ])
       )
     }
   },
 })
 
