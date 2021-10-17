/**
 * 表格body
 */

 import { defineComponent } from '@vue/composition-api'
 import { tableProps } from '../types'
 
 export default defineComponent({
   name: 'TableBody',
   props: tableProps,
   setup(props, { slots }) {
     return () => {
       return (
         <div class='my-table__body'>
           <tr>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>2</td>
            <td>2</td>
          </tr>
         </div>
       )
     }
   },
 })
 
