import ElementUI from 'element-ui'
import { addClass, removeClass } from '@/utils/className'

/**
 * 为el-select组件增加loading样式
 */
ElementUI.Select.mixins.push({
  watch: {
    loading: {
      async handler(val, oldVal) {
        if (val === oldVal) return
        if (!this.$el) {
          await this.$nextTick()
        }
        if (val) {
          addClass(this.$el, 'el-select-loading')
        } else {
          removeClass(this.$el, 'el-select-loading')
        }
      },
      immediate: true
    }
  }
})

/**
 * 解决 element-ui 的 el-select 的下拉框宽度异常的bug
 * https://blog.csdn.net/Beam007/article/details/89712183
 */
ElementUI.Select.mixins.push({
  mounted() {
    this.$el.querySelector('input').addEventListener('focus', () => {
      const dropDown = this.$children.find(item => item.$options.name === 'ElSelectDropdown')
      if (!dropDown) return
      const dropDownEl = dropDown.$el
      dropDownEl.style.minWidth = this.$el.offsetWidth + 'px'
    })
  }
})
