<template>
  <div class="app-page">
    <el-table-form :model="listQuery">
      <!--      太长占两列写法-->
      <el-form-item label="时间：" :table-form-merge="2">
        <label slot="label">时&emsp;&emsp;间：</label>
        <el-date-picker
          v-model="listQuery.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <!--      多个表单元素写法-->
      <!--      <el-form-item hidden-label="电话：" label-width="0" prop="title">-->
      <!--        <el-input-group>-->
      <!--          <el-form-item prop="importance" style="margin: 0;">-->
      <!--            <el-select v-model="listQuery.importance" placeholder="Imp" clearable>-->
      <!--              <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          <el-input v-model="listQuery.title" placeholder="title" clearable />-->
      <!--        </el-input-group>-->
      <!--      </el-form-item>-->
      <el-form-item label="标题：">
        <label slot="label">标&emsp;&emsp;题：</label>
        <el-input v-model="listQuery.title" placeholder="title" clearable />
      </el-form-item>
      <el-form-item label="重要性：">
        <label slot="label">重&ensp;要&ensp;性：</label>
        <el-select v-model="listQuery.importance" placeholder="Imp" clearable>
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <label slot="label">类&emsp;&emsp;型：</label>
        <el-select v-model="listQuery.type" placeholder="Type" clearable>
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <label slot="label">状&emsp;&emsp;态：</label>
        <el-select v-model="listQuery.status" placeholder="Type" clearable>
          <el-option v-for="item in statusOptions" :key="item.index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <label slot="label">排&emsp;&emsp;序：</label>
        <el-select v-model="listQuery.sort">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
      </el-form-item>
      <template v-slot:btns>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
        <el-button icon="el-icon-refresh">重置</el-button>
      </template>
    </el-table-form>
    <div style="margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-edit" @click="add">添加</el-button>
      <el-button type="primary" icon="el-icon-download" :loading="$loadingPlugin.exportOut" @click="exportOut">导出</el-button>
    </div>
    <lb-table
      ref="lbTable"
      v-loading="$loadingPlugin.fetchData"
      v-el-height-adaptive-table="{bottomOffset:10}"
      border
      stripe
      element-loading-text="加载中"
      :column="tableData.column"
      :data="tableData.data"
      highlight-current-row
      pagination
      :total="tableData.total"
      custom-column
      table-key="table-complex"
      @fetch="fetchData"
      @sort-change="sortChange"
    />
    <add-dialog ref="AddDialog" />
  </div>
</template>

<script>
  import { fetchList } from '@/api/article'
  import { parseTime } from '@/utils'
  import { json2Excel } from '@/utils/table2Excel'
  import AddDialog from './components/AddDialog'
  // import HighLevelSearchForm from '@/components/HighLevelSearchForm'

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]
  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})
  const typeFilter = (type) => {
    return calendarTypeKeyValue[type]
  }

  export default {
    name: 'table-complex',
    components: {
      AddDialog
    // HighLevelSearchForm
    },
    data() {
      return {
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        listQuery: {
          date: '',
          importance: undefined,
          title: undefined,
          type: undefined,
          status: undefined,
          sort: '+id'
        },
        tableData: {
          total: 0,
          column: [
            {
              align: 'center',
              prop: 'id',
              label: 'ID',
              width: 60,
              sortable: 'custom'
            },
            {
              label: 'Date',
              width: 150,
              render(h, scope) {
                return <span>{ parseTime(scope.row.timestamp, '{y}-{m}-{d} {h}:{i}') }</span>
              }
            },
            {
              label: 'Title',
              minWidth: 110,
              render(h, { row }) {
                return (
                <div style='display: inline;'>
                  <span class='link-type' >{ row.title }</span>
                  {/* <el-tag>{ typeFilter(row.type) }</el-tag>*/}
                </div>
              )
              }
            },
            {
              prop: 'author',
              label: 'Author',
              align: 'center',
              width: 110
            },
            {
              prop: 'reviewer',
              label: 'Reviewer',
              align: 'center',
              width: 110
            },
            {
              label: '重要性',
              width: 80,
              render(h, { row }) {
                return [...new Array(row.importance).keys()].map(n => <svg-icon key={n} icon-class='star' class='meta-item__icon' />)
              }
            },
            {
              label: 'Readings',
              align: 'center',
              width: 95,
              render(h, { row }) {
                return row.pageviews ? <span class='link-type'>{ row.pageviews }</span> : <span>0</span>
              }
            },
            {
              label: 'Status',
              align: 'center',
              width: 110,
              className: 'status-col',
              render(h, scope) {
                const statusMap = {
                  published: 'success',
                  draft: 'info',
                  deleted: 'danger'
                }
                return <el-tag type={statusMap[scope.row.status]}>{ scope.row.status }</el-tag>
              }
            },
            {
              label: '操作',
              align: 'center',
              fixed: 'right',
              width: 180,
              render: (h, { row, $index }) => {
                return (
                <div>
                  <el-button type='primary' size='mini' onClick={() => this.update(row, $index)}>
                      编辑
                  </el-button>
                  <el-button size='mini' type='danger' onClick={() => this.del(row, $index)}>
                      删除
                  </el-button>
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
        const res = await fetchList({
          ...this.listQuery,
          pageSize,
          pageIndex: currentPage
        })
        this.tableData.data = res.data.items
        this.tableData.total = res.data.total
      },
      search() {
        this.$refs.lbTable.fetch({ currentPage: 1 })
      },
      sortChange({ prop, order }) {
        if (prop === 'id') {
          this.listQuery.sort = order === 'ascending' ? '+id' : '-id'
          this.search()
        }
      },
      async add() {
        const temp = await this.$refs.AddDialog.open()
        this.tableData.data.unshift(temp)
      },
      async update(row, index) {
        const temp = await this.$refs.AddDialog.open({ ...row })
        this.tableData.data.splice(index, 1, temp)
      },
      del(row, index) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.tableData.data.splice(index, 1)
      },
      async exportOut() {
        console.log(11)
        const res = await fetchList({
          ...this.listQuery,
          pageSize: this.tableData.total,
          pageIndex: 1
        })
        const header = ['ID', 'Date', 'Title', 'Author', 'Reviewer', '重要性', 'Readings', 'Status']
        const filterVal = ['id', 'timestamp', 'title', 'author', 'reviewer', 'importance', 'pageviews', 'status']
        const jsonData = res.data.items
        const data = this.formatJson(filterVal, jsonData)
        json2Excel({ header, data, filname: '下载' })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else if (j === 'title') {
            return v[j] + '  ' + typeFilter(v.type)
          } else if (j === 'importance') {
            return [...new Array(v.importance).keys()].map(n => '★').join(' ')
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
