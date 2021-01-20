<template>
  <div class="app-page">
    <span>文件类型</span>
    <el-select v-model="bookType" style="width: 120px;">
      <el-option label="xls" value="xls" />
      <el-option label="csv" value="csv" />
      <el-option label="txt" value="txt" />
    </el-select>
    <!--<el-button :loading="$loadingPlugin.handleDownload" style="margin-bottom:20px" type="primary" icon="el-icon-document" @click="handleDownload">导出</el-button>-->
    <el-button style="margin-bottom: 20px;" type="primary" icon="el-icon-document" @click="downLoad">导出</el-button>
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
  import getElementUITableDom from '@/utils/getElementUITableDom'
  import table2Excel from '@/utils/table2Excel'

  export default {
    name: 'export-table',
    data() {
      return {
        bookType: 'xlsx',
        tableData: {
          column: [
            {
              type: 'index',
              align: 'center',
              label: 'ID',
              width: 60,
              fixed: true
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
              prop: 'display_time',
              width: 200
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
      // async handleDownload() {
      //   const excel = await import('@/vendor/Export2Excel');
      //   const tableDom = getElementUITableDom(this.$refs.multipleTable.$el);
      //   excel.export_table_to_excel({tableDom, filename: 'test',bookType: this.bookType})
      // },
      downLoad() {
        const tableDom = getElementUITableDom(this.$refs.multipleTable.$el)
        table2Excel({ tableDom, filename: '下载', bookType: this.bookType })
      }
    }
  }
</script>
