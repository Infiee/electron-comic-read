<template>
  <div class="item">
    <div class="cover">
      <img :src="'local-resource://' + source.path" :alt="source.name" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ReadItem",
  props: {
    index: {
      // index of current item
      type: Number,
    },
    source: {
      // here is: {uid: 'unique_1', text: 'abc'}
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.cover {
  img {
    width: 100%;
    max-height: auto;
  }
}
</style>
