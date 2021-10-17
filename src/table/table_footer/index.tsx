/**
 * 表格footer
 */

 import { defineComponent } from '@vue/composition-api'
 import { tableProps } from '../types'
 
 export default defineComponent({
   name: 'TableFooter',
   props: tableProps,
   setup(props, { slots }) {
     return () => {
       return (
         <div class='my-table__footer'>footer</div>
       )
     }
   },
 })
 
