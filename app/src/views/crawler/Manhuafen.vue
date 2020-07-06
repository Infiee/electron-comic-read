<template>
  <div class="crawler">
    <div class="search-form">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="searchKeyword"
      >
        <el-button 
          slot="append" 
          @click="searchComic" 
          type="primary">
          搜索漫画
        </el-button>
      </el-input>
      <el-button 
        @click="onCrawler"
        type="primary"
        style="margin-left:15px">
        开始爬取
      </el-button>
    </div>
    <div>
      搜索结果：
    </div>
    <div class="search-list" v-loading="loading">
      <div
        v-for="item in searchList"
        :key="item.url"
        class="item"
        @click="copyLink(item)"
      >
        <el-image style="width: 100px; height: 120px" lazy :src="item.cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div class="title">{{ item.title }}</div>
        <div class="author">作者：{{ item.author }}</div>
        <div class="chapter">章节：{{ item.chapter }}</div>
      </div>
    </div>
    <div>
      <div>
        下载进度：
      </div>
      <div class="progress">
        {{ downloadProgressTip }}
        <!-- <ul>
          <li>【漫画名】 - 漫画信息写入完成</li>
          <li>【漫画名】 - 章节信息写入</li>
          <li>【漫画名】 - 漫画图片下载完成</li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
import path from "path";
import fs from "fs";
import request from "request";
import rp from "request-promise";
import CryptoJS from "@/utils/crypto";
import cheerio from "cheerio";
import async from "async";
import fse from "fs-extra";
const { remote } = require("electron");
const { clipboard } = remote;
// const Store = require('electron-store');
const userDataDir = remote.app.getPath('userData')+'/fileData';
const BASE_URL = "https://www.manhuafen.com";
let chapterPath = "";
console.log('userDataDir',userDataDir)

export default {
  name: "landing-page",
  data() {
    return {
      searchKeyword: "",
      searchList: [],
      loading: false,
      comicUrl: "",
      downloadProgressTip: "",
    };
  },
  async mounted() {},
  methods: {
    copyLink(item) {
      clipboard.writeText(item["url"], "selection");
      this.comicUrl = item["url"];
      this.$message({
        message: "链接复制成功，请点击开始爬取",
        type: "success",
      });
      console.log("拷贝成功");
    },
    convertImg(imgUrl) {
      return rp({
        uri: imgUrl,
        encoding: "base64",
        timeout: 60000,
      })
        .then((body) => {
          return "data:image/jpeg;base64," + body;
        })
        .catch((err) => {
          console.log("封面加载错误", err);
        });
    },
    searchComic() {
      const self = this;
      const searchUrl =
        "https://www.manhuafen.com/search/?keywords=" +
        encodeURIComponent(this.searchKeyword);
      if (!this.searchKeyword) return;
      this.loading = true;
      this.searchList = [];
      console.log("searchUrl", searchUrl);
      rp(searchUrl).then((body) => {
        var $ = cheerio.load(body);
        this.loading = false;
        $(".list_con_li")
          .find("li")
          .each(async (idx, item) => {
            const coverUrl = $(item)
              .find(".image-link")
              .find("img")
              .attr("src");
            const title = $(item)
              .find(".image-link")
              .attr("title");
            // const imgUrl = this.convertImg(coverUrl);
            self.searchList.push({
              // cover: imgUrl,
              title: title,
              url: $(item)
                .find(".image-link")
                .attr("href"),
              author: $(item)
                .find(".auth")
                .text(),
              chapter: $(item)
                .find(".newPage")
                .text(),
            });
            const cv = await this.convertImg(coverUrl);
            this.$set(self.searchList[idx], "cover", cv);
          });
      });
      return false;
    },
    getChapterImage(item) {
      // const imgs = ["http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/01.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/02.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/03.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/04.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/05.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/06.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/07.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/08.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/09.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/10.jpg", "http://images.dmzj.com/g/%E9%AB%98%E8%BE%BE%E5%88%9B%E6%88%98%E8%80%85A/%E5%BA%8F/11.jpg"];
      // const imgs = ["https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194318.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194319.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194320.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194321.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194322.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194323.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194324.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194325.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194326.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194327.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194328.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194329.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194330.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194331.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194332.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194333.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194334.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194335.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194336.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194337.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194338.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194339.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194340.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194341.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194342.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194343.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194344.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194345.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194346.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194347.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194348.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194349.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194350.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194351.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194352.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194353.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194354.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194355.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194356.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194357.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194358.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194359.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194360.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194361.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194362.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194363.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194364.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194365.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194366.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194367.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/20194368.jpg", "https://mhimg.eshanyao.com/ManHuaKu/g/gebulinshashou/1/3h4utwaiyla4317.jpg"];
      // var filename = imgs[page - 1];
      var filename = item;
      var host = ["https://img01.eshanyao.com", "https://img002.eshanyao.com"];
      if (filename.match(/^https?:\/\/(images.dmzj.com|imgsmall.dmzj.com)/i)) {
        return (
          "https://img01.eshanyao.com/showImage.php?url=" + encodeURI(filename)
        );
      }
      if (filename.match(/^[a-z]\//i)) {
        return (
          "https://img01.eshanyao.com/showImage.php?url=" +
          encodeURI("https://images.dmzj.com/" + filename)
        );
      }
      if (filename.match(/^(http:|https:|ftp:|^)\/\//i)) return filename;
      // filename = chapterPath.trim("/") + "/" + filename.ltrim("/");
      filename = chapterPath + filename;
      // console.log("filename", host[0] + filename);
      return host[0] + "/" + filename;
    },
    decrypt20180904(chapterImages) {
      var key = CryptoJS.enc.Utf8.parse("123456781234567G"); //十六位字符作为密钥
      var iv = CryptoJS.enc.Utf8.parse("ABCDEF1G34123412");
      var decrypt = CryptoJS.AES.decrypt(chapterImages, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      // console.log(decrypt);
      var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      chapterImages = JSON.parse(decryptedStr.toString());
      console.log("解密后的章节图片 - ", chapterImages);
      return chapterImages;
    },
    async comicData(url = `${BASE_URL}/comic/1803/`) {
      const self = this;
      const regExp = new RegExp(BASE_URL+'/comic/(.+)/','gim');
      const comicId = url.replace(regExp,'$1');
      return await new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
          if (response["statusCode"] == 200) {
            var $ = cheerio.load(body);
            // console.log('body',response.toJSON() )
            const baseInfo = {
              cover: $(".comic_i_img")
                .find("img")
                .attr("src"),
              title: $(".comic_i_img")
                .find("img")
                .attr("alt"),
              author: $(".comic_deCon_liO")
                .find("li")
                .eq(0)
                .text()
                .trim()
                .replace(/作者：/g, ""),
              status: $(".comic_deCon_liO")
                .find("li")
                .eq(1)
                .text()
                .trim()
                .replace(/(状态：)/g, ""),
              region: $(".comic_deCon_liO")
                .find("li")
                .eq(4)
                .text()
                .trim()
                .replace(/(地区：)/g, ""),
              updateTime: $(".zj_list_head_dat")
                .eq(0)
                .text()
                .trim(),
            };
            const chapterInfo = {
              list: [],
            };
            $(".zj_list_con")
              .eq(0)
              .find("a")
              .each((idx, item) => {
                chapterInfo["list"].push({
                  title: $(item).attr("title"),
                  url: `${BASE_URL}` + $(item).attr("href"),
                });
              });
            const comicInfo = {
              comicId,
              baseInfo,
              chapterInfo,
            };
            // console.log("chapterInfo", chapterInfo);
            fse.ensureDirSync(path.resolve(`${userDataDir}/${baseInfo["title"]}`));
            fse.writeJsonSync(
              `${userDataDir}/` + baseInfo["title"] + "/comic.json",
              comicInfo
            );
            this.downloadProgressTip = `${baseInfo["title"]} - 漫画信息写入完成.`;
            resolve(comicInfo);
          }
        });
      });
    },
    async crawlerChapter(comicInfo) {
      const self = this;
      // const comicInfo = fse.readJsonSync("${userDataDir}/亚人/comic.json");
      console.log("comicInfo", comicInfo);
      const comicTitle = comicInfo["baseInfo"]["title"];
      const comic = fse.readJsonSync(`${userDataDir}/${comicTitle}/comic.json`);
      var q = async.queue(async function(task, callback) {
        await self.chapterData(task, comicInfo);
        console.log("章节 - " + task.title);
        self.downloadProgressTip = `${comicTitle} - 章节${task.title} - 完成.`;
        callback();
      }, 1);
      q.error(function(err, task) {
        console.error("task experienced an error");
      });
      q.push(comic["chapterInfo"]["list"]);
      await q.drain(function() {
        console.log("所有章节下载完毕");
        this.downloadProgressTip = `${comicTitle} - 所有章节下载完毕.`;
      });
    },
    async downloadChapterPic(item, arr, chapterData, comicInfo) {
      const self = this;
      const comicTitle = comicInfo["baseInfo"]["title"];
      const num = arr.findIndex((i) => i == item) + 1;
      await new Promise((resolve, reject) => {
        var imgUrl = self.getChapterImage(item);
        rp({
          uri: imgUrl,
          encoding: "binary",
          timeout: 60000,
        })
          .then((body) => {
            fse.ensureDirSync(
              path.resolve(
                `${userDataDir}/${comicTitle}/chapter/${chapterData["title"]}`
              )
            );
            fs.writeFileSync(
              path.resolve(
                `${userDataDir}/${comicTitle}/chapter/${chapterData["title"]}/p${num}.jpg`
              ),
              body,
              "binary"
            );
            self.downloadProgressTip = `${comicTitle} - 章节${chapterData["title"]} - 图片 - p${num}.`;
            console.log(
              `章节 - ${chapterData["title"]} - p${num} - 图片下载完成 `
            );
            resolve();
          })
          .catch((err) => {
            console.error("下载图片错误", err);
            // reject(err);
            const retry = () => {
              console.warn("准备重试", imgUrl);
            };
            async.retry(3, retry, function(err, result) {
              // do something with the result
              console.warn("重试的结果", result);
            });
            const errData =
              fse.readJsonSync(
                path.resolve(`${userDataDir}/${comicTitle}/error_chapter.json`),
                {
                  throws: false,
                }
              ) || [];
            errData.push({
              chapterTitle: chapterData["title"],
              url: imgUrl,
              num: num,
            });
            fse.writeJsonSync(
              path.resolve(`${userDataDir}/${comicTitle}/error_chapter.json`),
              errData
            );
            resolve();
          });
      });
    },
    async chapterData(chapterData = {}, comicInfo) {
      const self = this;
      await new Promise((resolve, reject) => {
        request(chapterData["url"], async function(err, res, body) {
          if (err || res["statusCode"] != 200) {
            console.error("章节链接打开错误", err);
          }
          var htmlStr = body;
          var chapterImagesStr = htmlStr
            .match(/var chapterImages =([^;]+)/g)[0]
            .replace(/var chapterImages =([^;]+)/g, "$1")
            .replace(/(\s|\n|\r|\0|\f|\t|\v|")/g, "");
          chapterPath = htmlStr
            .match(/var chapterPath =([^;]+)/g)[0]
            .replace(/var chapterPath =([^;]+)/g, "$1")
            .replace(/(\s|\n|\r|\0|\f|\t|\v|")/g, "");
          // console.log("chapterImagesStr - ", chapterImagesStr);
          // console.log("chapterPath - ", chapterPath);
          var chapterImages = self.decrypt20180904(chapterImagesStr);

          var q = async.queue(async function(item, callback) {
            await self.downloadChapterPic(
              item,
              chapterImages,
              chapterData,
              comicInfo
            );
            // console.log("章节图片 - " + item);
            callback();
          }, 5);

          q.push(chapterImages);

          await q.drain(function() {
            console.log(chapterData["title"] + "章节 - 下载完毕");
            resolve();
          });
        });
      });
    },
    async onCrawler() {
      console.log("this.comicUrl", this.comicUrl);
      if (!this.comicUrl) return;
      this.searchList = [];      
      const comicInfo = await this.comicData(this.comicUrl);
      await this.crawlerChapter(comicInfo);
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.crawler {
  min-height: 100%;
}
.search-form {
  position: absolute;
  top: -40px;
  right: 0;
  width: 50%;
  float: right;
  display: flex;
}
.search-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 10px;
  max-height: 300px;
  min-height: 100px;
  overflow-y: scroll;
  .item {
    width: 130px;
    height: 210px;
    font-size: 12px;
    margin-left: 15px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 4px;
    .title {
      font-size: 13px;
      margin-bottom: 10px;
    }
    .title,.author,.chapter{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
