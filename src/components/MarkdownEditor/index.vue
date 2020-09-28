<template>
  <editor ref="editor" :initial-value="value" :initial-edit-type="mode" :options="options" :height="height" />
</template>

<script>
  import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
  import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
  import { Editor } from '@toast-ui/vue-editor'
  import defaultOptions from './default-options'

  export default {
    name: 'markdown-editor',
    components: {
      editor: Editor
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        default() {
          return defaultOptions
        }
      },
      mode: {
        type: String,
        default: 'markdown'
      },
      height: {
        type: String,
        required: false,
        default: '300px'
      }
    },
    methods: {
      setHtml(value) {
        this.$refs.editor.invoke('setHtml')
      },
      getHtml() {
        return this.$refs.editor.invoke('getHtml')
      }
    }
  }
</script>
