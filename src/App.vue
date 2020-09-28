<template>
  <div id="app">
    <keep-alive :include="['layout', 'BlankLayout']">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>
