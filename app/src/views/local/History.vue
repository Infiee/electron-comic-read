<template>
  <div class="history">
    <ComicList :dataList="hisList" v-if="hisList.length > 0" />
    <NoData v-else />
  </div>
</template>

<script>
import ComicList from "@/components/common/ComicList";
import NoData from "@/components/common/NoData";

export default {
  name: "PageHistory",
  components: {
    ComicList,
    NoData,
  },
  data() {
    return {
      hisList: [],
    };
  },
  methods: {
    convertData() {
      const hisRecord = this.readHis;
      this.folderList.map((item) => {
        for (let name in hisRecord) {
          if (item.name == name) {
            this.hisList.push({
              ...item,
              his: true
            });
          }
        }
      });
    },
  },
  mounted() {
    this.convertData();
    console.log('dataList',this.hisList)
  },
  computed: {
    folderList() {
      return this.$store.state["folderList"];
    },
    readHis() {
      return this.$store.state["readHis"];
    },
  },
};
</script>

<style scoped lang="scss">
// .history {
//   overflow-y: scroll;
//   height: 100%;
// }
</style>
