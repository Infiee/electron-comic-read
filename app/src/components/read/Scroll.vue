<template>
  <div class="read">
    <!-- <ul
      class="viewer"
      @click="handleClick"
    >
      <li
        v-for="item in pageFile"
        :key="item.filename"
      >
        <img
          :src="'local-resource://' + item.filepath"
          :alt="item.name"
        />
      </li>
    </ul> -->
    <!-- <div class="item" v-for="item in chapterList" :key="item">
      <div class="cover">
        <img
          :src="
            'local-resource://' +
              openFolder['path'] +
              '/' +
              chapterName +
              '/' +
              item
          "
          :alt="item"
        />
      </div>
    </div> -->
    <virtual-list
      style="height: 600px; overflow-y: auto;"
      :data-key="'path'"
      :data-sources="chapterList"
      :data-component="itemComponent"
      @totop="onTotop"
      @tobottom="onToBottom"
    >
      <div slot="header" v-show="overflow" class="header">
        <div class="spinner" v-show="!finished"></div>
        <div class="finished" v-show="finished">No more data</div>
      </div>
      <div slot="footer" class="loading-spinner">Loading ...</div>
    </virtual-list>
  </div>
</template>

<script>
import ReadItem from "@/components/ReadItem";
import VirtualList from "vue-virtual-scroll-list";

// @ is an alias to /src
export default {
  name: "Read",
  data() {
    return {
      itemComponent: ReadItem,
      chapterName: "",
      chapterList: [],
      prevNum: 0,
      nextNum: 0,
    };
  },
  components: {
    "virtual-list": VirtualList,
  },
  methods: {
    getPageData() {
      const chapterList = this.openFolder["chapterList"];
      const hisRecord = this.readHis;
      const comicName = this.openFolder["name"];
      let chapterInfo = {};
      for (let name in hisRecord) {
        if (name == comicName) {
          this.chapterName = hisRecord[name]["chapter"];
        }
      }
      chapterInfo = chapterList.find(
        (item) => item["name"] == this.chapterName
      );
      this.chapterList = chapterInfo["chapterPics"].map((item) => {
        const temp = {
          name: item,
          path: this.openFolder["path"] + "/" + this.chapterName + "/" + item,
        };
        return (item = temp);
      });
      console.log("this.chapterList - ", this.chapterList, chapterInfo["name"]);
      chapterList.map((item, idx) => {
        if (item["name"] == chapterInfo["name"]) {
          this.prevNum = idx - 1 <= 0 ? 0 : idx - 1;
          this.nextNum =
            idx + 1 >= chapterList.length - 1
              ? chapterList.length - 1
              : idx + 1;
        }
      });
    },
    onTotop() {
      console.log("头部开始加载");
    },
    onToBottom() {
      console.log("底部开始加载");
      // this.chapterList = this.chapterList.concat(
      //   this.getPageData(this.pageNum)
      // );
    },
  },
  mounted() {
    this.getPageData();
  },
  computed: {
    openFolder() {
      return this.$store.state["openFolder"];
    },
    readHis() {
      return this.$store.state["readHis"];
    },
  },
};
</script>

<style scoped lang="scss">
.read {
  height: 100%;
  overflow-y: scroll;
  // .cover {
  //   img {
  //     width: 100%;
  //     max-height: auto;
  //   }
  // }
}

.header {
  padding: 0.5em;
  .finished {
    font-size: 14px;
    text-align: center;
    color: #bfbfbf;
  }
  .spinner {
    font-size: 10px;
    margin: 0px auto;
    text-indent: -9999em;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ffffff;
    background: linear-gradient(to right, #ccc 10%, rgba(255, 255, 255, 0) 42%);
    position: relative;
    animation: load3 1.4s infinite linear;
    transform: translateZ(0);
  }
  .spinner:before {
    width: 50%;
    height: 50%;
    background: #ccc;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
  }
  .spinner:after {
    background: #ffffff;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: "";
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @-webkit-keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
