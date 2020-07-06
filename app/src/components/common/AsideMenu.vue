<template>
  <div class="aside-menu" v-if="!readMode">
    <div class="item-logo">
      <img src="@/assets/images/logo.png" alt="logo" />
      <!-- <div class="logo-text">漫画Read</div> -->
    </div>
    <div class="item-group" v-for="item in menuGroup" :key="item.title">
      <div class="title">{{ item.title }}</div>
      <ul>
        <li v-for="subItem in item.list" :key="subItem.title">
          <router-link :to="subItem.link" class="link">
            <i :class="subItem.icon"></i>{{ subItem.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "AsideMenu",
  props: {},
  data() {
    return {
      menuGroup: [
        {
          title: "本地漫画",
          list: [
            {
              icon: "el-icon-monitor",
              link: "/",
              title: "添加漫画",
            },
            {
              icon: "el-icon-reading",
              link: "/list",
              title: "漫画列表",
            },
            {
              icon: "el-icon-time",
              link: "/history",
              title: "观看历史",
            },
          ],
        },
        // {
        //   title: "下载漫画",
        //   list: [
        //     {
        //       icon: "el-icon-eleme",
        //       link: "/spider",
        //       title: "漫画粉",
        //     }
        //   ],
        // }
      ],
    };
  },
  computed:{
    readMode(){
      return this.$store.state['readMode']
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.aside-menu {
  width: 160px;
  background-color: rgba(234, 229, 242, 0.75);
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 20px 20px;
  .item-logo {
    margin-top: 10px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 45px;
      max-height: auto;
      border-radius: 4px;
    }
    .logo-text {
      margin-top: 5px;
      font-size: 14px;
      color: #252525;
    }
  }
  .item-group {
    margin-bottom: 20px;
    .title {
      font-size: 15px;
      color: #999;
      margin-bottom: 5px;
    }
    .link {
      text-decoration: none;
      color: #666;
      font-size: 14px;
      &:hover {
        color: $color-link;
      }
      i {
        margin-right: 10px;
      }
      &.router-link-exact-active {
        color: $color-link;
      }
    }
    li {
      margin-top: 10px;
    }
  }
}
.menu-row {
  display: flex;
  flex-direction: column;
}
</style>
