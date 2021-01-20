<template>
  <div class="app-page">
    <div class="editor-container">
      <el-tag class="tag-title">
        Basic:
      </el-tag>
      <markdown-editor v-model="content1" height="300px" />
    </div>

    <div class="editor-container">
      <el-tag class="tag-title">
        Markdown Mode:
      </el-tag>
      <markdown-editor ref="markdownEditor" v-model="content2" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="200px" />
    </div>

    <div class="editor-container">
      <el-tag class="tag-title">
        Customize Toolbar:
      </el-tag>
      <markdown-editor v-model="content3" :options="{ toolbarItems: ['heading','bold','italic']}" />
    </div>

    <el-button style="margin-top: 80px;" type="primary" icon="el-icon-document" @click="getHtml">
      Get HTML
    </el-button>
    <div v-html="html" />
  </div>
</template>

<script>
  import MarkdownEditor from '@/components/MarkdownEditor/index'

  const content = `
**This is test**

* vue
* element
* webpack

`
  export default {
    name: 'components-markdown',
    components: { MarkdownEditor },
    data() {
      return {
        content1: content,
        content2: content,
        content3: content,
        html: ''
      }
    },
    methods: {
      getHtml() {
        this.html = this.$refs.markdownEditor.getHtml()
        console.log(this.html, this.content1)
      }
    }
  }
</script>

<style scoped>
  .editor-container {
    margin-bottom: 30px;
  }
  .tag-title {
    margin-bottom: 5px;
  }
</style>
