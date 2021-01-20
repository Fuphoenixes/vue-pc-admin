<template>
  <div class="app-page">
    <el-alert
      title="暂不支持导入存在合并行或列的 excel !!!"
      type="info"
      :closable="false"
      style="margin-bottom: 20px;"
    />
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%; margin-top: 20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'

  export default {
    name: 'upload-excel',
    components: { UploadExcelComponent },
    data() {
      return {
        tableData: [],
        tableHeader: []
      }
    },
    methods: {
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1

        if (isLt1M) {
          return true
        }

        this.$message({
          message: '请不要上传文件大小不要超过1M',
          type: 'warning'
        })
        return false
      },
      handleSuccess({ results, header }) {
        this.tableData = results
        this.tableHeader = header
      }
    }
  }
</script>
