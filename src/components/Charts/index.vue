<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
  export default {
    name: 'charts',
    props: {
      options: {
        type: Object,
        required: true
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      }
    },
    watch: {
      options: {
        handler(options) {
          this.chart.setOption(this.options)
        },
        deep: true
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
      removeResizeListener(this.$el, this.doResize)
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el)
        this.chart.setOption(this.options)
        addResizeListener(this.$el, this.doResize)
      },
      doResize() {
        this.chart && this.chart.resize()
      }
    }
  }
</script>

<style scoped>

</style>
