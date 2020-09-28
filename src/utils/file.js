/**
 * 上传
 * @param multiple
 * @param accept
 * @returns {Promise<FileList | File>}
 */
export const importFile = (
  multiple = false,
  accept = '.xlsx,.xls'
) => new Promise(resolve => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = multiple
  input.accept = accept
  input.click()
  input.onchange = (e) => {
    if (multiple) resolve(e.target.files)
    else resolve(e.target.files[0])
    input.remove()
  }
})

/**
 * 下载
 * @param href
 * @param filename
 */
export const downLoad = (href, filename) => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  a.href = href
  a.download = filename
  a.click()
  a.remove()
}
