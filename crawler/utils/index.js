/**
 * @ Author: fei.wong
 * @ Create Time: 2020-07-01 14:29:33
 * @ Modified by: fei.wong
 * @ Modified time: 2020-07-03 17:00:08
 * @ Description:
 */
const fs = require('fs');
const path = require('path');
const CryptoJS = require("./crypto");
const utils = {};

utils.getChapterImage = (item,chapterPath) => {
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
};

utils.decrypt20180904 = (chapterImages) => {
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
  // console.log("解密后的章节图片 - ", chapterImages);
  return chapterImages;
};

// 过滤ds_store文件夹
utils.filterDsFolder = (folderList) => {
  const extFolder = [".DS_Store"];
  return folderList.filter((item) => extFolder.indexOf(item) == -1);
};

// 判断是否为图片
utils.isImg = (url) => {
  const ext = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
  return ext.includes(path.extname(url))
};

module.exports = utils;
