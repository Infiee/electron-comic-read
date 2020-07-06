<template>
  <div class="list">
    <div class="toolbar">
      <Back class="back" @onBack="backChange" />
      <div class="sort" @click="onSort"><i class="el-icon-sort"></i>倒序</div>
    </div>
    <ChapterList :chapterList="list" />
  </div>
</template>

<script>
import ChapterList from "@/components/common/ChapterList";
import Back from "@/components/common/Back";

export default {
  name: "PageChapterList",
  components: {
    ChapterList,
    Back,
  },
  data() {
    return {
      sort: "倒序",
      list: [],
    };
  },
  methods: {
    onSort() {
      this.list = this.list.reverse();
    },
    backChange(){
      this.$router.push('/list')
    }
  },
  mounted() {
    this.list = [...this.openFolderChapterList];
  },
  computed: {
    openFolderChapterList() {
      return this.$store.state.openFolder["chapterList"];
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  height: 100%;
  overflow-y: scroll;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-right: 15px;
  // background-color: #fff;
  .info {
    display: flex;
  }
  h3 {
    font-size: 16px;
    font-weight: normal;
  }
  .sort {
    cursor: pointer;
    font-size: 14px;
    background: rgb(183, 199, 235);
    color: #fff;
    padding: 3px 6px;
  }
}
</style>
