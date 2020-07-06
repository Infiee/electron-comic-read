<template>
  <div class="comic-list">
    <div
      class="item"
      v-for="item in chapterList"
      :key="item.name"
      @click="read(item)"
    >
      <div class="cover">
        <img :src="'local-resource://' + item.cover" alt="logo" />
      </div>
      <div class="name">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChapterList",
  props: {
    chapterList: Array,
  },
  data() {
    return {};
  },
  methods: {
    read(item) {
      const hisItem = {
        [this.openFolder["name"]]: {
          chapter: item["name"]
        }
      }
      this.$store.commit("saveHis", hisItem);
      this.$router.push("/read");
    },
  },
  mounted() {},
  computed: {
    openFolder() {
      return this.$store.state["openFolder"];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.comic-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: -15px;
  .item {
    width: 120px;
    margin-left: 20px;
    margin-bottom: 25px;
    cursor: pointer;
    position: relative;
    .name {
      @include ellipsis;
      font-size: 13px;
      position: absolute;
      left: 5px;
      bottom: 5px;
      right: 5px;
      background-color: #f2b4ca;
      color: #fff;
      text-align: center;
      font-size: 13px;
      padding: 0 4px;
    }
  }
}
.cover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 0;
  position: relative;
  width: 120px;
  height: 150px;
  padding: 5px;
  img {
    width: 100%;
    height: 100%;
    // position: absolute;
    // left: 0px;
    // top: 0px;
  }
}
</style>
