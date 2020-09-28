<template>
  <div ref="portal">
    <slot />
  </div>
</template>

<script>

  export default {
    props: {
      target: {
        type: String,
        required: true
      }
    },
    watch: {
      target() {
        this.insertToBody()
      }
    },
    mounted() {
      this.elx = this.$refs.portal.firstChild
      this.insertToBody()
      this.$refs.portal.remove()
    },
    beforeDestroy() {
      this.elx && this.elx.remove()
    },
    methods: {
      insertToBody() {
        const target = document.querySelector(this.target)
        target.parentNode.replaceChild(this.elx, target)
      }
    }
  }
</script>
