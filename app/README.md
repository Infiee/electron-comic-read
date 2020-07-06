### 持久化存储

[electron-store](https://github.com/sindresorhus/electron-store)

[vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)

### 全局scss变量

[sass-resources-loader](https://github.com/shakacode/sass-resources-loader)

### 跳过puppeteer
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm i puppeteer

npm i puppeteer --ignore-scripts

[awesome-electron](https://github.com/sindresorhus/awesome-electron)

[music](https://github.com/SmallRuralDog/electron-vue-music/blob/master/src/main/index.js)

[漫画网站](https://github.com/Hentioe/mikack)


https://element.eleme.cn/#/zh-CN/component/upload


https://underscorejs.net/#uniq

https://github.com/TrevorSundberg/puppeteer-in-electron

http://nodejs.cn/api/path.html#path_path_basename_path_ext

https://www.manhuafen.com/comic/1802/


npm view 包名 versions

https://www.jianshu.com/p/3b2a1ad0041f

[关闭eslint](https://www.cnblogs.com/zhaoyun4122/p/10905830.html)

request库下载用pipe流的下载方式会出现图片下载不完全问题(服务端主动断开了连接)

https://github.com/jprichardson/node-fs-extra

### vue scoped css 作用于组件内的样式
[vue-loader](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B7%E7%94%A8%E6%9C%AC%E5%9C%B0%E5%92%8C%E5%85%A8%E5%B1%80%E6%A0%B7%E5%BC%8F)

const wrapperWidth = this.$refs['chapter-list'].clientWidth;
const rowNum = Math.round(wrapperWidth/125);

let i=0,listData = this.chapterList;
listData.map((item,idx)=>{
  const index = idx+1;
  if(index%rowNum==0){
    // console.log('ind',i,index);
    const temp = listData.slice(i,index);
    this.convertList.push({
      name: index,
      list: temp
    });
    i=index;
  }
})
if(i < listData.length){
  const lastIdx = listData.length-i;
  const lastList = listData.slice(-lastIdx);
  this.convertList.push(lastList);
}