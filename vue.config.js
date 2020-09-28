'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ThemeColorPlugin = require('./themeColor/themeColorPlugin')
const themeColor = require('./themeColor/index')
const apiMocker = require('webpack-api-mocker')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  // publicPath: 'https://fuphoenixes.github.io/example/dist/',
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        logLevel: 'debug', // 开启代理调试模式
        target: process.env.VUE_APP_PROXY_TARGET,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        },
        onProxyRes(proxyRes, req, res) {
          // 解决开发环境下登录过期无法自动跳转至登录页的问题，主要是后端通过重定向触发401，导致前端出现跨域的bug
          if (proxyRes.statusCode === 302 && proxyRes.headers.location === process.env.VUE_APP_PROXY_TARGET + '/') {
            res.send({
              status: 401
            })
          }
        }
      }
    },
    before(app) {
      apiMocker(app, path.resolve('./mock/index.js'))
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      new ThemeColorReplacer({
        fileName: 'static/css/theme-colors.[contenthash:8].css',
        matchColors: forElementUI.getElementUISeries(themeColor),
        changeSelector: forElementUI.changeSelector,
        // injectCss: false,
        isJsUgly: process.env.NODE_ENV !== 'development'
      })
    ]
  },
  transpileDependencies: ['@ckeditor/ckeditor5-vue', 'element-ui'],
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    config
      .plugin('theme-color-plugin')
      .use(ThemeColorPlugin)
      .before('sass-resources-loader')

    // global scss
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          resources: [resolve('themeColor/index.scss'), resolve('src/styles/variables.scss'), resolve('src/styles/mixin.scss')]
        })
        .end()
    })

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk({
            name: entryPoint => `manifest.${entryPoint.name}`
          })
          // gzip压缩
          config
            .plugin('compression-webpack-plugin')
            .use(CompressionWebpackPlugin, [{
              test: /\.js$|\.html$|\.css$/, // 匹配文件名
              threshold: 10240, // 对超过10k的数据压缩
              deleteOriginalAssets: false // 不删除源文件
            }])
        }
      )
  }
}
