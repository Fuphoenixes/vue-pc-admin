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
  .avater{
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 30px;
    text-align: center;
    overflow: hidden;
    zoom: 1;
    vertical-align: middle;
    color: #fff;
    text-shadow: transparent 0 0 0;
    padding: 0;
    flex: none;
    background: $themeColor;
  }
</style>
