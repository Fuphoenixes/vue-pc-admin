<template>
  <div class="app-page">
    <lb-table
      v-loading="$loadingPlugin.fetchData"
      v-el-height-adaptive-table="{bottomOffset: 10}"
      element-loading-text="加载中"
      :column="tableData.column"
      :data="tableData.data"
      border
      highlight-current-row
      pagination
      :total="tableData.total"
      custom-column
      table-key="example-table"
      @fetch="fetchData"
    />
  </div>
</template>

<script>
  import { getList } from '@/api/table'

  export default {
    name: 'table-pagination',
    data() {
      return {
        tableData: {
          total: 0,
          column: [
            {
              type: 'index',
              align: 'center',
              label: 'ID',
              width: 60,
              fixed: true
            },
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
            },
            {
              label: 'Status',
              align: 'center',
              width: 110,
              className: 'status-col',
              render(h, scope) {
                const statusMap = {
                  published: 'success',
                  draft: 'gray',
                  deleted: 'danger'
                }
                return <el-tag type={statusMap[scope.row.status]}>{ scope.row.status }</el-tag>
              }
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
      async fetchData({ pageSize, currentPage }) {
        console.log(pageSize)
        const res = await getList({
          pageIndex: currentPage,
          pageSize
        })
        this.tableData.data = res.data.items
        this.tableData.total = res.data.total
      }
    }
  }
</script>
