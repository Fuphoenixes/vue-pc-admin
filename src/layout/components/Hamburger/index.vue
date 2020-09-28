<template>
  <div id="hamburger-container" style="padding: 0 18px;" @click="toggleClick">
    <svg-icon icon-class="hamburger" class="hamburger" :class="{'is-active':isActive}" />
  </div>
</template>

<script>
  export default {
    name: 'hamburger',
    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toggleClick() {
        this.$emit('toggleClick')
      }
    }
  }
</script>

<style scoped>
.hamburger {
  width: 20px !important;
  height: 20px !important;
  vertical-align: middle !important;
  display: inline-block;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
