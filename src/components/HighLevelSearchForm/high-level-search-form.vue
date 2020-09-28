
<script>
  import Transfer from './components/transfer'
  import Sortable from 'sortablejs'

  const getLabel = (vnode) => {
    const label = vnode.data.attrs['hidden-label'] || vnode.componentOptions.propsData.label || ''
    if (!label) {
      throw new Error('使用high-level-search-form组件时子组件el-form-item必须设置唯一的label获者hidden-label属性，用于“高级查询=>自定义查询”中的列名展示')
    }
    return label.replace(/[:|：]$/, '')
  }

  const getKey = (vnode, childrens) => {
    return '' + getLabel(vnode) + childrens.findIndex(item => item === vnode)
  }

  const getTransferData = (vnodes, childrens) => {
    return vnodes.map(item => {
      return {
        label: getLabel(item),
        key: getKey(item, childrens)
      }
    })
  }
  const getTransferValue = (vnodes, childrens) => {
    return vnodes.map(item => {
      return getKey(item, childrens)
    })
  }

  export default {
    name: 'high-level-search-form',
    components: {
      [Transfer.name]: Transfer
    },
    props: {
      baseMaxNum: {
        type: Number,
        default: 3
      },
      size: String,
      formKey: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogFormVisible: true,
        dialogTransferVisible: false,
        transValue: [],
        extendValue: [],
        transData: [],
        baseData: [],
        extendData: [],
        leftChecked: [],
        rightChecked: []
      }
    },
    computed: {
      disableLeft() {
        return this.transValue.length <= 1 || this.transValue.length - this.rightChecked.length < 1
      },
      disableRight() {
        return this.transValue.length >= this.baseMaxNum || this.transValue.length + this.leftChecked.length > this.baseMaxNum
      }
    },
    watch: {
      '$slots.default': {
        handler() {
          this.setData()
          this.setStoreSetting()
        },
        immediate: true
      }
    },
    created() {
      this.hiddenDialog()
    },
    methods: {
      hiddenDialog() {
        // fix: 解决两个el-form公用一份数据时的bug
        const dialogBg = document.querySelector('.v-modal')
        if (!dialogBg) {
          const style = document.createElement('style')
          style.innerHTML = '.v-modal{display: none;}'
          document.body.appendChild(style)
          this.$nextTick(() => {
            this.dialogFormVisible = false
            setTimeout(() => {
              document.body.removeChild(style)
            }, 300)
          })
        } else {
          this.$nextTick(() => {
            this.dialogFormVisible = false
          })
        }
      },
      setData() {
        const childrens = this.$slots.default.filter(item => item.componentOptions && item.componentOptions.tag === 'el-form-item')
        const baseVNodes = childrens.filter((item, index) => index < this.baseMaxNum)
        const extendVNodes = childrens.filter((item, index) => index >= this.baseMaxNum)
        this.transValue = getTransferValue(baseVNodes, childrens)
        this.extendValue = getTransferValue(extendVNodes, childrens)
        this.baseData = [...this.transValue]
        this.extendData = [...this.extendValue]
        this.transData = getTransferData(childrens, childrens)
      },
      transferChange(val) {
        if (val.length > this.baseMaxNum) {
          this.$message(`基础查询项最多不超过${this.baseMaxNum}项`)
          return
        }
        if (val.length === 0) {
          this.$message(`基础查询项至少有1项`)
          return
        }
        this.transValue = val
        this.$nextTick(() => {
          this.extendValue = this.$refs.elTransfer.sourceData.map(item => item.key)
          this.setSort()
        })
      },
      /*
       * 真的要吐槽下，这个排序功能真的难啊
       * 首先是el-transfer组件的renderFunc渲染的内容在checkbox里导致点击上下箭头自动选择了这个checkbox，因为在label标签内导致阻止事件冒泡失败，为了解决这个问题，改了el-transfer的源码.....(此处省略无数字)
       * 其次你会发现左右穿梭和上下换位置本就冲突，el-transfer在渲染的时候使用的是sourceData和targetData保存左右两边的数据，然而这两数据是computed获得的，无法直接更改
       * 为了解决这个问题，最终在本组件里保存了一份左右两边的数据，每次更改后更新整个data，来保证顺序变化一致
       * ps:el-transfer的样式还和UI图差距较大，hack了一堆办法才勉强保证一致
       * */
      up({ key }) {
        const { sourceData, targetData } = this.$refs.elTransfer
        const sourceIndex = sourceData.findIndex(item => item.key === key)
        const targetIndex = targetData.findIndex(item => item.key === key)
        if (sourceIndex !== -1) {
          if (sourceIndex === 0) return
          const newIndex = sourceIndex - 1
          const targetRow = sourceData.splice(sourceIndex, 1)[0]
          sourceData.splice(newIndex, 0, targetRow)
          this.extendValue = sourceData.map(item => item.key)
          this.resetTransferData()
        }
        if (targetIndex !== -1) {
          if (targetIndex === 0) return
          const newIndex = targetIndex - 1
          const targetRow = targetData.splice(targetIndex, 1)[0]
          targetData.splice(newIndex, 0, targetRow)
          this.transValue = targetData.map(item => item.key)
          this.resetTransferData()
        }
      },
      down({ key }) {
        const { sourceData, targetData } = this.$refs.elTransfer
        const sourceIndex = sourceData.findIndex(item => item.key === key)
        const targetIndex = targetData.findIndex(item => item.key === key)
        if (sourceIndex !== -1) {
          if (sourceIndex === sourceData.length - 1) return
          const newIndex = sourceIndex + 1
          const targetRow = sourceData.splice(sourceIndex, 1)[0]
          sourceData.splice(newIndex, 0, targetRow)
          this.extendValue = sourceData.map(item => item.key)
          this.resetTransferData()
        }
        if (targetIndex !== -1) {
          if (targetIndex === targetIndex.length - 1) return
          const newIndex = targetIndex + 1
          const targetRow = targetData.splice(targetIndex, 1)[0]
          targetData.splice(newIndex, 0, targetRow)
          this.transValue = targetData.map(item => item.key)
          this.resetTransferData()
        }
      },
      resetTransferData() {
        const list = this.transValue.concat(this.extendValue)
        const transData = []
        list.forEach(key => {
          const item = this.transData.find(it => it.key === key)
          if (item) {
            transData.push(item)
          }
        })
        this.transData = transData
      },
      setSort() {
        if (this.sortableLeft) this.sortableLeft.destroy()
        if (this.sortableRight) this.sortableRight.destroy()
        const leftEl = this.$refs.elTransfer.$el.querySelectorAll('.el-transfer-panel__list')[0]
        const rightEl = this.$refs.elTransfer.$el.querySelectorAll('.el-transfer-panel__list')[1]
        this.sortableLeft = this.sortable(leftEl, 'extendValue')
        this.sortableRight = this.sortable(rightEl, 'transValue')
      },
      sortable(el, listKey) {
        return Sortable.create(el, {
          ghostClass: 'el-table-form-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const targetRow = this[listKey].splice(evt.oldIndex, 1)[0]
            this[listKey].splice(evt.newIndex, 0, targetRow)
          }
        })
      },
      setStoreSetting() {
        const key = this.$route.path + ':high-level-search-form-' + this.formKey
        const saveStr = localStorage.getItem(key)
        if (saveStr) {
          const saveObj = JSON.parse(saveStr)
          if (
            saveObj.baseData.every(it => this.transData.some(item => item.key === it)) &&
            saveObj.extendData.every(it => this.transData.some(item => item.key === it))
          ) {
            this.baseData = saveObj.baseData
            this.extendData = saveObj.extendData
          }
        }
      },
      transSave() {
        this.baseData = [...this.transValue]
        this.extendData = [...this.extendValue]
        this.dialogTransferVisible = false
        const saveObj = { baseData: this.baseData, extendData: this.extendData }
        const key = this.$route.path + ':high-level-search-form-' + this.formKey
        localStorage.setItem(key, JSON.stringify(saveObj))
      },
      transReset() {
        this.setData()
        this.dialogTransferVisible = false
      },
      openTransferDialog() {
        this.transValue = [...this.baseData]
        this.extendValue = [...this.extendData]
        this.resetTransferData()
        this.dialogTransferVisible = true
        this.$nextTick(() => {
          this.setSort()
        })
      },
      // 支持el-from的方法
      validate(...arg) {
        this.$refs.dialogElForm.resetFields(...arg)
      },
      validateField(...arg) {
        this.$refs.dialogElForm.resetFields(...arg)
      },
      resetFields() {
        this.$refs.dialogElForm.resetFields()
      },
      clearValidate() {
        this.$refs.dialogElForm.clearValidate()
      },
      formReset() {
        this.resetFields()
        this.$emit('reset')
      },
      formSearch() {
        this.$emit('search')
        this.dialogFormVisible = false
      }
    },
    render(h) {
      const childrens = this.$slots.default.filter(item => item.componentOptions && item.componentOptions.tag === 'el-form-item')
      const baseVNodes = []
      const extendVNodes = []

      this.baseData.forEach(item => {
        const vnode = childrens.find(it => {
          return item === getKey(it, childrens)
        })
        if (vnode) baseVNodes.push(vnode)
      })

      this.extendData.forEach(item => {
        const vnode = childrens.find(it => {
          return item === getKey(it, childrens)
        })
        if (vnode) extendVNodes.push(vnode)
      })

      const renderTransferTit = (
      <div class='transfer-tit'>
        <span>列名</span>
        <span>操作</span>
      </div>
    )

      const renderFunc = (h, option) => {
        return (
        <div class='transfer-tit'>
          <span>{option.label}</span>
          <span>
            <i onClick={() => this.up(option)}><svg-icon icon-class='up'/></i>
            <i onClick={() => this.down(option)}><svg-icon icon-class='down'/></i>
          </span>
        </div>
      )
      }

      return (
      <div class='high-level-search-form'>
        <el-form
          ref='elForm'
          class='table-form'
          size={this.size}
          inline={true}
          on={this.$listeners}
          attrs={this.$attrs}
        >
          {
            baseVNodes.map(item => item)
          }
          <el-form-item className='right'>
            {
              this.$slots.btns ||
              (
                <span>
                  <el-button size={this.size} icon='el-icon-search' type='primary' onClick={this.formSearch}>查 询</el-button>
                  <el-button size={this.size} icon='el-icon-refresh' onClick={this.formReset}>重 置</el-button>
                </span>
              )
            }
            <el-link class='link' type='primary' underline={false} onClick={() => this.dialogFormVisible = true }>
              高级查询 >>
            </el-link>
          </el-form-item>
        </el-form>
        <el-dialog
          v-el-drag-dialog
          width='800px'
          class='advanced-query-dialog'
          style='display: none;'
          title='高级查询'
          visible={this.dialogFormVisible}
          on={{ 'update:visible': val => this.dialogFormVisible = val }}
        >
          <el-form
            ref='dialogElForm'
            size={this.size}
            inline={true}
            label-width='78px'
            on={this.$listeners}
            attrs={this.$attrs}
          >
            <div>
              <div class='query-title'>基础查询条件</div>
              {
                baseVNodes.map(item => item)
              }
            </div>
            <div>
              <div class='query-title'>扩展查询条件</div>
              {
                extendVNodes.map(item => item)
              }
            </div>
          </el-form>
          <div slot='footer'>
            <el-button style='float:left; margin-top: 8px;' size={this.size} icon='el-icon-set-up' onClick={this.openTransferDialog}>自定义查询项</el-button>
            <el-button style='margin-right:10px;' size={this.size} icon='el-icon-close' onClick={() => this.dialogFormVisible = false}>关 闭</el-button>
            {
              (this.$slots.btns && this.$slot.btns.reverse()) ||
              (
                <span>
                  <el-button size={this.size} icon='el-icon-refresh' onClick={this.formReset}>重 置</el-button>
                  <el-button size={this.size} icon='el-icon-search' type='primary' onClick={this.formSearch}>查 询</el-button>
                </span>
              )
            }
          </div>
        </el-dialog>
        <el-dialog
          v-el-drag-dialog
          class='transfer-dialog'
          width='640px'
          title='自定义查询项'
          destroy-on-close
          visible={this.dialogTransferVisible}
          on={{ 'update:visible': val => this.dialogTransferVisible = val }}
        >
          <div class='transfer-title-wrapper'>
            <div class='query-title'>扩展查询条件</div>
            <div class='query-title'>基础查询条件</div>
          </div>
          <el-transfer
            ref='elTransfer'
            class={{
              'disable-left-btn': this.disableLeft,
              'disable-right-btn': this.disableRight
            }}
            value={this.transValue}
            onChange={this.transferChange}
            onLeft-check-change={val => this.leftChecked = val}
            onRight-check-change={val => this.rightChecked = val}
            data={this.transData}
            titles={[' ', ' ']}
            scopedSlots={{
              'left-footer': () => renderTransferTit,
              'right-footer': () => renderTransferTit
            }}
            render-content={renderFunc}
          />
          <div slot='footer'>
            <el-button size={this.size} icon='el-icon-close' onClick={() => this.dialogTransferVisible = false}>关 闭</el-button>
            <el-button size={this.size} icon='el-icon-refresh' onClick={this.transReset}>重 置</el-button>
            <el-button size={this.size} icon='el-icon-check' type='primary' onClick={this.transSave}>保 存</el-button>
          </div>
        </el-dialog>
      </div>
    )
    }
  }
</script>

<style lang="scss" scoped>
.high-level-search-form{
  & /deep/ .el-form-item__label{
    padding-right: 6px;
    &,&>label{
      color: #333;
      font-size: 14px;
      font-weight: normal;
    }
    &>.el-form-item{
      margin-right: 0;
      margin-bottom: 0 !important;
    }
  }
  .table-form /deep/ .el-form-item{
    margin-bottom: 8px;
  }
  .table-form .link {
    margin-left: 10px;
    color: $themeColor;
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
.advanced-query-dialog{
  & /deep/.el-form {
    &>div:first-child{
      margin-bottom: 10px;
    }
    .el-form-item{
      margin-bottom: 13px;
      .el-input{
        max-width: 140px;
      }
    }
  }
}
.query-title{
  padding-left: 18px;
  position: relative;
  font-size: 16px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 16px;
  &:before{
    content: '';
    width: 4px;
    height: 20px;
    background: $themeColor;
    position: absolute;
    top: -2px;
    left: 0;
  }
}
.transfer-dialog{
  .transfer-title-wrapper{
    height: 20px;
    margin-bottom: 18px;
    position: relative;
    .query-title{
      position: absolute;
      top: 0;
      left: 34px;
      &:nth-of-type(2){
        left: 346px;
      }
    }
  }
  & /deep/.el-transfer{
    text-align: center;
    .el-transfer-panel{
      text-align: left;
      .el-transfer-panel__header .el-checkbox__label>span{
        position: relative;
        right: 0;
        font-size: 14px;
        &:before{
          content: '已选';
        }
        &:after{
          content: '条';
        }
      }
    }
    .el-transfer__buttons{
      .el-button{
        display: block;
        width: 24px;
        height: 24px;
        padding: 0;
        margin: 0;
        &:nth-of-type(1){
          margin-bottom: 10px;
        }
      }
    }
    .el-transfer-panel{
      width: 220px;
      height: 380px;
      position: relative;
      .el-transfer-panel__header{
        background: #fff;
      }
      .el-transfer-panel__footer{
        height: 32px;
        position: absolute;
        top: 40px;
        &:after{
          height: 0;
        }
        .transfer-tit{
          height: 32px;
          line-height: 32px;
          background: #E5E7F2;
          font-size: 14px;
          span:nth-of-type(1){
            margin-left: 49px;
          }
          span:nth-of-type(2){
            margin-left: 90px;
          }
        }
      }
      .el-transfer-panel__body{
        margin-top: 32px;
        .el-checkbox.el-transfer-panel__item{
          margin-right: 0;
        }
        .transfer-tit{
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          span:nth-of-type(1){
            display: inline-block;
            width: 110px;
            padding-left: 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            cursor: move;
          }
          span:nth-of-type(2){
            display: inline-block;
            width: 60px;
            text-align: center;
            i{
              display: inline-block;
              height: 32px;
              width: 30px;
              vertical-align: middle;
              text-align: center;
              line-height: 32px;
              cursor: pointer;
              color: #999;
            }
          }
        }
        .el-checkbox__label{
          .transfer-tit{
            display: none;
          }
        }
        .el-transfer-panel__item__fix{
          &:hover {
            background: #E6F7FF;
          }
          display: flex;
          align-items: center;
          justify-content: space-between;
          .el-transfer-panel__item__fix__option{
            width: 100%;
            display: flex;
          }
        }
      }
    }
  }
  .disable-left-btn /deep/ .el-transfer__buttons>button:first-child ,
  .disable-right-btn /deep/ .el-transfer__buttons>button:last-child {
    color: #FFF;
    background-color: #a0cfff;
    border-color: #a0cfff;
    cursor: not-allowed;
    background-image: none;
  }
}
</style>
<style>
  .el-table-form-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
</style>
