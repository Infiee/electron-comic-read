/**
 * @ Author: fei.wong
 * @ Create Time: 2019-10-25 15:06:31
 * @ Modified by: fei.wong
 * @ Modified time: 2020-07-06 15:27:18
 * @ Description:  漫画粉漫画
 */
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const request = require("request");
const cheerio = require("cheerio");
const ora = require("ora");
const chalk = require("chalk");
const _ = require("lodash");
const async = require("async");
const axios = require("axios");
const { getChapterImage, decrypt20180904, isImg } = require("./utils/index");

// 设置爬取漫画ID和漫画名
const COMIC_ID = "3609";
const COMIC_NAME = "一人之下";

// 基础变量
const BASE_URL = "https://www.manhuafen.com";
const COMIC_URL = `${BASE_URL}/comic/${COMIC_ID}/`;
const BASE_SAVE_PATH = `./data/manhuafen/${COMIC_NAME}/`;

run();
async function run() {
  try {
    fs.statSync(`${BASE_SAVE_PATH}/comic.json`);
    updateComic();
  } catch (err) {
    await crawlerBaseInfo(COMIC_URL);
    await crawlerChapterInfo();
    downloadChapterPic();
  }
}

/**
 * 检查文件夹完整性
 */
function checkFile(cb) {
  const fixFileList = [];
  const chapterInfo = getChapterInfo();
  const basePath = path.resolve(BASE_SAVE_PATH);
  let chapterFolders = fs.readdirSync(basePath);
  // 判断是否为文件夹
  chapterFolders = chapterFolders.filter((item) => {
    const stat = fs.statSync(basePath + "/" + item);
    return stat.isDirectory();
  });
  chapterFolders.map((folder) => {
    // 判断章节文件夹内是否有图片
    const folderPath = basePath + "/" + folder;
    const chapterPics = fs.readdirSync(folderPath).filter(isImg);
    // if (!chapterPics.length) return;
    const chapterData = chapterInfo.find(
      (chapter) => chapter["title"] == folder
    );
    // console.log("chapterPics", folder, chapterPics, chapterData);
    const chapterTotal = chapterData["total"];
    if (chapterTotal == chapterPics.length) return;
    for (let i = 1; i <= chapterTotal; i++) {
      const tempi = "p" + i + ".jpg";
      if (chapterPics.indexOf(tempi) == -1) {
        // console.log(folder + "缺失", i);
        fixFileList.push({
          title: folder,
          url: chapterData["chapterImages"][i - 1],
          pTitle: i,
        });
      }
    }
  });
  cb && cb(fixFileList);
}

/**
 * 修复文件
 */
function fixFile() {
  return new Promise((resolve) => {
    checkFile((fixFileList) => {
      if (fixFileList.length == 0) {
        // console.log("文件完整");
        resolve();
        return;
      }
      // console.log("缺少章节图片，需要修复 -- ", fixFileList);
      let total = fixFileList.length;
      fixFileList.map((item) => {
        const imgUrl = item["url"];
        const folderName = item["title"];
        const num = item["pTitle"];
        downloadImg(imgUrl)
          .then((data) => {
            fse.outputFileSync(
              `${BASE_SAVE_PATH}/${folderName}/p${num}.jpg`,
              data
            );
          })
          .finally(() => {
            total = total - 1;
            if (total == 0) {
              resolve();
            }
          });
      });
    });
  });
}

/**
 * 检查章节完整性
 */
async function checkChapter() {
  const comicInfo = await getComicInfo();
  const chapterInfo = await getChapterInfo();
  const chapterList = comicInfo["chapterList"];
  // 重新排序
  chapterInfo.sort((a, b) => {
    const chapterTitle = chapterList.map((item) => item["title"]);
    return chapterTitle.indexOf(a["title"]) - chapterTitle.indexOf(b["title"]);
  });
  fse.writeJsonSync(
    path.resolve(`${BASE_SAVE_PATH}/chapter.json`),
    chapterInfo
  );
  const lostChapter = _.differenceWith(
    chapterList,
    chapterInfo,
    (a, b) => a["title"] == b["title"]
  );
  // console.log("updateInfo", lostChapter);
  return lostChapter;
}

async function updateComic() {
  // 更新前先检查丢失章节或图片进行修复
  const lostChapter = await checkChapter();
  await crawlerChapterInfo(lostChapter);
  await fixFile();
  // 判断是否有更新
  let updateList = await updateChapterList();
  if (updateList.length == 0) {
    console.log("已经是最新");
    return;
  }
  updateList = updateList.map((item) => item["title"]);
  const chapterInfo = await getChapterInfo();
  const filterChapter = _.filter(
    chapterInfo,
    (item) => updateList.indexOf(item["title"]) != -1
  );
  // updateList = updateList.slice(0, 3);
  // console.log("filterChapter", updateList);
  downloadChapterPic(filterChapter);
}

/**
 * 检查章节更新
 */
async function updateChapterList() {
  const comicInfo = await getComicInfo();
  let chapterList = comicInfo["chapterList"];
  let chapterTitle = chapterList.map((item) => item["title"]);
  // console.log('chapterTitle',chapterTitle)
  let dir = fs.readdirSync(`${BASE_SAVE_PATH}`);
  let diffDir = _.difference(chapterTitle, dir);
  // console.log("dir", diffDir);
  let dataList = _.filter(
    chapterList,
    (item) => diffDir.indexOf(item["title"]) != -1
  );
  // console.log("更新列表 - ", dataList);
  return dataList;
}

/**
 * 爬取基本信息
 */
async function crawlerBaseInfo(url = `${BASE_URL}/comic/1803/`) {
  const spinner = ora(chalk.green(`【爬取漫画信息】`)).start();
  const regExp = new RegExp(BASE_URL + "/comic/(.+)/", "gim");
  const comicId = url.replace(regExp, "$1");
  return await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (response["statusCode"] == 200) {
        var $ = cheerio.load(body);
        // console.log('body',response.toJSON() )
        const chapterList = [];
        const baseInfo = {
          cover: $(".comic_i_img").find("img").attr("src"),
          title: $(".comic_i_img").find("img").attr("alt"),
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
          updateTime: $(".zj_list_head_dat").eq(0).text().trim(),
        };
        $(".zj_list_con")
          .eq(0)
          .find("a")
          .each((idx, item) => {
            chapterList.push({
              title: $(item).attr("title"),
              url: `${BASE_URL}` + $(item).attr("href"),
            });
          });
        const comicInfo = {
          comicId,
          baseInfo,
          chapterList,
        };
        downloadImg(baseInfo["cover"]).then((data) => {
          fse.outputFileSync(`${BASE_SAVE_PATH}/cover.jpg`, data);
        });
        fse.ensureDirSync(path.resolve(`${BASE_SAVE_PATH}/`));
        fse.writeJsonSync(`${BASE_SAVE_PATH}/comic.json`, comicInfo);
        spinner.succeed(chalk.green(`【${COMIC_NAME}】- 漫画信息写入完成.`));
        // console.log(`${baseInfo["title"]} - 漫画信息写入完成.`);
        resolve(comicInfo);
      }
    });
  });
}

/**
 * 解析章节图片信息
 */
function crawlerChapterInfo(updateList) {
  return new Promise(async (resolve) => {
    const comicInfo = await getComicInfo();
    const chapterList = updateList || comicInfo["chapterList"];
    const q = async.queue(function (chapterData, callback) {
      chapterImages(chapterData).then(function () {
        callback();
      });
      // console.log("章节 - " + task.title);
    }, 1);
    q.error(function (err, task) {
      console.error("任务异常！", err, task);
    });
    q.push(chapterList);
    await q.drain(function () {
      ora().succeed(
        chalk.green(`【${COMIC_NAME}】- 全部解析章节图片信息 - 完成.`)
      );
      // console.log("所有章节下载完毕");
      resolve();
    });
  });
}

/**
 * 存储章节图片信息
 */
function chapterImages(chapterData = {}) {
  const comicInfo = getComicInfo();
  const chapterList = comicInfo["chapterList"];
  const spinner = ora(chalk.green(`【解析下载章节图片】`)).start();
  return new Promise((resolve, reject) => {
    // console.log('chapterData',chapterData)
    request(chapterData["url"], async function (err, res, body) {
      if (err || res["statusCode"] != 200) {
        console.error("章节链接打开错误", err);
      }
      var htmlStr = body;
      var chapterImagesStr = htmlStr
        .match(/var chapterImages =([^;]+)/g)[0]
        .replace(/var chapterImages =([^;]+)/g, "$1")
        .replace(/(\s|\n|\r|\0|\f|\t|\v|")/g, "");
      const chapterPath = htmlStr
        .match(/var chapterPath =([^;]+)/g)[0]
        .replace(/var chapterPath =([^;]+)/g, "$1")
        .replace(/(\s|\n|\r|\0|\f|\t|\v|")/g, "");
      // console.log("chapterImagesStr - ", chapterImagesStr);
      // console.log("chapterPath - ", chapterPath);
      var chapterImages = decrypt20180904(chapterImagesStr);
      // 写入章节total
      const chapterInfo =
        fse.readJsonSync(path.resolve(`${BASE_SAVE_PATH}/chapter.json`), {
          throws: false,
        }) || [];
      chapterInfo.push({
        title: chapterData["title"],
        chapterImages,
        chapterPath,
        total: chapterImages.length,
      });
      // 重新排序
      chapterInfo.sort((a, b) => {
        const chapterTitle = chapterList.map((item) => item["title"]);
        return (
          chapterTitle.indexOf(a["title"]) - chapterTitle.indexOf(b["title"])
        );
      });
      fse.writeJsonSync(
        path.resolve(`${BASE_SAVE_PATH}/chapter.json`),
        chapterInfo
      );
      spinner.succeed(
        chalk.green(
          `【${COMIC_NAME}】- ${chapterData["title"]} - 解析下载章节图片完成.`
        )
      );
      resolve();
    });
  });
}

async function downloadChapterPic(updateList) {
  const chapterInfo = updateList || (await getChapterInfo());
  // const comicTitle = comicInfo["baseInfo"]["title"];
  for (let i = 0; i < chapterInfo.length; i++) {
    const item = chapterInfo[i];
    const chapterTitle = item["title"];
    const chapterImages = item["chapterImages"];
    const chapterPath = item["chapterPath"];
    const spinner = ora(
      chalk.green(`【${COMIC_NAME}】- 开始下载 ${chapterTitle} 章节图片`)
    ).start();
    await picQueue(chapterTitle, chapterImages, chapterPath);
    spinner.succeed(
      chalk.green(`【${COMIC_NAME}】- ${chapterTitle} - 章节图片完成.`)
    );
  }
  // 章节图片队列
  async function picQueue(chapterTitle, chapterImages, chapterPath) {
    return new Promise((resolve) => {
      const q = async.queue(function (img, callback) {
        const imgUrl = getChapterImage(img, chapterPath);
        const num = chapterImages.findIndex((i) => i == img) + 1;
        downloadImg(imgUrl).then((data) => {
          fse.ensureDirSync(path.resolve(`${BASE_SAVE_PATH}/${chapterTitle}`));
          fse.outputFileSync(
            `${BASE_SAVE_PATH}/${chapterTitle}/p${num}.jpg`,
            data
          );
          callback();
        });
      }, 3);
      q.push(chapterImages);
      q.drain(function () {
        resolve();
      });
    });
  }
}

// 图片下载
function downloadImg(url) {
  // axios 默认不超时，除非服务器主动断开
  return new Promise((resolve) => {
    // buffer的形式
    axios
      .get(url, {
        responseType: "arraybuffer",
        headers: {
          Referer: "https://www.manhuafen.com/comic/",
        },
      })
      .then((res) => {
        // 返回buffer 写入文件
        // fse.outputFileSync(targetPath, res["data"]);
        resolve(res["data"]);
      });
  });
}

function getComicInfo() {
  return fse.readJsonSync(`${BASE_SAVE_PATH}/comic.json`);
}

function getChapterInfo() {
  return fse.readJsonSync(`${BASE_SAVE_PATH}/chapter.json`);
}

/**
 * 批量修改文件夹名
 */
function removep() {
  const basePath = path.resolve(BASE_SAVE_PATH);
  let chapterFolders = fs.readdirSync(basePath);
  // 判断是否为文件夹
  chapterFolders = chapterFolders.filter((item) => {
    const stat = fs.statSync(basePath + "/" + item);
    return stat.isDirectory();
  });
  chapterFolders.map((folder) => {
    const oPath = basePath + "/" + folder;
    const nFolder = folder.replace(/\(.+p\)/g,'');
    const nPath = basePath + "/" + nFolder;
    fs.rename(oPath, nPath, (err) => {
      if (err) throw err;
      console.log("Rename complete!");
    });
  });
}