<template>
  <div id="app">
    <keep-alive :include="cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "App",
  computed: {
    ...mapState(["cachePages"]),
  },
};
</script>

<style lang="less">
.box {
  width: 200px;
  height: 100px;
  background: pink;
}
</style>
