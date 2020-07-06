<template>
  <div class="no-data">
    暂未添加本地漫画！
    <div class="add-btn">
      <router-link to="/" class="link">
        <i class="el-icon-folder-add"></i>添加漫画
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoData",
  props: {},
  components: {},
  mounted() {},
  computed: {},
};
</script>

<style scoped lang="scss">
.no-data {
  text-align: center;
  font-size: 16px;
  margin-top: 100px;
  display: flex;
  justify-content: center;
  color: $color-text;
  .add-btn {
    margin-left: 10px;
    font-size: 13px;
    background: rgb(183, 199, 235);
    border: 1px solid #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(183, 199, 235, 0.75);
    .link {
      color: #fff;
      display: block;
      padding: 2px 8px;
    }
    i {
      margin-right: 5px;
      color: $color-icon;
    }
  }
}
</style>
