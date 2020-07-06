<template>
  <div class="comic-list">
    <div class="item" v-for="(item, idx) in dataList" :key="item.path">
      <div class="cover" @click="openChapter(item)">
        <img :src="'local-resource://' + item.cover" alt="logo" />
        <div class="name">
          {{ item.name }} - 
          {{ chapterData[idx] }}
        </div>
      </div>
      <div class="his" v-if="item['his']" @click="onContinue(item)">
        续看
      </div>
    </div>
  </div>
</template>

<script>
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { isImg, filterFolder, openFolder } from "@/utils";

export default {
  name: "ComicList",
  props: {
    dataList: Array,
  },
  data() {
    return {
      chapterList: [],
      chapterData: [],
    };
  },
  methods: {
    getChapterData() {
      this.dataList.map((item) => {
        const folderItem = item["path"];
        const comicInfo = fse.readJsonSync(
          path.join(folderItem) + "/comic.json"
        );
        const chapterListData = comicInfo['chapterList'];
        this.chapterData.push(chapterListData[chapterListData.length-1]["title"]);
        // this.chapterData.push(chapterListData[0]["title"]);
        // console.log('this.chapterData',chapterListData)
      });
      // console.log('this.chapterData',this.chapterData)
    },
    openChapter(item) {
      // console.log('item',item)
      openFolder(item).then((chapterList) => {
        this.chapterList = chapterList;
        this.$router.push("/chapter-list");
      });
    },
    onContinue(item) {
      // console.log('continue item',item)
      const folderItem = item["path"];
      const comicInfo = fse.readJsonSync(
          path.join(folderItem) + "/comic.json"
        );
      const chapterListData = comicInfo['chapterList'];
      // console.log("章节数据 - ", chapterListData);
      fs.readdir(folderItem, (err, folders) => {
        if (err) {
          this.$message.error("获取漫画章节目录失败!");
          return;
        }
        folders = filterFolder(folders);
        console.log("folders", folderItem);
        folders.map((item) => {
          const chapterDir = path.join(folderItem, item);
          // 判断是否为文件夹
          const stat = fs.statSync(chapterDir);
          if (!stat.isDirectory()) return;
          // 判断章节文件夹内是否有图片
          const chapterPics = fs.readdirSync(chapterDir).filter(isImg);
          if (!chapterPics.length) return;
          const chapterIdx = chapterListData.findIndex((chapterItem) => {
            return chapterItem["title"] == item.replace(/\(.*\)/g, "");
          });
          this.chapterList[chapterIdx] = {
            cover: path.join(chapterDir, chapterPics[0]),
            name: item,
            chapterPics: chapterPics.sort((a, b) => {
              const tempa = a.replace(/(\D)/g, ""),
                tempb = b.replace(/(\D)/g, "");
              return tempa - tempb;
            }),
          };
        });
        this.$store.commit("openFolder", {
          ...item,
          chapterList: this.chapterList,
        });
        this.$router.push("/read");
      });
    },
  },
  mounted() {
    this.getChapterData();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.comic-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 120px;
    margin-left: 15px;
    margin-top: 15px;
    position: relative;
    .name {
      @include ellipsis;
      font-size: 14px;
      color: #fff;
      position: absolute;
      bottom: 0;
      top: 50%;
      margin-top: -10px;
      left: 0;
      right: 0;
      height: 20px;
      // background-color: rgba(0, 0, 0, 0.85);
      background-color: #f2b4ca;
      padding-left: 5px;
      padding-right: 5px;
    }
    .his {
      font-size: 12px;
      // color: $color-text;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      position: absolute;
      bottom: 0px;
      left: 0;
      // right: 0;
      width: 30px;
      padding-left: 8px;
      padding-right: 8px;
      padding-top: 4px;
      padding-bottom: 4px;
      cursor: pointer;
    }
  }
}
.cover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  position: relative;
  img {
    width: 120px;
    height: 160px;
    border-radius: 4px;
    display: block;
  }
}
</style>
