<template>
  <div id="app" class="app-container">
    <!-- 主体 -->
    <div class="main-container">
      <AsideMenu />
      <div :class="[
        'main-content',
        readMode?'read-mode':null
      ]">
        <router-view />
      </div>
    </div>
    <!-- 拖拽条 -->
    <div class="drag-region__t"></div>
    <div class="drag-region__r"></div>
    <div class="drag-region__b"></div>
    <div class="drag-region__l"></div>
  </div>
</template>

<script>
import fs from "fs";
import path from "path";

import AsideMenu from "@/components/common/AsideMenu.vue";
export default {
  name: "App",
  components: {
    AsideMenu,
  },
  mounted() {
    this.$store.commit('setReadMode',false);
  },
  computed:{
    readMode(){
      return this.$store.state['readMode']
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/app";
// 布局
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  .drag-region {
    &__t,
    &__r,
    &__b,
    &__l {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 0;
      -webkit-app-region: drag;
    }
    &__t {
      height: 50px;
      top: 0;
    }
    &__r {
      width: 50px;
      left: calc(100% - 50px);
    }
    &__b {
      height: 50px;
      top: calc(100% - 50px);
    }
    &__l {
      width: 50px;
      left: 0;
    }
  }
}

.main-container {
  position: absolute;
  left: 50px;
  right: 50px;
  top: 50px;
  bottom: 50px;
  border-radius: 8px;
  // overflow: hidden;
  z-index: 2;
  -webkit-app-region: no-drag;
  -webkit-user-select: none;
  background-color: rgba(255, 255, 255, 0.75);
  .main-content {
    position: absolute;
    left: 160px;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 20px;
    &.read-mode{
      left: 0;
    }
  }
}
</style>
