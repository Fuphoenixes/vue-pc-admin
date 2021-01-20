<template>
  <div class="app-page">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="文件名称">
        <el-input v-model="form.filename" placeholder="请输入文件名 (默认 excel-list)" style="width: 345px;" prefix-icon="el-icon-document" />
      </el-form-item>
      <el-form-item label="自适应列宽">
        <el-radio-group v-model="form.autoWidth">
          <el-radio :label="true" border>
            True
          </el-radio>
          <el-radio :label="false" border>
            False
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件类型">
        <el-select v-model="form.bookType" style="width: 120px;">
          <el-option label="xlsx" value="xlsx" />
          <el-option label="csv" value="csv" />
          <el-option label="txt" value="txt" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="$loadingPlugin.handleDownload" type="primary" icon="el-icon-document" @click="handleDownload">
          导出
        </el-button>
        <a href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html" target="_blank" style="margin-left: 15px;">
          <el-tag type="info">文档</el-tag>
        </a>
      </el-form-item>
    </el-form>
    <lb-table
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
    name: 'export-excel',
    data() {
      return {
        form: {
          filename: '',
          autoWidth: true,
          bookType: 'xlsx'
        },
        tableData: {
          column: [
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
      async handleDownload() {
        const excel = await import('@/vendor/Export2Excel')
        const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
        const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
        const list = this.tableData.data
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.form.filename,
          autoWidth: this.form.autoWidth,
          bookType: this.form.bookType
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
