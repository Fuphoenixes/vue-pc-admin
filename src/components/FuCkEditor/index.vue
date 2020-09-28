<template>
  <div class="ckeditor">
    <ckeditor
      :editor="editor"
      @ready="onReady"
      :value="contentData"
      @input="onInput"
      :config="editorConfig"
    ></ckeditor>
  </div>
</template>

<script>
  import CKEditor from '@ckeditor/ckeditor5-vue';
  /*
  * (my-ckeditor5-build-classic)是参考文档自行配置的工具插件,官方默认是(@ckeditor/ckeditor5-build-classic)
  * https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/custom-builds.html#customizing-a-build
  * */
  import ClassicEditor from './my-ckeditor5-build-classic/ckeditor'
  import './my-ckeditor5-build-classic/translations/zh-cn' //中文包
  import styles from './ckeditor5-style'

  export default {
    name: "fu-ck-editor",
    components:{
      ckeditor: CKEditor.component
    },
    model: {
      prop: "content",
      event: "input"
    },
    props: {
      content: {
        required: true,
        type: String
      },
      uploadImgHook: {
        type: Function,
        default() {
          return () => {
            console.error("undefined uploadImg Hook")
          }
        }
      }
    },
    watch:{
      content:{
        handler(val){
          if(val !== this.styleContent){
            this.contentData = this.removeStyle(val)
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        editor: ClassicEditor,
        //contentData:this.content,
        editorConfig: {
          placeholder: '请输入',
          language: "zh-cn",
          fontSize: {
            options: [8, 10, 'default', 14, 16, 18, 20, 22, 24, 26, 28, 32, 48]
          },
          fontFamily: {
            options: ["宋体", "仿宋", "微软雅黑", "黑体", "仿宋_GB2312", "楷体", "隶书", "幼圆"]
          },
        },
        contentData: '',
        styleContent:''
      }
    },
    methods: {
      onReady(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = loader => {
          //let val = editor.getData();
          return {
            upload: async () => {
              return await loader.file.then(f => {
                const F = new FileReader();
                F.readAsArrayBuffer(f);
                return new Promise(resolve => {
                  F.onload = function () {
                    resolve({bufAsArray: F.result, file: f})
                  };
                })
              }).then(v => {
                //执行上传上传
                return this.uploadImgHook(v)
                //返回标准格式
                /*return {
                    default: 'http://mmcl.maoming.gov.cn/ys/css/img/BG.png'
                }*/
              });

            }
          }
        };
      },
      onInput(content){
        this.styleContent = this.addStyle(content);
        this.$emit('input',this.styleContent);
      },
      //ckeditor生成的html默认没有样式，需要自行添加
      addStyle(content){
        const classReg = (cls)=> new RegExp("<[^>]+ class=['\"]([\\s\\S]*?\\s)?" + cls + "[^'\"]*['\"][\\s\\S]*?");
        const tagReg = (tag)=> new RegExp("(<" + tag + "[\\s\\S]*?)((/>)|([\\s\\S]*?<\/" + tag + ">))");
        const styleTests = [
          { key: 'img', reg: tagReg('img'), style: styles.imageStyle },
          { key: 'code', reg: tagReg('code'), style: styles.codeStyle },
          { key: 'page-break', reg: classReg('page-break'), style: styles.pageBreakStyle },
          { key: 'blockquote', reg: tagReg('blockquote'), style: styles.blockquoteStyle },
          { key: 'media', reg: classReg('media'), style: styles.mediaStyle },
          { key: 'table', reg: tagReg('table'), style: styles.tableStyle },
          { key: 'hr', reg: tagReg('hr'), style: styles.hrStyle },
          { key: 'pre', reg: tagReg('pre'), style: styles.preStyle },
        ];
        const styleWrap = (item)=> `<style data-key="__STYLE_KEY_${item.key}" type="text/css">${item.style}</style>`;
        styleTests.forEach(item=>{
          //匹配对应标签和类名然后自动添加对应style
          if(item.reg.test(content) && !content.includes(`data-key="__STYLE_KEY_${item.key}"`)){
            content += styleWrap(item);
          }
        });
        if(!content.includes(`data-key="__STYLE_KEY_ck-content"`)){
          content = `<div data-key="__STYLE_KEY_ck-content" class="ck-content">${content}</div>`
        }
        return content;
      },
      //删除添加的style
      removeStyle(content){
        const styleReg = new RegExp("<style data-key=\"__STYLE_KEY_[\\s\\S]*?>[\\s\\S]*?<\/style>",'g');
        return content.replace(styleReg,'')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ckeditor{
    /*overflow: hidden;*/
    & /deep/ .ck.ck-content{
      min-height: 200px;
    }
    & /deep/ .ck-splitbutton{
      min-width: 50px;
    }
  }
</style>
