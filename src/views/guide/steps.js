const getSteps = (driver) => [
  {
    element: '#breadcrumb-container',
    popover: {
      title: '面包屑',
      description: '指示当前页位置',
      position: 'bottom'
    }
  },
  {
    element: '#right-menu-set',
    popover: {
      title: '用户',
      description: '用户管理和个性设置',
      position: 'left',
      offset: 10
    },
    onNext: (t) => {
      driver.preventMove()
      t.node.click()
      // t.popover.node.style.display = 'none'
      setTimeout(() => {
        // t.popover.node.style.display = 'block'
        driver.moveNext()
      }, 300)
    }
  },
  {
    element: '#page-set',
    popover: {
      title: '页面设置',
      description: '布局和页面相关设置',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: '页签',
      description: '您访问的页面的历史记录',
      position: 'bottom',
      offset: 10
    },
    onPrevious: (t) => {
      driver.preventMove()

      // fix:解决点击其他元素关闭引导导致的bug
      driver.isActivated = false
      document.querySelector('#right-menu-set').click()
      driver.isActivated = true
      t.popover.node.style.display = 'none'
      setTimeout(() => {
        t.popover.node.style.display = 'block'
        driver.movePrevious()
      }, 300)
    }
  },
  {
    element: '#hamburger-container',
    popover: {
      title: 'Hamburger',
      description: '用来开关侧边栏',
      position: 'top',
      offset: 10
    }
  }
]

export default getSteps
