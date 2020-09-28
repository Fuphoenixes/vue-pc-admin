const fs = require('fs')
const path = require('path')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const themeColor = require('./index')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

const matchColors = forElementUI.getElementUISeries(themeColor)

const scssTemplate = `
// 本文件自动生成，请勿手动修改，如需修改请去./index.js和./themeColorPlugin.js文件中处理
// 主题色
$themeColor: ${themeColor};
/*
  主题色同色色系，序号0是当前颜色 1是当前色的rgb写法 2-12是浅色越大颜色越浅 13-14是比主题色更深的两种颜色
  切换主题色时，同色系颜色也会被对应的切换
*/
$themeColor-0: ${matchColors[0]};
$themeColor-1: rgb(${matchColors[1]});
$themeColor-2: ${matchColors[2]};
$themeColor-3: ${matchColors[3]};
$themeColor-4: ${matchColors[4]};
$themeColor-5: ${matchColors[5]};
$themeColor-6: ${matchColors[6]};
$themeColor-7: ${matchColors[7]};
$themeColor-8: ${matchColors[8]};
$themeColor-9: ${matchColors[9]};
$themeColor-10: ${matchColors[10]};
$themeColor-11: ${matchColors[11]};
$themeColor-12: ${matchColors[12]};
$themeColor-13: ${matchColors[13]};
$themeColor-14: ${matchColors[14]};
`

const writeThemeColorScssFile = (callback) => {
  const pathname = resolve('./index.scss')
  const write = () => {
    fs.writeFile(pathname, scssTemplate, 'utf8', function(error) {
      if (error) {
        console.log('主题文件生成失败:')
        throw new Error(error)
      }
      console.log('主题文件生成成功')
      callback()
    })
  }
  fs.readFile(pathname, function(error, data) {
    if (error) {
      if (error.code === 'ENOENT') {
        write()
        return
      }
      throw new Error(error)
    }
    if (data.toString() !== scssTemplate) {
      write()
    } else {
      callback()
    }
  })
}
function themeColorPlugin(options) {}

themeColorPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    writeThemeColorScssFile(callback)
  })
}

module.exports = themeColorPlugin
