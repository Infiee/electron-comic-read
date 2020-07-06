/**
 * electron-store
 */

import Vue from "vue";
import Vuex from "vuex";
import { remote } from "electron";
import _ from "underscore";
import createPersistedState from "vuex-persistedstate";
import path from "path";

const { dialog } = remote;
const options = {
  title: "选择文件夹",
  defaultPath: "",
  buttonLabel: "打开",
  properties: ["openDirectory"],
};
const storage = window.localStorage;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    folderList: [],
    openFolder: {
      // name: '',
      // cover: '',
      // chapterList: []
    },
    readHis: {},
    // {
    //   name: '',
    //   cover: '',
    //   chapter: {
    //     name: '',
    //     pid: ''
    //   }
    // }
    // ],
    readMode: false,
  },
  mutations: {
    saveFolder(state, folderPath) {
      console.log("commit【saveFolder】-", folderPath);
      const comic = {
        name: path.basename(folderPath),
        path: folderPath,
        cover: folderPath + "/cover.jpg",
      };
      state.folderList.push(comic);
      // const concatData = state.folderList.concat(payload);
      state["folderList"] = _.uniq(state.folderList, (item) => item.path);
    },
    clearFolderList(state) {
      state["folderList"] = [];
      state["readHis"] = {};
      state["openFolder"] = {};
    },
    deleteFolderList(state, hisItem) {
      state["folderList"] = _.filter(
        state.folderList,
        (item) => item.path != hisItem.path
      );
      for (let k in state["openFolder"]) {
        if (state["openFolder"][k] == hisItem["name"]) {
          state["openFolder"] = {};
        }
      }
    },
    openFolder(state, folderItem = {}) {
      console.log("commit【openFolder】-", folderItem);
      state["openFolder"] = folderItem;
    },
    saveHis(state, hisItem = {}) {
      // console.log("hisItem", hisItem);
      for (let key in hisItem) {
        state["readHis"][key] = {};
        state["readHis"][key] = hisItem[key];
      }
      // console.log('state',state)
      // state['readHis'] = state['readHis'].concat(hisItem);
    },
    clearHis(state) {
      state["readHis"] = {};
    },
    setReadMode(state, payload = false) {
      state["readMode"] = payload;
    },
  },
  actions: {
    async saveFolder({ commit }) {
      const folder = await dialog.showOpenDialog(options);
      if (folder["canceled"]) return;
      console.log("action【saveFolder】-", folder);
      commit("saveFolder", folder["filePaths"][0]);
    },
  },
  modules: {},
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => {
          return storage.getItem(key);
        },
        setItem: (key, value) => {
          return storage.setItem(key, value);
        },
        removeItem: (key) => {
          return storage.removeItem(key);
        },
      },
      getState(key, storage, value) {
        try {
          return (value = storage.getItem(key)) && value !== "undefined"
            ? JSON.parse(value)
            : undefined;
        } catch (err) {
          console.log("获取缓存失败:", err);
        }
        return undefined;
      },
      setState(key, state, storage) {
        return storage.setItem(key, JSON.stringify(state));
      },
    }),
  ],
});
