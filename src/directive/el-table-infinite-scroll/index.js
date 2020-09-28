import elTableInfiniteScroll from './table-infinite-scroll'

const install = function(Vue) {
  Vue.directive('el-table-infinite-scroll', elTableInfiniteScroll)
}

if (window.Vue) {
  window['el-table-infinite-scroll'] = elTableInfiniteScroll
  Vue.use(install); // eslint-disable-line
}

elTableInfiniteScroll.install = install

export default elTableInfiniteScroll
