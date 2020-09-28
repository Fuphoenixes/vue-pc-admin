const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)))

const downLoad = (href, filename) => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  a.href = href
  a.download = filename
  a.click()
  a.remove()
}

const table2Xls = ({ tableDom, worksheet, filename }) => {
  const uri = 'data:application/vnd.ms-excel;base64,'

  const tds = tableDom.getElementsByTagName('td')
  for (let i = 0; i < tds.length; i++) {
    let style = tds[i].style.cssText
    style += 'mso-number-format:\'\\@\''
    tds[i].setAttribute('style', style)
  }

  const template = `<html
                      xmlns:o="urn:schemas-microsoft-com:office:office"
                      xmlns:x="urn:schemas-microsoft-com:office:excel"
                      xmlns="http://www.w3.org/TR/REC-html40"
                    >
                      <head>
                        <meta charset="utf-8">
                        <!--[if gte mso 9]>
                          <xml>
                            <x:ExcelWorkbook>
                              <x:ExcelWorksheets>
                               <x:ExcelWorksheet>
                                  <x:Name>${worksheet}</x:Name>
                                  <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                  </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                              </x:ExcelWorksheets>
                            </x:ExcelWorkbook>
                          </xml>
                        <![endif]-->
                        </head>
                        <body>${tableDom.outerHTML}</body>
                      </html>`
  downLoad(uri + base64(template), filename + '.xls')
}

const table2Excel = ({ tableDom, worksheet, filename = '下载', bookType = 'xls' }) => {
  if (bookType === 'xls') {
    table2Xls({ tableDom, worksheet: worksheet || 'Sheet1', filename })
  } else if (bookType === 'csv') {
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(tableDom.outerHTML)
    downLoad(uri, filename + '.csv')
  } else if (bookType === 'txt') {
    const uri = 'data:text/plain;charset=utf-8,\ufeff' + encodeURIComponent(tableDom.outerHTML)
    downLoad(uri, filename + '.txt')
  }
  if (worksheet && bookType !== 'xlsx') {
    console.warn(bookType + '格式下载暂不支持设置worksheet')
  }
}

// 只支持简单的数据格式，不支持多级表头，跨行跨列的表格，如果需要可以考虑在页面内先写一个隐藏的table然后获取dom节点使用table2Excel导出
export const json2Excel = ({ header, data, worksheet, filename, bookType }) => {
  const headerHtml = `
  <thead>
    <tr>
      ${header.map(item => `<th>${item}</th>`).join('')}
    </tr>
  </thead>
  `
  const bodyHtml = `
  <tbody>
    ${
  data.map(tr => `
        <tr>
          ${tr.map(td => `<td>${td || ' '}</td>`).join('')}
        </tr>
      `).join('')
}
  </tbody>
  `
  const tableDom = document.createElement('table')
  tableDom.innerHTML = headerHtml + bodyHtml
  table2Excel({ tableDom, worksheet, filename, bookType })
}

export default table2Excel
