/**
 * @description
 * element-ui 的表格，表面上看起来是一个表格，实际上是由两个表格组成的。
 * 表头为一个表格，表体又是个表格，这就导致了一个问题：打印和导出的时候表体和表头错位。
 * 在表格出现滚动条的时候，也会造成错位。
 * 如果el-column存在fixed属性时，导出时会出现两份数据的情况
 * 解决方案:
 * 将两个表格合成一个表格，
 * 可以先把表头所在的表格内容提取出来，插入到第二个表格里，
 * 从而将两个表格合并，这时候打印和导出就不会有错位的问题了
 * @param dom
 * @returns {Element}
 */
function getElementUITableDom(dom) {
  const div = document.createElement('div')
  div.innerHTML = dom.innerHTML
  const thead = div.querySelector('.el-table__header-wrapper thead')
  thead.style.background = '#F5F7FA'
  const table = div.querySelector('.el-table__body-wrapper table')
  table.insertAdjacentHTML('afterbegin', thead.outerHTML)
  // fix: 修复表尾合计行跨行的问题
  const footer = div.querySelector('.el-table__footer-wrapper tbody')
  Array.prototype.forEach.call(footer.querySelectorAll('td'), item => {
    item.rowSpan = '1'
  })
  table.querySelector('tbody').innerHTML += footer.innerHTML
  return table
}

export default getElementUITableDom
