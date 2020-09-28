/*
 * FileName: lb-column.vue
 * Remark: element-column
 * Project: lb-element-table
 * Author: LiuBing
 * File Created: Tuesday, 19th March 2019 9:58:23 am
 * Last Modified: Tuesday, 19th March 2019 10:14:42 am
 * Modified By: LiuBing
 */

<template>
  <el-table-column
    v-bind="$attrs"
    :prop="column.prop"
    :label="column.label"
    :type="column.type"
    :index="column.index"
    :column-key="column.columnKey"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="fixed"
    :render-header="column.renderHeader"
    :sortable="column.sortable || false"
    :sort-method="column.sortMethod"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :resizable="column.resizable || true"
    :formatter="column.formatter"
    :show-overflow-tooltip="column.showOverflowTooltip || false"
    :align="column.align || align || 'left'"
    :header-align="column.headerAlign || headerAlign || column.align || align || 'left'"
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :selectable="column.selectable"
    :reserve-selection="column.reserveSelection || false"
    :filters="column.filters"
    :filter-placement="column.filterPlacement"
    :filter-multiple="column.filterMultiple"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue"
    v-on="$listeners"
  >

    <template
      slot="header"
      slot-scope="scope"
    >
      <lb-render
        v-if="column.renderHeader"
        :scope="scope"
        :render="column.renderHeader"
      />
      <span v-else>{{ scope.column.label }}</span>
    </template>

    <template slot-scope="scope">
      <lb-render
        :scope="scope"
        :render="column.render"
      />
    </template>

    <template v-if="column.children">
      <lb-column
        v-for="(col, index) in column.children"
        :key="index"
        :column="col"
      />
    </template>
  </el-table-column>
</template>

<script>
  import LbRender from './lb-render'
  import forced from './forced.js'
  export default {
    name: 'lb-column',
    components: {
      LbRender
    },
    props: {
      column: Object,
      headerAlign: String,
      align: String
    },
    data() {
      return {
        fixed: false
      }
    },
    watch: {
      column: {
        handler() {
          this.setColumn()
        },
        immediate: true
      }
    },
    methods: {
      setColumn() {
        if (this.column.type) {
          this.column.renderHeader = forced[this.column.type].renderHeader
          this.column.render = this.column.render || forced[this.column.type].renderCell
        }
        if (this.column.formatter) {
          this.column.render = (h, scope) => {
            return <span>{ scope.column.formatter(scope.row, scope.column, scope.row, scope.$index) }</span>
          }
        }
        if (!this.column.render) {
          this.column.render = (h, scope) => {
            return <span>{ scope.row[scope.column.property] }</span>
          }
        }
        // fix: 解决由于表格宽度过宽，列又固定在右边，导致显示出现断层的bug
        if (this.column.fixed) {
          this.fixed = this.column.fixed
          if (this.column.fixed === 'right') {
            this.$nextTick(() => {
              const elTable = this.$parent
              const wrapperWidth = elTable.$el.offsetWidth
              const bodyWidth = elTable.bodyWidth.replace('px', '')
              if (bodyWidth < wrapperWidth) {
                this.fixed = false
              } else {
                this.fixed = 'right'
              }
            })
          }
        }
      }
    }
  }
</script>
