<template>
  <div class="images-input">
    <el-input ref="input" :placeholder="placeholder" :value="inputValue">
      <el-button
        slot="append"
        class="pointer"
        :loading="$loadingPlugin.upload"
        @click="importImage"
      >{{ append }}</el-button>
    </el-input>
    <draggable
      :list="images"
      class="clearfix"
      :options="{group:'imagesInput',ghostClass: 'ghost-diy'}"
    >
      <div v-for="(image,index) in images" :key="index" class="image-box">
        <a class="image" :href="image" target="_blank">
          <img :src="image" alt="">
        </a>
        <i class="el-icon-close" @click="del(index)" />
      </div>
    </draggable>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { importFile } from '@/utils/file'
  import upload from '@/utils/qiniuUpload'

  export default {
    components: {
      Draggable
    },
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      append: {
        type: String,
        default: '选择图片'
      },
      value: {
        required: true
      },
      onlyOne: {
        type: Boolean,
        default: false
      },
      limit: {
        type: Number,
        default: 0
      }
    },
    computed: {
      images: {
        get() {
          if (this.onlyOne) {
            return this.value ? [this.value] : []
          } else {
            return this.value
          }
        },
        set(newVal) {
          if (this.onlyOne) {
            this.$emit('input', newVal[0] || '')
          } else {
            this.$emit('input', newVal)
          }
        }
      },
      inputValue() {
        return this.value instanceof Array ? this.value.join(';') : this.value
      }
    },
    methods: {
      async importImage() {
        if (!this.onlyOne && this.limit && this.images.length >= this.limit) {
          this.$message.warning(`最多上传${this.limit}张图片`)
        }
        const file = await importFile({ accept: 'image/*' })
        await this.upload(file)
      },
      async upload(file) {
        const url = await upload({ file })
        if (this.onlyOne) {
          this.images = [url]
        } else {
          this.images = this.images.concat([url])
        }
      },
      del(index) {
        this.images.splice(index, 1)
        this.$set(this, 'images', this.images)
      }
    }
  }
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
  outline: none;
  &:active,
  &:hover {
    color: #909399 !important;
    background: transparent !important;
    border-color: transparent !important;
  }
}
.image-box {
  position: relative;
  float: left;
  width: 100px;
  height: 100px;
  padding: 4px;
  margin-top: 8px;
  margin-right: 20px;
  border: 1px solid #EBEEF5;
  .image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90px;
    height: 90px;
    font-size: 0;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  i {
    position: absolute;
    top: 0;
    right: -18px;
    font-size: 16px;
    font-weight: bold;
    color: #909399;
    cursor: pointer;
    &:hover {
      color: #303133;
    }
  }
}
</style>
<style>
  .images-input .ghost-diy {
    border: 2px dashed $themeColor !important;
  }
  .images-input .ghost-diy * {
    visibility: hidden;
  }
</style>
