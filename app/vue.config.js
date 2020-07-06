/**
 * @ Author: fei.wong
 * @ Create Time: 2020-06-08 10:38:36
 * @ Modified by: fei.wong
 * @ Modified time: 2020-06-11 11:42:55
 * @ Description:
 * 
 * electron build 文档：
 * https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#table-of-contents
 * 
 * electron build配置：
 * https://www.electron.build/configuration/configuration
 * 
 */

module.exports = {
  // vue配置
  // 关闭eslint
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
  },
  // 关闭eslint
  lintOnSave: false,
  chainWebpack: config => {
    // 添加scss全局变量支持
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          resources: './src/assets/styles/base.scss',
          // Or array of paths
          // resources: ['@/assets/styles/variable.scss']
        })
        .end()
    })
  },
  pluginOptions: {
    electronBuilder: {
      // 开启node fs功能
      nodeIntegration: true,
      // enableRemoteModule: true,
      builderOptions: {
        "appId": "com.electron.comic",
        "productName": "electron漫画阅读器"
      }
    }
  }
}