<template>
  <div class="app-page">
    <lb-table
      v-loading="$loadingPlugin.fetchData && tableData.pageIndex === 1"
      v-el-height-adaptive-table="{bottomOffset: 10}"
      v-el-table-infinite-scroll="fetchData"
      element-loading-text="加载中"
      :column="tableData.column"
      :data="tableData.data"
      border
      highlight-current-row
      infinite-scroll-disabled="disabled"
    >
      <template slot="append">
        <p v-if="!noMore" class="load-tip">加载中 <i class="el-icon-loading" /></p>
        <p v-else class="load-tip">没有更多数据了</p>
      </template>
    </lb-table>
  </div>
</template>

<script>
  import { getList } from '@/api/table'

  export default {
    name: 'table-infinite',
    data() {
      return {
        noMore: false,
        tableData: {
          pageIndex: 1,
          column: [
            {
              type: 'index',
              align: 'center',
              label: 'ID',
              width: 60
            // fixed: true,
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
    computed: {
      disabled() {
        return this.$loadingPlugin.fetchData || this.noMore
      }
    },
    created() {
    // this.fetchData();
    },
    methods: {
      async fetchData() {
        const res = await getList({
          pageIndex: this.tableData.pageIndex,
          pageSize: 20
        })
        if (this.tableData.pageIndex === 1) {
          this.tableData.data = res.data.items
        } else {
          this.tableData.data = this.tableData.data.concat(res.data.items)
        }
        if (res.data.items.length < 20) {
          this.noMore = true
        }
        this.tableData.pageIndex++
      }
    }

  }
</script>
<style lang="scss" scoped>
  .load-tip {
    height: 48px;
    font-size: 14px;
    line-height: 48px;
    text-align: center;
  }
</style>
