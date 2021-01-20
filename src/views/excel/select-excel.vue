<template>
  <div class="app-page">
    <el-input v-model="filename" placeholder="请输入文件名 (默认 excel-list)" style="width: 350px;" prefix-icon="el-icon-document" />
    <el-button :loading="$loadingPlugin.handleDownload" style="margin-bottom: 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
      导出已选项
    </el-button>
    <a href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html" target="_blank" style="margin-left: 15px;">
      <el-tag type="info">文档</el-tag>
    </a>
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
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script>
  import { getList } from '@/api/table'

  export default {
    name: 'select-excel',
    data() {
      return {
        multipleSelection: [],
        filename: '',
        tableData: {
          column: [
            {
              type: 'selection',
              align: 'center'
            },
            {
              type: 'index',
              align: 'center',
              label: 'ID',
              width: 60
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
      async fetchData() {
        const res = await getList({ pageIndex: 1, pageSize: 20 })
        this.tableData.data = res.data.items
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      async handleDownload() {
        if (this.multipleSelection.length) {
          const excel = await import('@/vendor/Export2Excel')
          const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
          const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
          const list = this.multipleSelection
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          })
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message({
            message: '请至少选择一项',
            type: 'warning'
          })
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    }
  }
</script>
