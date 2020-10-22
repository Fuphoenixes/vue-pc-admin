<template>
  <div>
    <div>
      <svg-icon class="map" icon-class="map" @click="open" />
      <span v-if="value">经度：{{ value.lng }} 纬度：{{ value.lat }}</span>
    </div>
    <el-dialog
      v-el-drag-dialog
      title="位置标注"
      :visible.sync="visible"
      append-to-body
      custom-class="coordinate-map-dialog"
    >
      <div id="coordinate-map" v-loading="$loadingPlugin.initMap" class="map-content" />
      <div slot="footer">
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button type="primary" @click="success">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'coordinate',
    props: {
      center: {
        type: Object,
        // 北京
        default: () => ({ lng: 116.404, lat: 39.915 })
      },
      value: {
        required: true
      },
      ak: {
        type: String,
        default: 'tBPMcunBdcz7bgG26l7LydiV'
      }
    },
    data() {
      return {
        visible: false,
        position: null
      }
    },
    methods: {
      open() {
        this.visible = true
        this.position = this.value
        this.initMap(this.position)
      },
      success() {
        if (this.position) {
          this.$emit('input', this.position)
        }
        this.visible = false
      },
      async initMap(position) {
        const BMap = await this.getMapScript()
        const map = new BMap.Map('coordinate-map')
        const center = new BMap.Point(this.center.lng, this.center.lat)
        map.centerAndZoom(center, 15)
        map.enableScrollWheelZoom()
        map.enableInertialDragging()
        map.enableContinuousZoom()
        const control = new BMap.ScaleControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT }) // 右上角，添加比例尺控件
        const navigation = new BMap.NavigationControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT }) // 右上角，添加缩放平移控件
        const city = new BMap.CityListControl({ anchor: window.BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(10, 20) }) // 左上角，添加城市选择控件
        const geolocationControl = new BMap.GeolocationControl() // 左下角添加定位控件
        map.addControl(control)
        map.addControl(navigation)
        map.addControl(city)
        map.addControl(geolocationControl)
        // 定位失败事件
        geolocationControl.addEventListener('locationError', (e) => {
          this.$message.error('定位失败：' + e.message)
        })
        let marker
        if (position) {
          const point = new BMap.Point(position.lng, position.lat)
          marker = new BMap.Marker(point)
          map.addOverlay(marker)
          marker.enableDragging()
          map.panTo(point)
        }
        map.addEventListener('click', (e) => {
          if (marker) {
            map.removeOverlay(marker)
            marker = null
          }
          const point = new BMap.Point(e.point.lng, e.point.lat)
          marker = new BMap.Marker(point)
          map.addOverlay(marker)
          marker.enableDragging()
          map.panTo(point)
          this.position = { lng: e.point.lng, lat: e.point.lat }
        })
      },
      getMapScript() {
        if (!window.BMap) {
          return new Promise((resolve, reject) => {
            const $script = document.createElement('script')
            global.document.body.appendChild($script)
            $script.src = `https://api.map.baidu.com/api?v=2.0&ak=${this.ak}&callback=_initBaiduMap`
            window._initBaiduMap = () => {
              resolve(window.BMap)
              global.document.body.removeChild($script)
            }
            $script.onerror = (e) => {
              reject()
              this.$message.error('百度地图控件加载失败，请检查网络并重试！')
            }
          })
        } else {
          return Promise.resolve(window.BMap)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .map {
    margin-right: 10px;
    font-size: 20px;
    cursor: pointer;
    &:hover {
      color: $themeColor;
    }
  }
</style>
<style lang="scss">
  .coordinate-map-dialog {
    min-width: 700px;
    .el-dialog__body {
      height: 70vh;
      padding: 0;
      .map-content {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
