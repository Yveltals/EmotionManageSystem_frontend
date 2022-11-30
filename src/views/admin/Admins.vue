<template>
  <div class="index-vue">
    <!-- 侧边栏 -->
    <aside :class="asideClassName">
      <!-- logo -->
      <div class="logo-c">
        <img src="../../assets/logo.png" alt="logo" class="logo">
        <span class="side-menu" v-show="isShowAsideTitle">后台管理系统</span>
      </div>
      <!-- 菜单栏 -->
      <Menu class="side-menu" ref="asideMenu" theme="dark" width="100%" @on-select="selectMenuCallback"
      accordion :open-names="['1']" :active-name="currentPage">
        <Submenu name="1">
          <template #title>
            <Icon type="md-add-circle" />
            <span v-show="isShowAsideTitle">用户管理</span>
          </template>
          <MenuItem name="1-1"><Icon type="ios-paper" />
            <span v-show="isShowAsideTitle">学生管理</span>
          </MenuItem>
          <MenuItem name="1-2"><Icon type="md-briefcase" />
            <span v-show="isShowAsideTitle">教师管理</span>
          </MenuItem>
          <MenuItem name="1-3"><Icon type="ios-book" git pu/>
            <span v-show="isShowAsideTitle">课程管理</span>
          </MenuItem>
        </Submenu>
      </Menu>
    </aside>

    <!-- 右侧部分 -->
    <section class="sec-right">
      <!-- 头部 -->
      <div class="top-c">
        <header>
          <div class="h-left">
            <div class="pointer" @click="isShrinkAside" title="收缩/展开">
              <Icon type="ios-apps" />
            </div>
          </div>
          <div class="h-right">
            <!-- 用户头像 -->
            <div class="user-img-c">
              <img src="../../assets/avatar.png">
            </div>
            <!-- 下拉菜单 -->
            <Dropdown trigger="click" @on-click="userOperate" @on-visible-change="showArrow">
              <div class="pointer">
                <span>{{userName}}</span>
                <Icon v-show="arrowDown" type="md-arrow-dropdown"/>
                <Icon v-show="arrowUp" type="md-arrow-dropup"/>
              </div>
              <DropdownMenu slot="list">
                <DropdownItem name="1">个人信息</DropdownItem>
                <DropdownItem name="2">退出登陆</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>
      </div>
      <!-- 页面主体 -->
      <div class="main-content">
        <div class="view-c">
          <router-view/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'Admins',
  data() {
    return {
      currentPage: '', // 当前显示页面
      arrowUp: false, // 用户详情向上箭头
      arrowDown: true, // 用户详情向下箭头
      isShowAsideTitle: true, // 是否展示侧边栏内容
      main: null, // 页面主要内容区域
      asideClassName: 'aside-big', // 控制侧边栏宽度变化
      asideArrowIcons: [], // 缓存侧边栏箭头图标 收缩时用
      userName: '',
      userImg: '',
    }
  },
  created(){
    //在页面加载时读取sessionStorage里的状态信息
		if (sessionStorage.getItem("state") ) {
			this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
		}
		//在页面刷新时将vuex里的最新信息保存到sessionStorage里
		window.addEventListener("beforeunload",()=>{
			sessionStorage.setItem("state",JSON.stringify(this.$store.state))
		})
  },
  mounted() {
    this.userName = window.sessionStorage.getItem("admin")
    this.main = document.querySelector('.sec-right')
    this.asideArrowIcons = document.querySelectorAll('aside .ivu-icon-ios-arrow-down')
    // 监听窗口大小 自动收缩侧边栏
    this.monitorWindowSize()
  },
  watch: {
    $route(to) {
      if(to.name == 'Stu')
        this.currentPage = '1-1'
      else if(to.name =='Tea')
        this.currentPage = '1-2'
      else
        this.currentPage = '1-3'
    },
  },
  methods: {
    monitorWindowSize() {
      let w = document.documentElement.clientWidth || document.body.clientWidth
      if (w < 1300) {
        this.shrinkAside()
      }
      window.onresize=()=>{ // 可视窗口宽度太小 自动收缩侧边栏
        if (w < 1300 && this.isShowAsideTitle
          && w > (document.documentElement.clientWidth || document.body.clientWidth)) {
          this.shrinkAside()
        }
        w = document.documentElement.clientWidth || document.body.clientWidth
      }
    },
    // 选择菜单回调函数
    selectMenuCallback(name) {
      if(name=='1-1') 
        this.$router.push("/admins/stu")
      else if(name=='1-2')
        this.$router.push("/admins/tea")
      else
        this.$router.push("/admins/course") 
    },
    // 用户操作
    userOperate(name) {
      switch (name) {
        case '1':
          alert('admin info')
            break
        case '2':
          this.logout()
          break
      }
    },
    //退出登录并清除token
    logout(){
      this.$confirm('您是否退出登录?', '系统提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
        this.$message.success("退出登录");
        this.$store.commit('logout')
        this.$router.push("/")
			})
    },
    // 控制用户三角箭头显示状态
    showArrow(flag) {
      this.arrowUp = flag
      this.arrowDown = !flag
    },
    // 判断
    isShrinkAside() {
      if (this.isShowAsideTitle) {
        this.shrinkAside()
      } else {
        this.expandAside()
      }
    },
    // 收缩
    shrinkAside() {
      for (let i = 0, len = this.asideArrowIcons.length; i < len; i++) {
        this.asideArrowIcons[i].style.display = 'none'
      }

      this.isShowAsideTitle = false
      this.openMenus = []
      this.$nextTick(() => {
        if (this.$refs.asideMenu) {
          this.$refs.asideMenu.updateOpened()
        }
      })

      setTimeout(() => {
        this.asideClassName = ''
        this.main.style.marginLeft = '90px'
      }, 0)
    },
    // 展开
    expandAside() {
      setTimeout(() => {
        this.isShowAsideTitle = true
        for (let i = 0, len = this.asideArrowIcons.length; i < len; i++) {
          this.asideArrowIcons[i].style.display = 'block'
        }

        this.openMenus = this.menuCache
        if (this.$refs.asideMenu) {
          this.$refs.asideMenu.updateOpened()
        }
      }, 200)
      this.asideClassName = 'aside-big'
      this.main.style.marginLeft = '220px'
    }
  },
}
</script>

<style scoped>
html{
  height: 100%;
}
.side-menu{
  font-size: 20px;
  margin-bottom: 0.5rem;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  line-height: 1.5;
  color: inherit;
}
.side-menu span{
  font-size: 18px;
}
.index-vue {
  height: 100%;
  color: #666;
}
/* 侧边栏 */
aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 90px;
    background: #20222A;
    height: 100%;
    transition: width .3s;
    overflow: auto;
}
.logo-c {
    display: flex;
    align-items: center;
    color: rgba(255,255,255,.8);
    font-size: 16px;
    margin: 20px 0;
    justify-content: center;
}
.logo {
    width: 40px;
    margin-right: 10px;
}
.aside-big {
    width: 220px;
}
/* 主体页面 */
.sec-right {
    height: 100%;
    margin-left: 220px;
    transition: margin-left .3s;
    overflow: hidden;;
    background: #f3f7fd;
}
/* 主体页面头部 */
header {
    height: 50px;
    border-bottom: none;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 40px;
    padding-left: 10px;
    font-size: 14px;
}
header .ivu-icon {
    font-size: 24px;
}
.refresh-c {
    margin: 0 30px;
    cursor: pointer;
}
.h-right {
    display: flex;
    align-items: center;
}
.h-left {
    display: flex;
    align-items: center;
}
.user-img-c img {
    width: 100%;
}
.user-img-c {
    width: 34px;
    height: 34px;
    background: #ddd;
    border-radius: 50%;
    margin: 0 15px;
    overflow: hidden;
}
a {
    color: #666;
    transition: none;
}
/* 主要内容区域 */
.main-content {
    height: calc(100% - 88px);
    overflow: hidden;
}
.view-c {
    position: relative;
    height: 100%;
    overflow: hidden;
}
.pointer {
    cursor: pointer;
}
.pointer span{
    font-size:20px
}
</style>
<style>
#app{
  height: 100%
}
</style>