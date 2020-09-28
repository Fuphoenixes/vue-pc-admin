# CBB 前端模块

[TOC]



## 介绍

> 这是一个基于 vue 管理后台，内置了 动态切换布局，动态换肤，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级中后台产品原型。

[线上地址](https://fuphoenixes.github.io/example/dist)

### 建议
> 本项目集成了很多你可能用不到的功能，会造成不少的代码冗余。如果你的项目不关注这方面的问题，也可以直接删除对应功能进行二次开发。

### 功能
```bash
- 登录 / 注销

- 权限验证
  - 页面权限
  - 指令权限
  - 权限配置

- 多环境发布
  - dev sit stage prod

- 全局功能
  - 多种动态切换布局
  - 多种动态换肤
  - 动态切换大小
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 快捷导航(标签页)
  - Svg Sprite 图标
  - 本地/后端 mock 数据
  - Screenfull全屏
  - 自适应收缩侧边栏

- 编辑器
  - 富文本
  - Markdown

- Excel
  - 导出excel
  - 导入excel

- 表格
  - 分页表格
  - 滚动表格
  - 综合表格

- 错误页面
  - 401
  - 404

- 組件
  - 引导页
  - Echarts
  - el-form-table
  - lb-table
  - fu-page
  - 树型
  - Clipboard(剪贴复制)
```

### 前序准备
> 本项目技术栈基于 ES2015+、vue、vuex、vue-router 、vue-cli 、axios 和 element-ui，所有的请求数据都使用Mock.js进行模拟，提前了解和学习这些知识会对使用本项目有很大的帮助。

## 目录结构
```
├── build                      # 构建相关
├── mock                       # 项目mock 模拟数据
├── plop-templates             # 基本模板
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── directive              # 全局指令
│   ├── filters                # 全局 filter
│   ├── icons                  # 项目所有 svg icons
│   ├── lang                   # 国际化 language
│   ├── layout                 # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── vendor                 # 公用vendor
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 权限管理
├── tests                      # 测试
├── themeColor                 # 主题文件
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```

### 启动

```bash
# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org
# 或使用 nrm 切换源

# 启动服务
npm run dev
```

 浏览器访问 [http://localhost:9528](http://localhost:9528)

### 打包

```bash
# 构建生产环境
npm run build
```

### 其它命令

```bash
# 预览发布环境效果
npm run preview

# 包依赖分析
npm run report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint:fix
```

### 环境变量

本项目基于 `vue-cli`来进行构建，所以所有的环境变量配置都是基于`vue-cli`来实现和控制的。

[官方文档](https://cli.vuejs.org/zh/guide/mode-and-env.html)

```
.env                # 在所有的环境中被载入
.env.[mode]         # 只在指定的模式中被载入
```

一个环境文件只包含环境变量的“键=值”对：

```
FOO=bar
VUE_APP_SECRET=secret
```

> 注意！！！
>
> 环境变量必须以`VUE_APP_`为开头。如:`VUE_APP_API`、`VUE_APP_TITLE`
>
> 你在代码中可以通过如下方式获取:
>
> ```js
> console.log(process.env.VUE_APP_xxxx)
> ```

除了 `VUE_APP_*` 变量之外，在你的应用代码中始终可用的还有两个特殊的变量：

- `NODE_ENV` - 会是 "development"、"production" 或 "test" 中的一个。具体的值取决于应用运行的模式。
- `BASE_URL` - 会和 `vue.config.js` 中的 `publicPath` 选项相符，即你的应用会部署到的基础路径。

除了一些写在`.env`的环境变量之外，还有一些构建和部署相关的变量都是需要在`vue.config.js`中配置的。

你可以通过`process.env.NODE_ENV`来执行判断环境，来设置不同的参数。

具体代码可借鉴 `vue.config.js`

## 布局

 页面整体布局是一个产品最外层的框架结构，往往会包含导航、侧边栏、面包屑以及内容等。想要了解一个后台项目，先要了解它的基础布局。
> 本项目包含3套布局动态切换，分别是左侧菜单布局、头部菜单布局、头部一级菜单和左侧二级菜单布局
### layout
> 布局组件 <br>
> 对应代码 <br>
> @/layout 

 `@` 是 webpack 的 [alias](https://webpack.js.org/configuration/resolve/#resolve-alias) 不懂得请自行研究

### app-main
> 对应代码 <br>
> @/layout/components/AppMain

 这里在 app-main 外部包了一层 keep-alive 主要是为了缓存 <router-view> 的，配合页面的 tabs-view 标签导航使用。
 其中transition 定义了页面之间切换动画，可以根据自己的需求，自行修改转场动画。相关 [文档](https://cn.vuejs.org/v2/guide/transitions.html) 。
 默认提供了fade和fade-transform两个转场动画，具体 css 实现见transition.scss。
 如果需要调整可在AppMain.vue中调整transition 的 name。

### router-view
 vue官方路由组件，[参考文档](https://router.vuejs.org/zh/)

## 路由和菜单
 路由和菜单是组织起一个后台应用的关键骨架。

 本项目菜单和路由是绑定在一起的，所以你只有在 @/router/index.js 下面配置对应的路由，侧边栏就能动态的生成了，
 大大减轻了手动重复编辑侧边栏的工作量，当然这样就需要在配置路由的时候遵循一些约定的规则。

 ### 配置项
 ```javascript
/**
 * hidden: true                  当设置 true 的时候该路由不会在菜单中出现 如401，login等页面，或者如一些编辑页面/edit/1  (默认 false)
 * name:'router-name'            设定路由的名字，一定要填写不然使用<keep-alive>时会出现页面操作无法记录的问题
 *                               如果name是 foo.xxx 那么该路由将会作为 name 是 foo 的路由的下一级页面，并自动提供提供前进加载后退缓存功能
 * meta : {
    title: 'title'               设置该路由在菜单和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的菜单图标
    affix: true                  如果设置为true该路由对应的标签将一直显示在标签页中
    breadcrumb: false            如果设置为false该路由将不会显示在面包屑中（默认true）
    activeMenu: '/foo'           如果设置对应路由地址,访问本路由时菜单栏会高亮你设置路由对应的菜单
    activeTag: '/foo'			 如果设置对应路由地址,访问本路由时标签页会高亮你设置路由对应的标签
  }
 */
 ```
 示列：
 ```
    {
        path: '/table',
        component: Layout,
        redirect: '/table/pagination',
        name: 'table',
        meta: { title: '表格', icon: 'table' },
        children: [
          {
            path: 'pagination',
            name: 'table-pagination',
            component: () => import('@/views/table/pagination'),
            meta: { title: '分页表格' }
          },
          {
            path: 'infinite',
            name: 'table-infinite',
            component: () => import('@/views/table/infinite'),
            meta: { title: '滚动表格' }
          },
          {
            path: 'complex',
            name: 'table-complex',
            component: () => import('@/views/table/complex'),
            meta: { title: '综合表格' }
          }
        ]
      },
 ```
 这里的路由分为两种，constantRoutes 和 asyncRoutes。

 constantRoutes： 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。

 asyncRoutes： 代表那些需求动态判断权限并通过 addRoutes 动态添加的页面。

 ### 路由懒加载

 当打包构建应用时，Javascript 包会变得非常大，影响页面加载速度。
 如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

 结合 Vue 的 [异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6) 和 Webpack 的 [代码分割功能](https://www.webpackjs.com/guides/code-splitting/) ，轻松实现路由组件的懒加载。如：
 ```javascript
    const Foo = () => import('./Foo.vue')
 ```
 ### 菜单外链

 你也可以在侧边栏中配置一个外链，只要你在 path 中填写了合法的 url 路径，当你点击侧边栏的时候就会帮你新开这个页面。

 例如：
 ```
    {
      "path": "external-link",
      "component": Layout,
      "children": [
        {
          "path": "https://github.com/PanJiaChen/vue-element-admin",
          "meta": { "title": "externalLink", "icon": "link" }
        }
      ]
    }
 ```

 ## 权限验证

 原理在后台通过一个 tree 控件或者其它展现形式给每一个页面动态配置权限，之后将这份路由表存储到后端。
 当用户登录后得到 roles，前端根据 roles 去生成可访问的路由表，从而动态生成可访问页面，之后就是 router.addRoutes 动态挂载到 router 上。

 ### 路由权限
 路由层面权限的控制代码都在 @/permission.js 和 @/store/modules/permission.js 中。

 ### 指令权限
 封装了一个指令权限 `v-permission `，能简单快速的实现按钮级别的权限判断， 代码在 @/directive/permission

 ## 标签页

 方案大致为运用 keep-alive 和 router-view 的结合实现。
> 代码在 `@/layout/components/AppMain`、 `@/layout/components/TagsView` 、 `@/store/modules/tagsView`

 目前 tags-view 维护了两个数组。

 - visitedTags : 用户访问过的页面 就是标签栏导航显示的一个个 tag 数组集合
 - cachedViews  : 实际 keep-alive 的路由

 ### 注意事项
 由于目前 keep-alive 和 router-view 是强耦合的，而且查看文档和源码不难发现 keep-alive 的 include 默认是优先匹配组件的 name ，所以在编写路由 router 和路由对应的 view component 的时候一定要确保 两者的 name 是完全一致的。
 (切记 name 命名时候尽量保证唯一性 切记不要和某些组件的命名重复了，不然会递归引用最后内存溢出等问题)

 示列：

 ```
    //路由声明
    {
        path: 'pagination',
        name: 'table-pagination',
        component: () => import('@/views/table/pagination'),
        meta: { title: '分页表格' }
    }
 ```
 ```
    //路由对应的view  table/pagination
    export default {
      name: 'table-pagination'
    }
 ```
 ### Affix 固钉
 当在声明路由是 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）。

 示列：
 ```
    {
        path: '/dashboard',
        component: Layout,
        children: [
          {
            path: 'index',
            name: 'dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { 
                itle: '首页', 
                icon: 'dashboard', 
                affix: true  //添加了 Affix 属性
            }
          }
        ]
    }
 ```
 ## 动态换肤
 本项目基于 [webpack-theme-color-replacer](https://github.com/hzsrc/webpack-theme-color-replacer) 插件实现了动态换肤动能
> 代码在 `@/store/settings`、`@/settings.js`、`@/layout/components/settings`、`vue.config.js`、`themeColor`

 - `@/settings.js` 中设置当前默认主题色，即当前显示什么色
 - `@/layout/components/settings` 切换主题色操作组件
 - `@/store/settings` 客户端切换主题色具体逻辑
 - `vue.config.js` 打包时提取主题色样式文件配置处
 - `themeColor` 设置需要被提取的主题色值，即代码中什么颜色会被提取用于切换

 ## 样式

 ### CSS Modules
 在样式开发过程中，有两个问题比较突出：

 - 全局污染 —— CSS 文件中的选择器是全局生效的，不同文件中的同名选择器，根据 build 后生成文件中的先后顺序，后面的样式会将前面的覆盖；
 - 选择器复杂 —— 为了避免上面的问题，我们在编写样式的时候不得不小心翼翼，类名里会带上限制范围的标示，变得越来越长，多人开发时还很容易导致命名风格混乱，一个元素上使用的选择器个数也可能越来越多，最终导致难以维护。

 好在 vue 为我们提供了 [scoped](https://vue-loader.vuejs.org/zh/guide/scoped-css.html) 可以很方便的解决上述问题。 它顾名思义给 css 加了一个域的概念。
 ```
    /* 编译前 */
    .example {
      color: red;
    }
    
    /* 编译后 */
    .example[_v-f3f3eg9] {
      color: red;
    }
 ```
只要加上 `<style scoped>` 这样 css 就只会作用在当前组件内了。

> TIP: <br>
> 使用 scoped 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。

 ### 父组件改变子组件样式 深度选择器
 当你子组件使用了 scoped 但在父组件又想修改子组件的样式可以 通过 >>> 来实现：

 ```html
    <style scoped>
    .a >>> .b { /* ... */ }
    </style>
 ```
 将会编译成
 ```css
    .a[data-v-f3f3eg9] .b {
      /* ... */
    }
 ```
 如果你使用了一些预处理的东西，如 sass 你可以通过 /deep/ 来代替 >>> 实现想要的效果。

 ### 目录结构

 ```bash
    ├── styles
    │   ├── element-ui.scss          # 全局自定义 element-ui 样式
    │   ├── index.scss               # 全局通用样式
    │   ├── mixin.scss               # 全局mixin
    │   ├── transition.scss          # vue transition 动画
    │   └── variables.scss           # 全局变量
 ```
 工作流程是，全局样式都写在 `@/styles` 目录下，每个页面自己对应的样式都写在自己的 .vue 文件之中

 ```html
    <style>
    /* global styles */
    </style>
    
    <style scoped>
    /* local styles */
    </style>
 ```

 

###  Mixin

本项目使用[sass-resources-loader](https://github.com/shakacode/sass-resources-loader)设置了自动注入 sass 的 mixin 到全局，默认将`@/styles/index.css`、`@/styles/variables.scss`内的全局注入，无需手动引入这两文件

> 配置代码在 
>
> vue.config.js

## 图标

如果你没有在本项目`@/icons`中找到需要的图标，可以到 [iconfont.cn](http://iconfont.cn/) 上选择并生成自己的业务图标库，再进行使用。或者其它 svg 图标网站，下载 svg 并放到`@/icons/svg`文件夹之中就会自动导入。

### 使用方式

```jsx
<svg-icon icon-class="password" /> // icon-class 为 icon 的名字
```

### 改变颜色

`svg-icon` 默认会读取其父级的 color `fill: currentColor;`

你可以改变父级的`color`或者直接改变`fill`的颜色即可。

>TIP
>
>如果你遇到图标颜色不对，可以参照本[issue](https://github.com/PanJiaChen/vue-element-admin/issues/330)进行修改

## 和服务端进行交互

### 前端请求流程

在本项目中，一个完整的前端 UI 交互到服务端处理流程是这样的：

1. UI 组件交互操作；
2. 调用统一管理的 api service 请求函数；
3. 使用封装的 request.js 发送请求；
4. 获取服务端返回；
5. 更新 data；

从上面的流程可以看出，为了方便管理维护，统一的请求处理都放在 `@/src/api` 文件夹中，并且一般按照 model 纬度进行拆分文件，如：

```
api/
  login.js
  article.js
  remoteSearch.js
  ...
```

### request.js

其中，`@/src/utils/request.js` 是基于 [axios](https://github.com/axios/axios) 的封装，便于统一处理 POST，GET 等请求参数，请求头，以及错误提示信息等， 它封装了全局 `统一的错误处理`、`统一做了超时处理`、`baseURL设置`、`取消请求等`。

### 请求示列

```javascript
// api/article.js
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/mock/article/list',
    method: 'get',
    data: query
  })
}

// views/example/list
import { fetchList } from '@/api/article'
export default {
    data() {
        return {
            list: null
        }
    },
    methods: {
    	async fetchData() {
           const res = await fetchList()
           this.list = res.data
        }
 }
```

## Mock Data

Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发更加独立自主，不会被服务端的开发所阻塞.

### server mock

本项目使用 [webpack-api-mocker](https://www.npmjs.com/package/webpack-api-mocker)  进行mock数据处理

示列：

```javascript
// 直接返回数据
module.exports = {
  'GET /mock/user/info': {
    status: 200,
    data: {
      name: '王小二'
    }
  }
}

// 根据请求参数处理返回结果，以及使用mock.js
const Mock = require('mockjs')

const getData = pageSize => Mock.mock({
  [`items|${pageSize}`]: [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

module.exports = {
  'GET /mock/table/list': (req, res) => {
    const { pageSize, pageIndex } = req.query
    const items = getData(pageSize).items
    if (pageIndex > 3) {
      res.send({
        status: 200,
        data: {
          total: 30,
          items: []
        }
      })
      return
    }
    res.send({
      status: 200,
      data: {
        total: 30,
        items: items
      }
    })
  }
}
```

### 启用纯前端Mock

启用纯前端mock，可以不借助服务端mock数据，方便打包后演示

现在在`@/utils/mockXHR.js`也封装了一个纯前端 mock 的方法，并在`@/main.js`中已经引入：

```
if (process.env.VUE_APP_USE_MOCKXHR === 'true') {
  const mockXHR = require('./utils/mockXHR').default
  mockXHR()
}
```

你只需要在配置文件 .env.xxx中,设置`VUE_APP_USE_MOCKXHR=true`：

`eg: .env.development`

```
# use mockXHR
VUE_APP_USE_MOCKXHR = true
```

## 跨域问题

在 `dev` 开发模式下可以下使用 webpack 的 `proxy` 使用也是很方便，参照 [文档](https://www.webpackjs.com/configuration/dev-server/#devserver-proxy) 就会使用了，楼主一些个人项目使用的该方法。但这种方法在生产环境是不能使用的。在生产环境中需要使用 `nginx` 进行反向代理。不管是 `proxy` 和 `nginx` 的原理都是一样的，通过搭建一个中转服务器来转发请求规避跨域的问题。

| 开发环境 | 生产环境 |
| :------: | -------- |
|   cors   | cors     |
|  proxy   | nginx    |

### proxy示列

```javascript
// vue.config.js
  devServer: {
    proxy: {
      '/proxy': {
        target: 'http://xxxxxxxxxx',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy': ''
        }
      }
    }
  }
```

## ESLint 格式验证

不管是多人合作还是个人项目，代码规范都是很重要的。这样做不仅可以很大程度地避免基本语法错误，也保证了代码的可读性。

### 配置项

所有的配置文件都在 `.eslint.js` 中。 本项目基本规范是依托于 vue 官方的 eslint 规则 [eslint-config-vue](https://github.com/vuejs/eslint-config-vue) 做了少许的修改。大家可以按照自己的需求进行定制化配置

默认情况下使用了最严格的`plugin:vue/recommended`来校验代码，若你觉得太严格可自行修改。

```javascript
module.exports = {
  extends: ['plugin:vue/recommended', 'eslint:recommended']
  //你可以修改为  extends: ['plugin:vue/essential', 'eslint:recommended']
}
```

### 取消 ESLint 校验

如果你不想使用 ESLint 校验（强烈不推荐取消），只要找到vue.config.js 文件。 进行如下设置 `lintOnSave: false` 即可。

### 自动修复

```
npm run lint:fix
```

运行如上命令，eslint 会自动修复一些简单的错误。

## 组件文档

原则上本项目中引入的组件和自定义的组件都要在此处或者对应文件处添加使用文档

### LbTable

表格组件，本项目中的lb-table组件是基于社区[lb-element-table](https://github.liubing.me/lb-element-table/zh/)组件二次开发的，99%支持[element-ui Table](https://element.eleme.cn/#/zh-CN/component/table)组件api，除改动功能具体用法参考[lb-table文档](https://github.liubing.me/lb-element-table/zh/) 、[element-ui Table 文档](https://element.eleme.cn/#/zh-CN/component/table)

主要改动有:

1. 添加分页逻辑由组件自行处理
2. 添加刷新和自定义列功能
3. 添加换行控制功能
4. keep-alive后可以保证滚动条位置正确

改动后新增API：

LbTable Attributes

| 参数            | 说明                                                         | 类型    | 可选值 | 默认值       |
| :-------------- | ------------------------------------------------------------ | ------- | ------ | ------------ |
| wrap            | 表格单元格内容是否换行                                       | Boolean | -      | true         |
| table-key       | 表格唯一id,开启自定义列功能时需设置，若未设置则默认以当前路由路径作为唯一值，这会在同一个页面内有多个lb-table组件时出现保存用户自定义设置到本地与其他lb-table的设置重复的问题 当然若同一个页面内仅一个lb-table组件可以忽略 | String  | -      | 当前路由路径 |
| custom-column   | 是否开启自定义列功能                                         | Boolean | -      | false        |
| immediate-fetch | 是否在表格组件创建完成后立即触发一次fetch事件                | Boolean | -      | true         |

   LbTable Events

| 事件名  | 说明                                                         | 参数                       |
| ------- | ------------------------------------------------------------ | -------------------------- |
| refresh | 当用户点击刷新按钮时触发事件                                 | { pageSize,   currentPage} |
| fetch   | 触发请求数据事件：<br />1、表格组件创建完成后立即触发一次(可通过immediate-fetch参数配置)；<br />2、用户点击刷新时触发；<br />3、用户操作分页时触发<br />4、用户设置自定义列每页默认记录后点击保存时触发 | { pageSize,   currentPage} |

LbTable Methods

| 方法名  | 说明                          | 参数 |
| ------- | ----------------------------- | ---- |
| refresh | 主动触发表格刷新refresh事件   |      |
| fetch   | 主动触发表格请求数据fetch事件 | -    |

示列参考： `@/views/table/complex.vue`

### ElTableForm

用于表格头部的表单组件，Api99%兼容[element-ui Form](https://element.eleme.cn/#/zh-CN/component/form)组件

> tip： 原element-ui Form组件的inline属性强制为true

ElTable Attributes

| 参数         | 说明                                  | 类型    | 可选值      | 默认值 |
| ------------ | ------------------------------------- | ------- | ----------- | ------ |
| max-cols     | 大屏下一行最多显示几列,遵循24栅格布局 | Number  | 1,2,3,4,6,8 | 6      |
| default-open | 默认是否展开                          | Boolean | -           | false  |

ElTable Slot

| name | 说明                     |
| ---- | ------------------------ |
| btns | 收起、展开前的按钮放置处 |

示列参考： `@/views/table/complex.vue`

### ElInputGroup

包裹element-ui的表单组件即可达到输入框组的效果

示列参考： `@/views/inputGroup/index.vue`	

### FuPage

FuPage Attributes

| 参数            | 说明               | 类型           | 可选值 | 默认值                    |
| :-------------- | ------------------ | -------------- | ------ | ------------------------- |
| show-header     | 是否展示头部      | Boolean         | -      | false                   |
| title           | 标题               | String         | -      | 当前路由meta中配置的title |
| show-export     | 是否展示导出按钮   | Boolean        | -      | false                     |
| export-loading  | 导出按钮的loading  | Boolean        | -      | false                     |
| show-fullscreen | 是否展示全屏按钮   | Boolean        | -      | true                      |
| body-style      | 组件body区域的样式 | String, Object | -      | ''                        |

示列参考： `@/views/table/complex.vue`

### Charts

封装的echarts图表组件

| 参数    | 说明                      | 类型   | 可选值 | 默认值 |
| :------ | ------------------------- | ------ | ------ | ------ |
| options | echarts的选项参数（必填） | Object | -      | -      |
| width   | 组件宽                    | String | -      | 100%   |
| height  | 组件高                    | String | -      | 100%   |

示列参考： `@/views/charts/index.vue`

### FuCkEditor

基于[ckEditor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/custom-builds.html#customizing-a-build)封装的富文本组件

| 参数             | 说明                     | 类型     | 可选值 | 默认值 |
| :--------------- | ------------------------ | -------- | ------ | ------ |
| content/ v-model | 绑定值，富文本内容(必传) | String   | -      | ''     |
| uploadImgHook    | 上传图片钩子             | Function | -      | ()=>{} |

示列参考： `@/views/editor/index.vue`

### MarkdownEditor

基于toastui-editor封装的markdown组件

[参考文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/markdown-editor.html#)

示列参考：`@/views/markdown/index.vue`

### Portal

[传送门](https://www.dazhuanlan.com/2019/10/05/5d98173a7627a/)组件，可以将其包裹的组件渲染到指定位置。

| 参数   | 说明                       | 类型   | 可选值 | 默认值 |
| :----- | -------------------------- | ------ | ------ | ------ |
| target | 目标dom的id或者class(必传) | String | -      | ''     |

### SvgIcon

全局 Svg Icon 图标组件

[参考文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/svg-icon.html)

### UploadExcel

Excel导入组件

[参考文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/excel.html#excel-导入)

## 指令文档

原则上本项目中相对复杂的指令都要在此处添加使用文档

### el-drag-dialog

使element-ui Dialog弹框组件可以拖拽的指令

示列：

```vue
 <el-dialog v-el-drag-dialog></el-dialog>
```

### el-height-adaptive-table

使element-ui Table组件可以自适应高度的组件，本项目同时添加了对LbTable组件的兼容

示列：

```
<el-table v-el-height-adaptive-table="{bottomOffset: 10}">...</el-table>
<lb-table v-el-height-adaptive-table="{bottomOffset: 10}">...</lb-table> 
```

参数： {

bottom : 距离页面底部高度

}

### el-table-infinite-scroll

对 element-ui 的无限滚动在 el-table 上使用的封装，本项目同时添加了对LbTable组件的兼容

示列：

参考 `@/view/table/infinite.vue`

```
<el-table v-el-table-infinite-scroll="load">...</el-table>
<lb-table v-el-table-infinite-scroll="load">...</lb-table>
```

[文档参考](https://element.eleme.cn/#/zh-CN/component/infiniteScroll)

### sticky

可将元素固定在指定位置

示列：

```vue
<div v-sticky="{stickyTop: 10, zIndex: 100}"></div>
```

### clipboard

复制粘贴指令

[参考文档](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/clipboard.html)

### el-select-dropdown-width

用于解决element-ui 下拉框组件 el-select 下拉弹框在部分情况下宽度异常的问题 

## 辅助文章

[Vue 脱坑记 - 查漏补缺(汇总下群里高频询问的 xxx 及给出不靠谱的解决方案)](https://juejin.im/post/59fa9257f265da43062a1b0e)

[vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/)

## 更新记录

#### 2020.6.12 18:03

   - 版本更新为 0.1.0
   - 新增 BlankLayout 组件用于解决3级及以上菜单设置的问题
   - 新增 el-select-dropdown-width 指令用于解决element-ui 下拉框组件 el-select 下拉弹框在部分情况下宽度异常的问题 
   - 添加布局4（layout4）用于在项目名过长无法展示时替换布局1
   - 修复头部菜单栏在屏宽变化时样式异常的bug
   - 修改 eslint 配置，解决.vue文件 \<script> 内js必须顶行问题
   - 优化根据屏宽自动打开关闭侧边栏
   - 优化权限管理逻辑