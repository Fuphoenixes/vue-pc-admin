<template>
  <el-drawer
    title="页面设置"
    :visible.sync="$store.state.app.showSettings"
    direction="rtl"
    append-to-body
    custom-class="settings-drawer"
  >
    <div class="drawer-container">
      <div class="drawer-item">
        <span>布局类型</span>
        <ul class="layout">
          <li @click="changeSetting({layout:'layout1'})">
            <svg-icon icon-class="layout1" />
            <i v-show="settings.layout === 'layout1'" class="el-icon-check" />
          </li>
          <li @click="changeSetting({layout:'layout2'})">
            <svg-icon icon-class="layout2" />
            <i v-show="settings.layout === 'layout2'" class="el-icon-check" />
          </li>
          <li @click="changeSetting({layout:'layout3'})">
            <svg-icon icon-class="layout3" />
            <i v-show="settings.layout === 'layout3'" class="el-icon-check" />
          </li>
          <li @click="changeSetting({layout:'layout4'})">
            <svg-icon icon-class="layout4" />
            <i v-show="settings.layout === 'layout4'" class="el-icon-check" />
          </li>
        </ul>
      </div>
      <div class="drawer-item">
        <span>主题色</span>
        <el-color-picker
          :value="settings.themeColor || '#4451B2'"
          :predefine="['#4451B2', '#12B1B1', '#409EFF', '#E84B16', '#fa541c','#EBA313', '#4CB418', '#2f54eb', '#722ed1']"
          popper-class="theme-picker-dropdown"
          style="float: right; height: 26px; margin: -3px 8px 0 0;"
          class="theme-picker"
          @change="themeColor=>changeSetting({themeColor})"
        />
      </div>

      <div class="drawer-item">
        <span>布局大小</span>
        <el-select
          size="mini"
          class="drawer-select"
          :value="settings.size"
          @change="sizeChange"
        >
          <el-option label="小" value="mini" />
          <el-option label="中" value="small" />
          <el-option label="大" value="medium" />
        </el-select>
      </div>

      <div class="drawer-item">
        <span>开启页签</span>
        <el-switch
          :value="settings.tagsView"
          class="drawer-switch"
          @input="tagsView=>changeSetting({tagsView})"
        />
      </div>

      <div class="drawer-item">
        <span>固定头部</span>
        <el-switch
          :value="settings.layout !== 'layout2' ? true : settings.fixedHeader"
          class="drawer-switch"
          :disabled="settings.layout !== 'layout2'"
          @input="fixedHeader=>changeSetting({fixedHeader})"
        />
      </div>

    </div>
  </el-drawer>
</template>

<script>
  import { mapActions } from 'vuex'
  import { addClass } from '@/utils/className.js'
  import { removeClass } from '@/utils/className'

  export default {
    data() {
      return {}
    },
    computed: {
      settings() {
        return this.$store.state.settings
      }
    },
    methods: {
      ...mapActions({
        changeSetting: 'settings/changeSetting'
      }),
      sizeChange(size) {
        this.$ELEMENT.size = size
        console.log(`PAGE_SIZE-${this.settings.size}`)
        removeClass(document.body, `PAGE-SIZE-${this.settings.size}`)
        addClass(document.body, `PAGE-SIZE-${size}`)
        this.changeSetting({ size })
        this.refreshView()
        this.$message({
          message: '切换布局大小成功',
          type: 'success'
        })
      },
      refreshView() {
        // In order to make the cached page re-rendered
        this.$store.dispatch('tagsView/delAllTags')

        const { fullPath } = this.$route

        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .drawer-container {
    padding: 0 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-item {
      padding: 12px 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);

      .layout {
        margin-top: 16px;

        & > li {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 45px;
          margin-right: 10px;

          svg {
            width: 100%;
            height: 100%;
          }

          i {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 22px;
            font-weight: bold;
            color: #409EFF;
            transform: translate(-50%, -50%);
          }
        }
      }
    }

    .drawer-switch {
      float: right;
    }
    .drawer-select {
      float: right;
      width: 60px;
    }
  }

  .theme-picker /deep/ .el-color-picker__trigger {
    width: 26px !important;
    height: 26px !important;
    padding: 2px;
  }
</style>
<style>
  .theme-picker-dropdown {
    z-index: 99999 !important;
  }

  .settings-drawer {
    width: 250px !important;
  }
</style>
