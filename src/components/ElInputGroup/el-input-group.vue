<template>
  <div class="fu-el-input-group">
    <div class="fu-el-input-flex">
      <slot />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'el-input-group'
  }
</script>

<style lang="scss">
.fu-el-input-group {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  .fu-el-input-flex {
    display: flex;
    align-items: center;
    justify-content: space-around;
    & > div {
      position: relative;
      input,
      &.el-range-editor {
        border-right: none;
        border-radius: 0;
        &:focus {
          border: 1px solid #409EFF;
        }
      }
      &.el-range-editor.is-active {
        border: 1px solid #409EFF;
      }
      &:first-child {
        input,
        &.el-range-editor {
          border-radius: 4px 0 0 4px;
        }
      }
      &:last-child {
        input,
        &.el-range-editor {
          border: 1px solid #DCDFE6;
          border-radius: 0 4px 4px 0;
        }
        // 支持input append
        &.el-input-group--append input {
          border-radius: 0;
        }
        .el-input-group__append > *:active {
          border-color: transparent;
        }
      }
      // 日期选择框
      input.el-range-input {
        border: none !important;
      }
    }
  }
}
</style>
