<template>
  <div>
    <header>
      <div class="container main-nav-bar">
        <img :src="`./static/${address}`" class="logo" alt="" />
        <img :src="`${baseUrl}img/logo.svg`" class="logo-name" alt="" />
        <ul class="nav-bar" v-show="showMenu">
          <!-- <li v-for="(item, index) in menuList" :key="index" @mouseenter="rotStart(index)" @mouseleave="rotEnd(index)" :class="[item.isSelected ? 'selected' : '']" @click="selectMenu(item)">
            {{item.name}}
            <i class="iconfont icon-icon" :class="[item.isHover ? 'rot' : '']" v-show="item.isMenu"></i>
            <transition name="fade" key="item.id">
              <ul class="subMenu" v-show="item.isHover && item.isMenu">
                <li v-for="(i, l) in item.subMenuList" @mouseenter="changeColorStart(index, l)" @mouseleave="changeColorEnd(index, l)" :class="[i.isSelected ? 'selected' : '', i.isHover ? 'selected' : '']" @click="selectSubMenu(index, i)">{{i.name}}</li>
              </ul>
            </transition>
          </li> -->
        </ul>
        <svg-icon icon-class="github" class="github" @callback="goTogithub"></svg-icon>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="self-info">个人信息</el-dropdown-item>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: process.env.BASE_URL,
    };
  },
  props: {
    showMenu: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
    title: {
      type: String,
    },
    userName: {
      type: String,
    },
  },
  methods: {
    goTogithub() {
      location.href = 'https://github.com/james-cain';
    },
    rotStart(index) {
      this.menuList[index].isHover = true;
    },
    rotEnd(index) {
      this.menuList[index].isHover = false;
    },
    changeColorStart(parentIndex, index) {
      this.menuList[parentIndex].subMenuList[index].isHover = true;
    },
    changeColorEnd(parentIndex, index) {
      this.menuList[parentIndex].subMenuList[index].isHover = false;
    },
    /* eslint no-param-reassign: 0 */
    selectMenu(menu) {
      if (!menu.isSelected) {
        // if (!menu.isMenu) {
        //   this.menuList.forEach((e) => {
        //     e.isSelected = e.id === menu.id;
        //     if (e.subMenuList && e.subMenuList.length !== 0) {
        //       e.subMenuList.forEach((elm) => {
        //         if (elm.isSelected) {
        //           /* eslint no-param-reassign: 0 */
        //           elm.isSelected = !elm.isSelected;
        //         }
        //       });
        //     }
        //   });
        //   this.$router.push({ name: menu.path });
        // }
        location.href = menu.url;
      }
    },
    selectSubMenu(parentIndex, subMenu) {
      if (!subMenu.isSelected) {
        this.menuList.forEach((e, index) => {
          e.isSelected = parentIndex === index;
          if (e.subMenuList && e.subMenuList.length !== 0) {
            e.subMenuList.forEach((elm) => {
              elm.isSelected = parentIndex === index && subMenu.id === elm.id;
            });
          }
        });
        this.$router.push({ name: subMenu.path });
      }
    },
    handleCommand(command) {
      switch (command) {
        case 'exit':
          this.$store.dispatch('LogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
          break;
        case 'self-info':
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style>
header {
  background-color: #002140;
  border-color: #002140;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  min-width: 1000px;
}
.github {
  font-size: 22px;
  position: absolute;
  top: 14px;
  right: 100px;
  cursor: pointer;
}
ul {
  -webkit-padding-start: 0px;
  -webkit-margin-before: 0px;
  -webkit-margin-after: 0px;
}
.main-nav-bar .el-dropdown {
  position: absolute;
  top: 0;
  right: 20px;
}
.main-nav-bar .el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.main-nav-bar .el-icon-arrow-down {
  font-size: 12px;
}
.container {
  height: 48px;
  line-height: 48px;
  background-color: #003C78;
  color: #ffffff;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
}
.subMenu li {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.container > .logo {
  height: 30px;
  float: left;
}
.container > .logo-name {
  height: 30px;
  margin-left: 20px;
  float: left;
}
.container > span {
  float: left;
  margin-left: 17px;
  width: 98px;
  font-family: "PingFangHK-Regular",Arial,sans-serif,Helvetica,"Microsoft YaHei";
}
.container > ul {
  list-style: none;
  padding: 0px;
  margin: 0px;
}
.container > ul > li {
  float: left;
  cursor: pointer;
}
.container .nav-bar {
  margin: 0 80px;
  display: inline-block;
}
.nav-bar > li {
  width: 120px;
  height: 48px;
  text-align: center;
  margin-right: 8px;
}
.nav-bar li.selected {
  background-color: #00356b;
}
.nav-bar li i {
  transition: transform .3s linear;
  -webkit-transition: -webkit-transform 0.3s linear;
  display: inline-block;
}
.nav-bar li i.rot {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}
.subMenu {
  width: 100%;
  background-color: #ffffff;
  list-style: none;
  border-radius: 3px;
  z-index: 1000;
  border: solid 1px rgb(209, 219, 229);
  color: rgb(72, 87, 106);
  padding: 6px 0;
  margin-top: 3px;
}
.subMenu li {
  height: 30px;
  line-height: 30px;
}
.subMenu li.selected {
  background-color: rgb(228, 232, 241);
}
.nav-tool-bar {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
}
.nav-tool-bar li {
  padding: 0 14px;
  display: flex;
  align-items: center;
}
.nav-tool-bar li:first-child {
  padding: 0 14px 0 0;
}
.icon-user {
  margin-right: 4px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
  opacity: 0
}
@media (min-width: 1200px) {
  .container, .child-container {
    min-width: 1200px;
  }
}
</style>
