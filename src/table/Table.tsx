/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent, h } from '@vue/composition-api'
import TableHeader from './table_header';
import TableBody from './table_body';
import TableFooter from './table_footer';

export default defineComponent({
  name: 'Table',
  components: {
    TableHeader,
    TableBody,
    TableFooter,
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props, { slots }) {
    window.console.log(props.tableData);
    return () => {
      return (
        <table border="1" class='my-table'>
          <table-header></table-header>
          <table-body></table-body>
          {/* <table-footer></table-footer> */}
        </table>
      )
    }
  },
  render() {
    return h(
      'table',
      {
        class: 'my-table',
        cellspacing: '0',
        cellpadding: '0',
        border: '1',
      },
      [
        h('table-header', {
          props: {
            tableTitleList: []
          }
        }),
        h('<table-body', {

        })
      ]
    )
  }
})
