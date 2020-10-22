<template>
  <div class="fu-page" :class="{fullscreen: isFullscreen}">
    <div v-if="renderTitle" class="fu-page-header">
      <span>{{ renderTitle }}</span>
      <div class="fu-page-header-right">
        <span v-if="showExport" class="export"><el-button :loading="exportLoading" type="text" @click="$emit('export')"><svg-icon icon-class="export" /> 导出</el-button></span>
        <span v-if="showFullscreen" class="ping"><svg-icon :icon-class="isFullscreen ? 'xiaoping' : 'quanping'" @click="handleScreen" /></span>
      </div>
    </div>
    <div class="fu-page-body" :class="{noHeader: !renderTitle}" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>

<script>
  import screenfull from 'screenfull'

  export default {
    name: 'fu-page',
    props: {
      showHeader: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      },
      exportLoading: {
        type: Boolean,
        default: false
      },
      showExport: {
        type: Boolean,
        default: false
      },
      showFullscreen: {
        type: Boolean,
        default: true
      },
      bodyStyle: {
        type: [String, Object],
        default: ''
      }
    },
    data() {
      return {
        isFullscreen: false
      }
    },
    computed: {
      renderTitle() {
        if (!this.showHeader) return ''
        return this.title || (this.$route && this.$route.meta && this.$route.meta.title) || ''
      }
    },
    mounted() {
      screenfull.on('change', this.onFullscreenChange)
      screenfull.on('error', event => {
        console.error('开启全屏失败', event)
        this.$message.error('开启全屏失败，您的游览器暂不支持全屏！')
      })
    },
    beforeDestroy() {
      screenfull.off('change', this.onFullscreenChange)
    },
    methods: {
      onFullscreenChange() {
        this.isFullscreen = screenfull.isFullscreen
        if (!this.styleDom) {
          this.styleDom = document.createElement('style')
          this.styleDom.innerHTML = `.v-modal{display:none;}`
        }
        const body = document.querySelector('body')
        if (this.isFullscreen) {
          body.appendChild(this.styleDom)
        } else {
          body.removeChild(this.styleDom)
        }
      },
      handleScreen() {
        screenfull.toggle()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fu-page {
    position: relative;
    min-height: calc(100% - 16px);
    margin: 8px;
    background: #fff;
    .fu-page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      padding-left: 10px;
      font-size: 16px;
      color: #333;
      border-bottom: 1px solid #DCDFE6;
      .fu-page-header-right {
        height: 100%;
        & > span {
          display: inline-block;
          height: 100%;
          line-height: 36px;
          color: #999;
          text-align: center;
          border-left: 1px solid #DCDFE6;
        }
        .export {
          width: 86px;
          & .is-loading {
            opacity: 0.6;
          }
          & > button {
            font-size: 16px;
            & > span {
              color: $themeColor;
            }
          }
        }
        .ping {
          width: 40px;
        }
      }
    }
    .fu-page-body {
      position: absolute;
      top: 36px;
      right: 0;
      left: 0;
      min-height: calc(100% - 36px);
      padding: 10px;
      background: #fff;
      &.noHeader {
        top: 0;
        min-height: 100% !important;
      }
    }
  }
  .fullscreen.fu-page {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    margin: 0;
    /deep/ .el-dialog__wrapper {
      background: rgba(0, 0, 0, 0.5);
    }
  }
</style>
<style lang="scss">
  .PAGE-SIZE-medium .fu-page {
    .fu-page-header {
      height: 48px;
      .fu-page-header-right {
        & > span {
          line-height: 48px;
        }
        .ping {
          width: 48px;
        }
      }
    }
    .fu-page-body {
      top: 48px;
      min-height: calc(100% - 48px);
    }
  }
  .PAGE-SIZE-small .fu-page {
    .fu-page-header {
      height: 42px;
      .fu-page-header-right {
        & > span {
          line-height: 42px;
        }
        .ping {
          width: 42px;
        }
      }
    }
    .fu-page-body {
      top: 42px;
      min-height: calc(100% - 42px);
    }
  }
</style>
