import fs from "fs";
import path, { resolve } from "path";
import prettyBytes from "pretty-bytes";
import fse from "fs-extra";
import store from "@/store";

// 判断是否为图片
const ext = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
export const isImg = (url) => ext.includes(path.extname(url));

// 过滤ds_store文件夹
const extFolder = [".DS_Store"];
export const filterFolder = (folderList) =>
  folderList.filter((item) => extFolder.indexOf(item) == -1);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 * fileDisplay(filePath);
 * var filePath = path.resolve("./data/亚人");
 */
export const calcFolderSize = (filePath) => {
  var size = 0;
  const fileDisplay = function(filePath) {
    // var folders = fs.readdirSync(filePath);
    // console.log("folders", folders);
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function(err, files) {
      if (err) {
        console.warn(err);
      } else {
        //遍历读取到的文件列表
        files.forEach(function(filename) {
          //获取当前文件的绝对路径
          var filedir = path.join(filePath, filename);
          //根据文件路径获取文件信息，返回一个fs.Stats对象
          fs.stat(filedir, function(eror, stats) {
            if (eror) {
              console.warn("获取文件stats失败");
            } else {
              var isFile = stats.isFile(); //是文件
              var isDir = stats.isDirectory(); //是文件夹
              if (isFile) {
                // console.log(filedir);
                size += stats["size"];
                console.log("文件夹大小：", prettyBytes(size));
              }
              if (isDir) {
                // console.log("isDir", filedir);
                fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
              }
            }
          });
        });
      }
    });
  };
  fileDisplay(filePath);
};

export const openFolder = (item) => {
  console.log("item", item);
  return new Promise((resolve,reject) => {
    const chapterList = [];
    const folderItem = item["path"];
    const comicInfo = fse.readJsonSync(
      path.join(folderItem) + "/comic.json"
    );
    const chapterListData = comicInfo['chapterList'];
    console.log("章节数据 - ", chapterListData);
    fs.readdir(folderItem, (err, folders) => {
      if (err) {
        this.$message.error("获取漫画章节目录失败!");
        reject();
        return;
      }
      folders = filterFolder(folders);
      // console.log("folders", folderItem);
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
        chapterList[chapterIdx] = {
          cover: path.join(chapterDir, chapterPics[0]),
          name: item,
          chapterPics: chapterPics.sort((a, b) => {
            const tempa = a.replace(/(\D)/g, ""),
              tempb = b.replace(/(\D)/g, "");
            return tempa - tempb;
          }),
        };
      });
      store.commit("openFolder", {
        ...item,
        chapterList,
      });
      resolve(chapterList);
    });
  });
};
