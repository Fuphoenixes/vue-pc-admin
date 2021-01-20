<template>
  <div class="app-page">
    <el-button :loading="$loadingPlugin.handleDownload" style="margin-bottom: 20px;" type="primary" icon="el-icon-document" @click="handleDownload">导出</el-button>
    <lb-table
      ref="multipleTable"
      v-loading="$loadingPlugin.fetchData"
      v-el-height-adaptive-table="{bottomOffset: 10}"
      element-loading-text="加载中"
      :column="tableData.column"
      :data="tableData.data"
      border
      highlight-current-row
      @fetch="fetchData"
    />
  </div>
</template>

<script>
  import { getList } from '@/api/table'
  import { parseTime } from '@/utils'

  export default {
    name: 'merge-header',
    data() {
      return {
        tableData: {
          column: [
            {
              type: 'index',
              align: 'center',
              label: 'ID',
              width: 60
            },
            {
              label: 'Main Information',
              align: 'center',
              children: [
                {
                  prop: 'title',
                  label: 'Title'
                // showOverflowTooltip: true,
                },
                {
                  prop: 'author',
                  label: 'Author',
                  align: 'center',
                  width: 110
                },
                {
                  prop: 'pageviews',
                  label: 'Pageviews',
                  align: 'center',
                  width: 110
                }
              ]
            },
            {
              label: 'Display_time',
              align: 'center',
              width: 200,
              render(h, scope) {
                return (
                <div>
                  <i class='el-icon-time' />
                  <span>{ scope.row.display_time }</span>
                </div>
              )
              }
            }
          ],
          data: []
        }
      }
    },
    methods: {
      async fetchData() {
        const res = await getList({ pageIndex: 1, pageSize: 20 })
        this.tableData.data = res.data.items
      },
      async handleDownload() {
        const excel = await import('@/vendor/Export2Excel')
        const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
        const header = ['', 'Title', 'Author', 'Readings', '']
        const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
        const list = this.tableData.data
        const data = this.formatJson(filterVal, list)
        const merges = ['A1:A2', 'B1:D1', 'E1:E2']
        excel.export_json_to_excel({
          multiHeader,
          header,
          merges,
          data
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
