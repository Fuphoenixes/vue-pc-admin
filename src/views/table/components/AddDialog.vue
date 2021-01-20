<template>
  <el-dialog :title="title" :visible.sync="visible" @closed="reset">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px;">
      <el-form-item label="Type" prop="type">
        <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="Date" prop="timestamp">
        <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
      </el-form-item>
      <el-form-item label="Title" prop="title">
        <el-input v-model="temp.title" />
      </el-form-item>
      <el-form-item label="Status">
        <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="Imp">
        <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top: 8px;" />
      </el-form-item>
      <el-form-item label="Remark">
        <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button :loading="$loadingPlugin.add || $loadingPlugin.edit" type="primary" @click="success">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { createArticle, updateArticle } from '@/api/article'
  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  export default {
    name: 'add-dialog',
    data() {
      return {
        visible: false,
        calendarTypeOptions,
        statusOptions: ['published', 'draft', 'deleted'],
        title: '添加',
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        }
      }
    },
    methods: {
      open(temp) {
        return new Promise(resolve => {
          this.resolve = resolve
          this.visible = true
          if (temp) {
            this.temp = temp
            this.title = '编辑'
          }
        })
      },
      async success() {
        const valid = await this.$refs.dataForm.validate()
        if (!valid) return
        if (this.title === '添加') {
          this.add()
        } else {
          this.edit()
        }
      },
      async add() {
        const tempData = Object.assign({}, this.temp)
        tempData.id = parseInt(Math.random() * 100) + 1024 // mock a id
        await createArticle(tempData)
        this.resolve(tempData)
        this.visible = false
        this.$notify({
          title: '提示',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      },
      async edit() {
        const tempData = Object.assign({}, this.temp)
        tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        await updateArticle(tempData)
        this.resolve(tempData)
        this.visible = false
        this.$notify({
          title: '提示',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      },
      reset() {
        this.title = '添加'
        this.$refs.dataForm.resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
