/**
 *使用lb-table组件开启自定义列功能时，请为每一个lb-table组件设置一个唯一的tableKey属性（String类型）,
 *若未设置则默认以当前路由路径作为唯一值，这会在同一个页面内有多个lb-table组件时出现问题
 *当然若同一个页面内仅一个lb-table组件可以忽略
 */
<template>
  <div class="lb-table">
    <el-table
      v-if="showTable"
      ref="elTable"
      v-bind="$attrs"
      :class="{nowrap: !renderWrap}"
      :data="data"
      :span-method="merge ? mergeMethod : spanMethod"
      v-on="$listeners"
      @header-dragend="headerDragend"
    >
      <lb-column
        v-for="(item, index) in renderColumn"
        :key="index"
        v-bind="$attrs"
        :column="item"
      />
      <template slot="append">
        <slot name="append" />
      </template>
    </el-table>
    <el-pagination
      v-if="pagination"
      class="lb-table-pagination"
      v-bind="$attrs"
      :background="background"
      :page-size="renderPageSize"
      :current-page="renderCurrentPage"
      :style="{ 'margin-top': paginationTop, 'text-align': paginationAlign }"
      :layout="layout.includes('slot') ? layout : layout + ',slot' "
      v-on="$listeners"
      @update:pageSize="pageSizeChange"
      @update:currentPage="currentPageChange"
      @size-change="paginationSizeChange"
      @current-change="paginationCurrentChange"
    >
      <el-button icon="el-icon-refresh" size="mini" @click="refresh">刷新</el-button>
      <el-button v-if="customColumn" icon="el-icon-setting" size="mini" @click="openCustomColumn">自定义列</el-button>
    </el-pagination>
    <lb-custom-column ref="lbCustomColumn" :show-page-size-set="pagination && layout.includes('sizes')" :table-key="tableKey" @reset="reset" />
  </div>
</template>

<script>
  import LbColumn from './lb-column'
  import LbCustomColumn from './lb-custom-column'

  export default {
    name: 'lb-table',
    components: {
      LbColumn,
      LbCustomColumn
    },
    props: {
      column: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        required: true
      },
      spanMethod: Function,
      pagination: {
        type: Boolean,
        default: false
      },
      paginationTop: {
        type: String,
        default: '15px'
      },
      paginationAlign: {
        type: String,
        default: 'left'
      },
      layout: {
        type: String,
        default: 'prev, pager, next, sizes, jumper, ->, total'
      },
      wrap: {
        type: Boolean,
        default: false
      },
      background: {
        type: Boolean,
        default: true
      },
      tableKey: {
        type: String,
        default: ''
      },
      pageSize: {
        type: Number,
        default: 20
      },
      currentPage: {
        type: Number,
        default: 1
      },
      customColumn: {
        type: Boolean,
        default: false
      },
      immediateFetch: {
        type: Boolean,
        default: true
      },
      merge: Array
    },
    data() {
      return {
        showTable: true,
        mergeLine: {},
        mergeIndex: {},
        renderColumn: [],
        storeColumn: [],
        renderWrap: false,
        renderPageSize: 1,
        renderCurrentPage: 20
      }
    },
    computed: {
      dataLength() {
        return this.data.length
      }
    },
    watch: {
      merge() {
        this.getMergeArr(this.data, this.merge)
      },
      dataLength() {
        this.getMergeArr(this.data, this.merge)
      },
      column: {
        handler(val) {
          this.storeColumn = val.map((item, index) => ({ ...item, itemKey: index, show: true }))
          this.renderColumn = val
        },
        immediate: true
      },
      wrap: {
        handler(val) {
          this.renderWrap = val
        },
        immediate: true
      },
      pageSize: {
        handler(val) {
          this.renderPageSize = val
        },
        immediate: true
      },
      currentPage: {
        handler(val) {
          this.renderCurrentPage = val
        },
        immediate: true
      }
    },
    created() {
      this.getMergeArr(this.data, this.merge)
      this.setStoreSetting()
    },
    // fix: keep-alive后可以保证滚动条位置正确
    activated() {
      if (this.$refs.elTable.bodyWrapper && this.scrollTop) {
        this.$refs.elTable.bodyWrapper.scrollTop = this.scrollTop
      }
    },
    deactivated() {
      if (this.$refs.elTable.bodyWrapper) {
        this.scrollTop = this.$refs.elTable.bodyWrapper.scrollTop
      }
    },
    methods: {
      clearSelection() {
        this.$refs.elTable.clearSelection()
      },
      toggleRowSelection(row, selected) {
        this.$refs.elTable.toggleRowSelection(row, selected)
      },
      toggleAllSelection() {
        this.$refs.elTable.toggleAllSelection()
      },
      toggleRowExpansion(row, expanded) {
        this.$refs.elTable.toggleRowExpansion(row, expanded)
      },
      setCurrentRow(row) {
        this.$refs.elTable.setCurrentRow(row)
      },
      clearSort() {
        this.$refs.elTable.clearSort()
      },
      clearFilter(columnKey) {
        this.$refs.elTable.clearFilter(columnKey)
      },
      doLayout() {
        this.$refs.elTable.doLayout()
      },
      sort(prop, order) {
        this.$refs.elTable.sort(prop, order)
      },
      pageSizeChange(pageSize) {
        this.$emit('update:pageSize', pageSize)
      },
      currentPageChange(currentPage) {
        this.$emit('update:currentPage', currentPage)
      },
      getMergeArr(tableData, merge) {
        if (!merge) return
        this.mergeLine = {}
        this.mergeIndex = {}
        merge.forEach((item, k) => {
          tableData.forEach((data, i) => {
            if (i === 0) {
              this.mergeIndex[item] = this.mergeIndex[item] || []
              this.mergeIndex[item].push(1)
              this.mergeLine[item] = 0
            } else {
              if (data[item] === tableData[i - 1][item]) {
                this.mergeIndex[item][this.mergeLine[item]] += 1
                this.mergeIndex[item].push(0)
              } else {
                this.mergeIndex[item].push(1)
                this.mergeLine[item] = i
              }
            }
          })
        })
      },
      mergeMethod({ row, column, rowIndex, columnIndex }) {
        const index = this.merge.indexOf(column.property)
        if (index > -1) {
          const _row = this.mergeIndex[this.merge[index]][rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      paginationCurrentChange(currentPage) {
        this.$emit('p-current-change', currentPage)
        this.renderCurrentPage = currentPage
        this.fetch()
      },
      paginationSizeChange(pageSize) {
        this.$emit('size-change', pageSize)
        this.renderPageSize = pageSize
        this.renderCurrentPage = this.currentPage
        this.$emit('update:currentPage', this.currentPage)
        this.fetch()
      },
      headerDragend(...arg) {
        this.$emit('header-dragend', ...arg)
        this.hasDragend = true
      },
      refresh() {
        this.$emit('refresh', {
          pageSize: this.renderPageSize,
          currentPage: this.renderCurrentPage
        })
        this.fetch()
        if (this.hasDragend) {
          this.showTable = false
          this.$nextTick(() => {
            this.showTable = true
            this.hasDragend = false
          })
        }
      },
      async openCustomColumn() {
        const setting = await this.$refs.lbCustomColumn.open(this.storeColumn, this.renderWrap, this.renderPageSize)
        this.storeColumn = setting.column
        this.renderColumn = setting.column.filter(item => item.show)
        this.renderWrap = setting.wrap
        this.$nextTick(() => {
          this.doLayout()
        })
        if (setting.pageSize !== this.renderPageSize) {
          this.renderPageSize = setting.pageSize
          this.$emit('update:pageSize', setting.pageSize)
          this.$emit('size-change', setting.pageSize)
          this.fetch()
        }
        const key = this.$route.path + ':lb-table-' + this.tableKey
        const _column = setting.column.map(item => ({
          label: item.label || '',
          itemKey: item.itemKey,
          show: item.show
        }))
        setting.column = _column
        localStorage.setItem(key, JSON.stringify(setting))
      },
      reset() {
        this.storeColumn = this.column.map((item, index) => ({ ...item, itemKey: index, show: true }))
        this.renderColumn = this.column
        this.renderWrap = this.wrap
        if (this.renderPageSize !== this.pageSize) {
          this.renderPageSize = this.pageSize
          this.$emit('update:pageSize', this.pageSize)
          this.$emit('size-change', this.pageSize)
          this.fetch()
        }
        const key = this.$route.path + ':lb-table-' + this.tableKey
        localStorage.removeItem(key)
        this.$message('自定义列已重置为系统默认值')
      },
      getStoreSetting() {
        const key = this.$route.path + ':lb-table-' + this.tableKey
        const storeStr = localStorage.getItem(key)
        if (storeStr) {
          return JSON.parse(storeStr)
        } else {
          return null
        }
      },
      setStoreSetting() {
        const setting = this.getStoreSetting()
        if (this.customColumn && setting) {
          if (setting.pageSize) {
            this.renderPageSize = setting.pageSize
            this.$emit('update:pageSize', setting.pageSize)
            this.$emit('size-change', setting.pageSize)
          }
          if (setting.wrap) {
            this.renderWrap = setting.wrap
          }
          if (setting.column && setting.column.length === this.column.length) {
            const storeColumn = []
            setting.column.forEach(item => {
              const col = this.column[item.itemKey]
              storeColumn.push({
                ...col,
                show: item.show,
                itemKey: item.itemKey
              })
            })
            this.storeColumn = storeColumn
            this.renderColumn = storeColumn.filter(item => item.show)
          }
          if (setting.column && setting.column.length !== this.column.length) {
            console.warn('使用lb-table组件并开启自定义列功能（custom-column）时，请为每一个lb-table组件设置一个唯一的tableKey属性（String类型）,若未设置则默认以当前路由路径作为唯一值，这会在同一个页面内有多个lb-table组件时出现问题,当然若同一个页面内仅一个lb-table组件可以忽略')
          }
        }
        if (this.immediateFetch) {
          this.fetch()
        }
      },
      fetch({ pageSize, currentPage } = {}) {
        if (typeof currentPage !== 'undefined') {
          this.renderCurrentPage = currentPage
          this.$emit('update:currentPage', currentPage)
        }
        if (typeof pageSize !== 'undefined') {
          this.renderPageSize = pageSize
          this.$emit('update:pageSize', pageSize)
        }
        this.$emit('fetch', {
          pageSize: this.renderPageSize,
          currentPage: this.renderCurrentPage
        })
        // 滚动到头部
        if (this.$refs.elTable) this.$refs.elTable.bodyWrapper.scrollTop = 0
      }
    }
  }

</script>
<style lang="scss" scoped>
  .nowrap /deep/ .cell {
    white-space: nowrap !important;
  }
  .lb-table {
    overflow: hidden;
  }
  .lb-table-pagination {
    position: relative;
    display: inline-block;
    height: 30px;
    padding: 0;
    margin-top: 5px !important;
    box-sizing: border-box;
    & > * {
      display: inline-block;
      float: inherit;
    }
    & /deep/ .btn-prev {
      margin-left: 0;
    }
    & /deep/ .el-pagination__sizes {
      margin-right: 0;
    }
    & /deep/ .el-pagination__jump {
      margin-left: 5px;
    }
    & /deep/ .el-pagination__rightwrapper {
      float: right;
      margin-left: 10px;
      font-weight: normal;
      color: #606266;
      span {
        line-height: 31px;
      }
      .el-button {
        min-width: inherit;
        border: 1px solid #DCDFE6;
        span {
          line-height: inherit;
        }
      }
    }
  }
  .lb-table /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    color: #fff !important;
  }
</style>
<style lang="scss">
  // fix:使用此样式可以修复使用自适应高度指令（v-el-height-adaptive-table）后，表尾合计行无法显示bug
  .el-adaptive-table-show-summary {
    .el-table {
      height: unset !important;
      overflow: visible;
      .el-table__footer-wrapper {
        display: block !important;
      }
    }
  }
</style>
