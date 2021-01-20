<template>
  <div class="app-page">
    <el-alert>
      引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于 driver.js.
      <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js.</a>
    </el-alert>
    <el-button icon="el-icon-question" style="margin-top: 20px;" type="primary" @click.prevent.stop="guide">
      开始引导
    </el-button>
  </div>
</template>

<script>
  import Driver from 'driver.js' // import driver.js
  import 'driver.js/dist/driver.min.css' // import driver.js css
  import getSteps from './steps'

  export default {
    name: 'guide',
    data() {
      return {
        driver: null
      }
    },
    mounted() {
      this.driver = new Driver({
        doneBtnText: '完成',
        closeBtnText: '关闭',
        nextBtnText: '下一步',
        prevBtnText: '上一步'
      })
    },
    methods: {
      guide() {
        this.driver.defineSteps(getSteps(this.driver))
        this.driver.start()
      }
    }
  }
</script>
