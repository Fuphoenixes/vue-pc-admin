// import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import throttle from 'throttle-debounce/throttle'

/**
 * How to use
 * <el-table height="100px" v-el-height-adaptive-table="{bottomOffset: 10}">...</el-table>
 * bottomOffset: 10(default)   // The height of the table from the bottom of the page.
 */

const doResize = (el, binding, vnode) => {
  let { componentInstance: $table } = vnode
  const { value } = binding
  let bottomOffset = (value && Number(value.bottomOffset)) || 10

  // 添加支持lb-table
  if ($table.$refs.elTable) {
    if ($table.pagination) {
      bottomOffset += 35 // 分页组件高35px
    }
    $table = $table.$refs.elTable
  }

  if (!$table) return

  // fix: 适应各屏和最小高度下的计算
  const html = document.querySelector('html')
  const htmlScrollTop = html.scrollTop
  const htmlH = html.offsetHeight
  const elTop = el.getBoundingClientRect().top

  const height = htmlH - elTop - htmlScrollTop - bottomOffset

  if ($table.layout.height === height) return
  if (!$table.height) {
    setTimeout(() => {
      const headerElem = el.querySelector('.el-table__header-wrapper')
      const scrollBodyElem = el.querySelector('.el-table__body-wrapper')
      const scrollFixedElem = el.querySelector('.el-table__fixed-body-wrapper')
      const headerHeight = headerElem.offsetHeight
      scrollBodyElem.style.height = height - headerHeight + 'px'
      // 固定列滚动条高度bug处理
      if (scrollFixedElem) {
        scrollFixedElem.style.height = height - headerHeight + 'px'
        const tBody = scrollFixedElem.querySelector('tbody')
        const gutter = tBody.querySelector('.gutter')
        if (!gutter) {
          const tr = document.createElement('tr')
          tr.className = 'gutter'
          tr.style.height = '17px'
          tBody.appendChild(tr)
        }
      }
    }, 0)
  }
  $table.layout.setHeight && $table.layout.setHeight(height)
  $table.doLayout()
}

export default {
  bind(el, binding, vnode) {
    let flag = false
    // 给频繁的计算节流，最多每200ms计算一次，保证性能
    const throttleFn = throttle(200, () => {
      doResize(el, binding, vnode)
    })
    // fix: el渲染后才开始计算
    el.resizeListener = () => {
      if (!flag) {
        if (el.offsetHeight) {
          flag = true
          throttleFn()
        }
      } else {
        throttleFn()
      }
    }
  },
  inserted(el) {
    // 监听窗口大小变化时重新计算表格高度
    window.addEventListener('resize', el.resizeListener)
    // 监听app元素及子元素有任何class或style变化时重新计算表格高度
    const observerDom = document.getElementById('app')
    const options = { attributes: true, subtree: true, attributeFilter: ['class', 'style'] }
    el.mutationObserver = new MutationObserver(el.resizeListener)
    el.mutationObserver.observe(observerDom, options)
  },
  unbind(el) {
    // 取消监听
    window.removeEventListener('resize', el.resizeListener)
    el.mutationObserver.disconnect()
  }
}
