const dragFuc = (el, vnode) => {
  const dialogHeaderEl = el.querySelector('.el-dialog__header')
  const dragDom = el.querySelector('.el-dialog')
  dialogHeaderEl.style.cssText += ';cursor:move;'
  dragDom.style.cssText += ';top:0px;'

  // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
  const getStyle = (function() {
    if (window.document.currentStyle) {
      return (dom, attr) => dom.currentStyle[attr]
    } else {
      return (dom, attr) => getComputedStyle(dom, false)[attr]
    }
  })()

  dialogHeaderEl.onmousedown = (e) => {
    // 鼠标按下，计算当前元素距离可视区的距离
    const disX = e.clientX - dialogHeaderEl.offsetLeft
    const disY = e.clientY - dialogHeaderEl.offsetTop

    const dragDomWidth = dragDom.offsetWidth
    const dragDomHeight = dragDom.offsetHeight

    const screenWidth = document.body.clientWidth
    const screenHeight = document.body.clientHeight

    const minDragDomLeft = dragDom.offsetLeft
    const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

    const minDragDomTop = dragDom.offsetTop
    const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

    // 获取到的值带px 正则匹配替换
    let styL = getStyle(dragDom, 'left')
    let styT = getStyle(dragDom, 'top')

    if (styL.includes('%')) {
      styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
      styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
    } else {
      styL = +styL.replace(/\px/g, '')
      styT = +styT.replace(/\px/g, '')
    }

    document.onmousemove = function(e) {
      // 通过事件委托，计算移动的距离
      let left = e.clientX - disX
      let top = e.clientY - disY

      // 边界处理
      if (-(left) > minDragDomLeft) {
        left = -minDragDomLeft
      } else if (left > maxDragDomLeft) {
        left = maxDragDomLeft
      }

      if (-(top) > minDragDomTop) {
        top = -minDragDomTop
      } else if (top > maxDragDomTop) {
        top = maxDragDomTop
      }

      // 移动当前元素
      dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      el.setAttribute('drag_dom_position', `${left + styL}px;${top + styT}px`)
      // emit onDrag event
      vnode.child.$emit('dragDialog')
    }

    document.onmouseup = function(e) {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}

export default {
  bind(el, binding, vnode) {
    dragFuc(el, vnode)
    const { componentInstance: $dialog } = vnode
    // 兼容destroy-on-close模式
    if ($dialog.destroyOnClose) {
      $dialog.$watch('visible', function(val) {
        if (val) {
          $dialog.$nextTick(() => {
            dragFuc(el, vnode)
          })
        }
      })
      // fix：处理拖拽后关闭弹框的动画bug
      // let styleDom = null
      $dialog.$on('close', () => {
        const uid = vnode.componentInstance._uid
        el.setAttribute('drag_fix_uid', uid)
        const positionStr = el.getAttribute('drag_dom_position')
        if (!positionStr) return
        const position = positionStr.split(';')
        el.styleDom = document.createElement('style')
        el.styleDom.innerHTML = `.el-dialog__wrapper[drag_fix_uid="${uid}"] .el-dialog{left:${position[0]} !important;top:${position[1]}!important;}`
        el.appendChild(el.styleDom)
      })
      $dialog.$on('closed', () => {
        try {
          el.styleDom && el.removeChild(el.styleDom)
          // eslint-disable-next-line no-empty
        } catch (e) {}
        el.setAttribute('drag_dom_position', '')
      })
    } else {
      const dragDom = el.querySelector('.el-dialog')
      $dialog.$on('closed', () => {
        dragDom.style.left = '0'
        dragDom.style.top = '0'
      })
    }
  }
}
