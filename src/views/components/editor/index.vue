<template>
  <div class="app-page">
    <div class="title">ckeditor-5</div>
    <fu-ck-editor v-model="content" :upload-img-hook="uploadImgHook" />
    <div style="margin-top: 20px;" v-html="content" />
  </div>
</template>

<script>
  import FuCkEditor from '@/components/FuCkEditor/index'
  export default {
    name: 'components-editor',
    components: {
      FuCkEditor
    },
    data() {
      return {
        content: ''
      }
    },
    watch: {
      content(val) {
        console.log(val)
      }
    },
    methods: {
      uploadImgHook(v) {
        console.log(v)
        return {
          default: ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
