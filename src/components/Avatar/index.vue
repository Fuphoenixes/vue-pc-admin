<template>
  <span class="avater">
    {{ avater }}
  </span>
</template>
<script>
  export default {
    props: {
      name: {
        type: String,
        required: true
      }
    },
    computed: {
      avater() {
        const length = this.name.length
        if (length >= 3) {
          return this.name.substring(length - 2)
        } else {
          return this.name
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .avater {
    display: inline-block;
    width: 30px;
    height: 30px;
    padding: 0;
    overflow: hidden;
    font-size: 12px;
    line-height: 30px;
    color: #fff;
    text-align: center;
    text-shadow: transparent 0 0 0;
    vertical-align: middle;
    background: $themeColor;
    border-radius: 30px;
    zoom: 1;
    flex: none;
  }
</style>
