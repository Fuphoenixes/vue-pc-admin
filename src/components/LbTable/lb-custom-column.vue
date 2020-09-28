<template>
  <el-dialog
    v-el-drag-dialog
    class="dialog"
    title="自定义列选择"
    width="326px"
    destroy-on-close
    :visible.sync="visible"
    @closed="close"
  >
    <el-table
      ref="dragTable"
      stripe
      size="mini"
      :data="tableData"
      row-key="itemKey"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" width="30" align="center" class-name="table-index" />
      <el-table-column type="selection" width="36" align="center" class-name="table-selection" />
      <el-table-column prop="label" label="列名" />
      <el-table-column label="移动" width="110" align="center" class-name="table-arrow">
        <template slot-scope="{row}">
          <i @click="up(row)"><svg-icon icon-class="up" /></i>
          <i @click="down(row)"><svg-icon icon-class="down" /></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="check">
      <el-checkbox v-model="wrap">列宽自动换行</el-checkbox>
      <div v-if="showPageSizeSet">
        <span>每页默认</span>
        <el-select v-model="pageSize" size="mini" style="width: 70px;">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <span>条记录</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="reset">重 置</el-button>
      <el-button type="primary" size="mini" @click="save">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Sortable from 'sortablejs'

  export default {
    props: ['showPageSizeSet'],
    data() {
      return {
        visible: false,
        tableData: null,
        multipleSelection: [],
        options: [10, 20, 30, 40, 50, 100],
        wrap: false,
        pageSize: undefined
      }
    },
    methods: {
      open(column, wrap, pageSize) {
        return new Promise(resolve => {
          this.resolve = resolve
          if (!column || column.length === 0) {
            resolve([])
            return
          }
          this.wrap = wrap
          this.pageSize = pageSize
          const _column = [...column]
          const typeCols = [] // 不需要排序的列
          const tableData = []
          _column.forEach((item, index) => {
            if (item.type || item.fixed || !item.label) {
              typeCols.push({ index, item })
            } else {
              tableData.push(item)
            }
          })
          this.typeCols = typeCols
          this.tableData = tableData
          this.visible = true
          this.$nextTick(() => {
            this.setSort()
            this.tableData.forEach(item => {
              this.$refs.dragTable.toggleRowSelection(item, item.show)
            })
          })
        })
      },
      setSort() {
        const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'lb-custom-colnum-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
            this.tableData.splice(evt.newIndex, 0, targetRow)
          }
        })
      },
      up(row) {
        const oldIndex = this.tableData.findIndex(item => item.itemKey === row.itemKey)
        if (oldIndex === 0) return
        const newIndex = oldIndex - 1
        const targetRow = this.tableData.splice(oldIndex, 1)[0]
        this.tableData.splice(newIndex, 0, targetRow)
      },
      down(row) {
        const oldIndex = this.tableData.findIndex(item => item.itemKey === row.itemKey)
        if (oldIndex === this.tableData.length - 1) return
        const newIndex = oldIndex + 1
        const targetRow = this.tableData.splice(oldIndex, 1)[0]
        this.tableData.splice(newIndex, 0, targetRow)
      },
      save() {
        const _column = this.tableData.map(item => {
          if (this.multipleSelection.some(it => it.itemKey === item.itemKey)) {
            return { ...item, show: true }
          } else {
            return { ...item, show: false }
          }
        })
        this.typeCols.forEach(item => {
          _column.splice(item.index, 0, item.item)
        })
        this.resolve && this.resolve({
          column: _column,
          wrap: this.wrap,
          pageSize: this.pageSize
        })
        this.visible = false
      },
      reset() {
        this.visible = false
        this.$emit('reset')
      },
      close() {
        this.tableData = []
        this.multipleSelection = []
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>
<style>
	.lb-custom-colnum-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
	}
</style>
<style lang="scss" scoped>
  .dialog {
    & /deep/ .table-index .cell{
      padding-right: 0;
      padding-left: 0;
    }
    & /deep/ .table-selection .cell{
      padding-left: 0;
    }
    & /deep/ td.table-arrow .cell {
      cursor: pointer;
      color: #999;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      i{
        display: inline-block;
        height: 32px;
        width: 30px;
        vertical-align: middle;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
      }
    }
    & /deep/ .el-table tr td{
      cursor: move;
    }
  }
	.el-icon-rank,.el-icon-top,.el-icon-bottom{
		font-size: 17px;
		cursor: pointer;
		font-weight: bold;
	}
	.el-icon-bottom{
		margin-left: 20px;
	}
	.footer-right{
		float: left;
		margin-top: 13px;
	}
	.dialog {
    & /deep/ .el-dialog__body{
			padding: 0 !important;
		}
    & /deep/ .el-table{
      border: none !important;
    }
	}
	.check{
		height: 40px;
		display: flex;
		align-items: center;
    justify-content: space-around;
	}
</style>
