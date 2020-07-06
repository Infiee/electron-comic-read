<template>
  <div class="comic-container">
    <!-- 打开文件夹 -->
    <div class="open-folder" @click="openLocalFolder">
      <i class="el-icon-folder-add"></i>
      <span>添加本地漫画文件夹</span>
    </div>
    <!-- 打开历史 -->
    <div class="folder-his" v-if="folderList.length > 0">
      <div class="header">
        <h3 class="title">漫画历史</h3>
        <div class="clear-btn" @click="clearHis">
          <i class="el-icon-delete"></i>清空历史
        </div>
      </div>
      <ul class="his-list">
        <li v-for="item in folderList" :key="item.name" @click="onOpen(item)">
          <div class="title">
            <i class="el-icon-folder-checked"></i>{{ item.name }}
          </div>
          <div class="delete-btn" @click.stop="deleteHis(item)">
            <i class="el-icon-close"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { openFolder } from "@/utils";

export default {
  name: "AddComic",
  components: {},
  data() {
    return {
      folderHisList: [],
      chapterList: [],
    };
  },
  methods: {
    openLocalFolder() {
      this.$store.dispatch("saveFolder");
    },
    clearHis() {
      this.$confirm("是否清空历史记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.commit("clearFolderList");
        this.$message({
          type: "success",
          message: "清空成功!",
        });
      });
    },
    deleteHis(item) {
      this.$store.commit("deleteFolderList", item);
    },
    onOpen(item) {
      openFolder(item).then((chapterList) => {
        this.chapterList = chapterList;
        this.$router.push("/chapter-list");
      });
    },
  },
  mounted() {},
  computed: {
    folderList() {
      return this.$store.state.folderList;
    },
  },
};
</script>

<style scoped lang="scss">
.comic-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
.open-folder {
  margin-top: 100px;
  width: 280px;
  height: 140px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #fbfdff;
  border-radius: 6px;
  color: #606266;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  i {
    font-size: 40px;
    margin-bottom: 15px;
    color: #8c939d;
  }
}
.folder-his {
  margin-top: 25px;
  padding-top: 15px;
  color: #606266;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
  }
  h3.title {
    font-size: 16px;
    font-weight: normal;
    i {
      margin-right: 5px;
      color: $color-icon;
    }
  }
  .clear-btn {
    font-size: 13px;
    background: rgb(183, 199, 235);
    padding: 5px 15px;
    border-radius: 15px;
    border: 1px solid #fff;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(183, 199, 235, 0.75);
    i {
      margin-right: 5px;
      color: $color-icon;
    }
  }
  .his-list {
    max-height: 300px;
    overflow-y: scroll;
    padding-right: 20px;
    margin-right: -20px;
    // overflow: hidden;
    width: 600px;
    li {
      font-size: 14px;
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      &:first-child {
        margin-top: 0;
      }
      .title {
        cursor: pointer;
        max-width: 300px;
        @include ellipsis;
        &:hover {
          color: $color-link;
        }
        i {
          margin-right: 5px;
          font-size: 16px;
          color: $color-icon;
        }
      }
      .delete-btn {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        margin: -5px;
        font-size: 16px;
        &:hover {
          color: $color-link;
        }
      }
    }
  }
}
</style>
