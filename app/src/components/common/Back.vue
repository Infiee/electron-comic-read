<template>
  <div class="back-wrapper" @click="onBackChange">
    <i class="el-icon-arrow-left"></i>{{ backText }}
  </div>
</template>

<script>
export default {
  name: "Back",
  props: {
    backText: {
      type: String,
      default: "返回",
    },
    onBack: null,
  },
  components: {},
  methods: {
    onBackChange() {
      if (this.onBack) {
        return this.onBack();
      }
      this.$router.go(-1);
    },
  },
  mounted() {},
  computed: {},
};
</script>

<style scoped lang="scss">
.back-wrapper {
  cursor: pointer;
}
</style>
