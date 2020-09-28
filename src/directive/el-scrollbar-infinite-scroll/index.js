import elScrollbarInfiniteScroll from './scrollbar-infinite-scroll'

const install = function(Vue) {
  Vue.directive('el-scrollbar-infinite-scroll', elScrollbarInfiniteScroll)
}

if (window.Vue) {
  window['el-scrollbar-infinite-scroll'] = elScrollbarInfiniteScroll
  Vue.use(install); // eslint-disable-line
}

elScrollbarInfiniteScroll.install = install

export default elScrollbarInfiniteScroll
