<template>
  <div class="read">
    <Flip></Flip>
  </div>
</template>

<script>
import Flip from "@/components/read/Flip";

export default {
  name: "Read",
  data() {
    return {
      
    };
  },
  components: {
    Flip,
  },
  methods: {
    
  },
  mounted() {
    this.$store.commit('setReadMode',true);
  },
  
};
</script>

<style scoped lang="scss">
.read {
  position: relative;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
</style>
