<template>
  <div class="list">
    <ComicList :dataList="folderList" v-if="folderList.length > 0" />
    <NoData v-else />
  </div>
</template>

<script>
// @ is an alias to /src
// import { remote } from "electron";
// const { BrowserWindow } = remote;
import ComicList from "@/components/common/ComicList";
import NoData from "@/components/common/NoData";

export default {
  name: "PageComicList",
  components: {
    ComicList,
    NoData,
  },
  mounted() {},
  computed: {
    folderList() {
      return this.$store.state.folderList;
    },
  },
};
</script>

<style scoped lang="scss">
</style>
