
<script>
  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

  export default {
    name: 'el-table-form',
    props: {
      maxCols: { // 大屏下一行最多显示几列,遵循24栅格布局
        type: Number,
        default: 6
      },
      defaultOpen: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        inline: true,
        open: this.defaultOpen,
        span: 6,
        cols: 4
      }
    },
    watch: {
      maxCols: {
        handler(val) {
          if (24 % val) {
            throw new Error('遵循24栅格布局，请保证maxCols能被24整除')
          }
          this.$nextTick(this.resize)
        },
        immediate: true
      }
    },
    mounted() {
      addResizeListener(this.$el, this.resize)
    // window.addEventListener('resize',this.resize)
    },
    beforeDestroy() {
      removeResizeListener(this.$el, this.resize)
    // window.removeEventListener('resize',this.resize)
    },
    methods: {
      resize() {
        const { maxCols } = this
        const width = this.$el.offsetWidth
        let cols
        if (width > 1400) {
          cols = maxCols
        } else if (width >= 996) {
          cols = maxCols < 4 ? maxCols : 4
        } else if (width >= 768) {
          cols = maxCols < 3 ? maxCols : 3
        } else if (width >= 660) {
          cols = maxCols < 2 ? maxCols : 2
        } else {
          cols = 1
        }
        this.cols = cols
        this.span = 24 / cols
      },
      // 支持el-from的方法
      validate(...arg) {
        this.$refs.elForm.resetFields(...arg)
      },
      validateField(...arg) {
        this.$refs.elForm.resetFields(...arg)
      },
      resetFields() {
        this.$refs.elForm.resetFields()
      },
      clearValidate() {
        this.$refs.elForm.clearValidate()
      }
    },
    render(h) {
      const childrens = this.$slots.default.filter(item => item.tag)
      const getMerge = (vnode) => {
        let merge = 1
        if (vnode.data && vnode.data.attrs && vnode.data.attrs['table-form-merge']) {
          merge = vnode.data.attrs['table-form-merge']
        }
        return merge ? Number(merge) : 1
      }
      let idx = 0
      const vnodes = childrens.map(item => {
        idx += getMerge(item)
        const newVnode = {
          ...item,
          span: getMerge(item) * this.span > 24 ? 24 : getMerge(item) * this.span,
          idx: idx
        }
        return newVnode
      })
      return (
      <div>
        <el-form ref='elForm' class='el-table-form' inline={this.inline} on={this.$listeners} attrs={this.$attrs}>
          <el-row type='flex'>
            {
              vnodes.map((item, index) => (
                <el-col class='item' key={index} span={item.span} v-show={this.open || item.idx < this.cols}>
                  {item}
                </el-col>
              ))
            }
            <el-col span={this.span}>
              <el-form-item class='right'>
                {this.$slots.btns}
                <el-link v-show={vnodes[vnodes.length - 1] && vnodes[vnodes.length - 1].idx >= this.cols} style='margin-left: 10px;' type='primary' underline={false} onClick={() => this.open = !this.open}>
                  {this.open ? '收起' : '展开'} <i class={this.open ? 'el-icon-arrow-up' : 'el-icon-arrow-down'}/>
                </el-link>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    )
    }
  }
</script>

<style lang="scss" scoped>
  .el-table-form {
    & /deep/ .el-row{
      flex-wrap: wrap;
    }
    .item /deep/ .el-form-item{
      display: flex;
      .el-form-item__label{
        flex-shrink: 0;
        &,&>label{
          color: #333;
          font-size: 14px;
          font-weight: normal;
        }
      }
      .el-form-item__content{
        flex: 1;
        &>*:not(.el-col){
          width: 100%;
        }
      }
    }
  }
  .right{

    & /deep/ .el-form-item__content{
      display: flex;
      .el-link{
        flex-shrink: 0;
      }
    }
  }
</style>
