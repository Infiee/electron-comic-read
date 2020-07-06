### 功能介绍：

【漫画粉网站】漫画爬取，自动检测更新、丢失章节、图片并修复

### 下载npm依赖

npm i async cheerio fs-extra request lodash ora chalk -S

### 运行：

在https://www.manhuafen.com/ 网站找到想要看的漫画，修改manhuafen.js里的 COMIC_ID、COMIC_NAME，终端或cmd里运行node manhuafen.js 则可

### 默认保存路径：

crawler下的data目录