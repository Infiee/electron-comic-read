<template>
  <div class="flip">
    <ul class="viewer" @click="handleClick" ref="viewer" v-cloak>
      <li v-for="item in pageFile" :key="item.filename" style="width:50%">
        <img
          style="height: 100%;object-fit: contain;"
          :src="'local-resource://' + item.path"
          :alt="item.name"
        />
      </li>
    </ul>
    <div v-show="option" class="option no-drag">
      <div class="option-mask" @click="option = false"></div>
      <div class="header">
        <Back backText="返回章节" />
        <div class="title">{{ openFolder["name"] }} - {{ chapterName }}章</div>
        <div class="chapter">
          <div class="prev" @click="onPrev(reset=true)">上一章</div>
          <div class="next" @click="onNext(reset=true)">下一章</div>
        </div>
      </div>
      <div class="footer">
        <div class="slider">
          <span class="progress">{{ pageIdx }}/{{ chapterList.length }}</span>
          <span>1</span>
          <VueSlider
            class="vue-slider"
            v-model="pageIdx"
            :min="1"
            :max="Math.max(chapterList.length, 1)"
            @drag-end="onSliderChange"
            :clickable="false"
            :silent="true"
            :dotOptions="dotOptions"
            :processStyle="{ backgroundColor: '#eee' }"
          />
          <span>{{ chapterList.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Back from "@/components/common/Back";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  data() {
    return {
      chapterName: "",
      chapterList: [],
      pageFile: [],
      pageIdx: 1,
      pageNum: 2,
      prevChapterIdx: 0,
      nextChapterIdx: 0,
      curChapterIdx: 0,
      option: false,
      dotOptions: {
        style: {
          borderColor: "#B7C7EB",
        },
        focusStyle: {
          boxShadow: "0 0 0 5px rgba(255, 255, 255, .6)",
        },
        tooltipStyle: {
          color: "#b980ae",
          borderColor: "#fff",
          backgroundColor: "#fff",
        },
      },
    };
  },
  components: { VueSlider,Back },
  methods: {
    keydown({ keyCode }) {
      switch (keyCode) {
        case 37: // ->
          this.changePage("prev");
          break;
        case 39: // <-
          this.changePage("next");
          break;
        default:
          break;
      }
    },
    handleClick(event) {
      const { clientX } = event;
      const viewWidth = this.$refs["viewer"].clientWidth;
      const viewRect = this.$refs["viewer"].getBoundingClientRect();
      const containWidth = clientX - viewRect["left"];
      const radio = containWidth / viewWidth;
      // console.log("viewWidth", containWidth, viewWidth,radio);
      if (radio < 0.33) {
        this.changePage("prev");
      } else if (radio < 0.66) {
        this.option = true;
      } else {
        this.changePage("next");
      }
    },
    // 翻页
    changePage(type) {
      // console.log("type", type);
      let idx = this.pageIdx;
      if (type === "next") {
        idx++;
        // 切换章节
        if (idx > this.chapterList.length) {
          // console.log("切换下一章", this.pageIdx);
          this.onNext();
          return;
        } else {
          this.pageIdx = Math.min(
            this.chapterList.length,
            this.pageIdx + this.pageFile.length
          );
        }
      } else {
        // 切换章节
        idx--;
        if (idx < 1) {
          // console.log("切换上一章", this.pageIdx);
          this.onPrev();
          return;
        } else {
          this.pageIdx = Math.max(1, this.pageIdx - this.pageFile.length);
        }
      }
      // console.log('this.pageIdx',this.pageIdx,this.chapterList.length)
      this.setPageFile();
    },
    // 事件 - slider拖拽结束
    onSliderChange(){
      this.setPageFile();
    },
    getPageData(type,reset) {
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
      // console.log("this.chapterName - ", this.chapterName);
      chapterList.map((item, idx) => {
        if (item["name"] == chapterInfo["name"]) {
          this.curChapterIdx = idx;
        }
      });
      if(reset){
        this.pageIdx = 1
      }else{
        if (type) {
          this.pageIdx = type === "next" ? 1 : this.chapterList.length;
        }
      }
      // console.log(
      //   "this.chapterList - ",
      //   this.chapterList,
      //   chapterInfo["name"],
      //   // this.chapterList.length,
      //   this.pageIdx,
      //   this.pageIdx<=Math.max(this.chapterList.length, 1),
      //   Math.max(this.chapterList.length, 1)
      // );
      this.setPageFile();
    },
    setPageFile() {
      this.pageFile = this.chapterList.slice(
        this.pageIdx - 1,
        this.pageIdx - 1 + this.pageNum
      );
    },
    onBack() {
      this.$router.go(-1);
    },
    onPrev(reset) {
      const chapterList = this.openFolder["chapterList"];
      if (this.curChapterIdx == 0) {
        this.$message({
          message: "已经第一章了哦！",
          type: "warning",
        });
        return;
      }
      // console.log(
      //   "this.prevChapterIdx",
      //   this.curChapterIdx,
      //   this.prevChapterIdx,
      //   this.pageFile
      // );
      this.prevChapterIdx = this.curChapterIdx - 1 <= 0 ? 0 : this.curChapterIdx - 1;
      const chapterInfo = chapterList[this.prevChapterIdx];
      const hisState = {
        [this.openFolder["name"]]: {
          chapter: chapterInfo["name"],
        },
      };
      this.$store.commit("saveHis", hisState);
      // this.pageIdx = 1;
      this.getPageData("prev",reset);
    },
    onNext(reset) {
      const chapterList = this.openFolder["chapterList"];
      if (this.curChapterIdx == chapterList.length - 1) {
        this.$message({
          message: "已经最后一章了哦！",
          type: "warning",
        });
        return;
      }
      
      // console.log(
      //   "this.nextChapterIdx",
      //   this.curChapterIdx,
      //   this.nextChapterIdx,
      //   this.pageFile
      // );
      this.nextChapterIdx = this.curChapterIdx + 1 >= chapterList.length - 1
          ? chapterList.length - 1
          : this.curChapterIdx + 1;
      const chapterInfo = chapterList[this.nextChapterIdx];
      const hisState = {
        [this.openFolder["name"]]: {
          chapter: chapterInfo["name"],
        },
      };
      this.$store.commit("saveHis", hisState);
      // this.pageIdx = 1;
      this.getPageData("next",reset);
    },
  },
  mounted() {
    this.getPageData();
    window.addEventListener("keydown", this.keydown, false);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keydown);
    // console.log("销毁了");
    this.$store.commit("setReadMode", false);
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

<style lang="scss" scoped>
.flip {
  width: 100%;
  height: 100%;
  position: relative;
}
.viewer {
  display: flex;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  li {
    position: relative;
    img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      // height: 100%;
    }
    &:first-child {
      img {
        float: right;
      }
    }
    &:last-child {
      img {
        float: left;
      }
    }
  }
}
.option {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .option-mask {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 12px;
    width: 100%;
    height: 50px;
    color: #fff;
    box-sizing: border-box;
    background-color: rgba(242, 180, 202, 0.9);
    .chapter {
      display: flex;
      .prev {
        margin-right: 10px;
        cursor: pointer;
      }
      .next {
        cursor: pointer;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 0 12px;
    width: 100%;
    height: 50px;
    color: #fff;
    box-sizing: border-box;
    // background-color: #f2b4ca;
    background-color: rgba(242, 180, 202, 0.9);
    .slider {
      margin-right: 10px;
      height: 50px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        display: inline-block;
      }
      .progress {
        width: 80px;
        text-align: left;
      }
      .vue-slider {
        margin: 0 10px;
        flex: 1;
      }
    }
    .menu {
      height: 50px;
      display: flex;
      li {
        width: 100px;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
    }
  }
}
</style>
