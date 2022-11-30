<template>
  <div class="login">
    <div class="page-holder">
      <div class="row">
        <div class="mb">
          <div><img src="../../assets/login.png" alt="" class="img"></div>
        </div>
        <div class="px">
          <h1 class="text">The Best Emotion</h1>
          <h2 style="color:#66696d;">情绪监测管理系统</h2>
          <el-form style="margin-top: 40px;" ref="loginForm" :rules="rules" :model="loginForm" label-width="60px">
            <el-form-item label="账号:" prop="username">
              <el-input style="width:300px" type="text" v-model="loginForm.username" auto-complete="off"
                placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input style="width:300px" type="password" v-model="loginForm.password" auto-complete="off"
                placeholder="请输入密码"></el-input>
            </el-form-item>
            <div style="padding-left:10px">
              <el-radio v-model="radio" label="1">学生/教师登录</el-radio>
              <el-radio v-model="radio" label="2">管理员登录</el-radio>
            </div>
            <div style="margin-top:20px;">
              <el-button type="primary" style="margin-left:10px;width:58%" @click="submitLogin">登录</el-button>
            </div>
            <div style="width:370px">
              <Divider><span style="font-size:15px;color:rgb(170,170,170)">其它方式登录</span></Divider>
            </div>
            <Row style="margin-top:-10px">
                <Col style="margin-left:10px" span="4"><img src="../../assets/phone.png" alt="" class="icon"></Col>
                <Col span="4"><img src="../../assets/qq.png" alt="" class="icon"></Col>
                <Col span="4"><img src="../../assets/wechat.png" alt="" class="icon"></Col>
            </Row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      radio: '1',
      loginAdmin: false,
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username:[{required:true,message:'请输入学/工号',trigger:'blur'}],
        password:[{required:true,message: '请输入密码',trigger:'blur'}],
      },
    }
  },
  methods: {
    userLogin() {
      console.log(this.loginForm)
      // let data = { 'id': 1, 'name': 'Zekrom', 'token': '211111' }
      // this.$store.commit('login', data)
      // this.$store.state.isTea = false
      // this.$router.replace("/index");
      // return
      this.postRequest('/api/login', this.loginForm).then(res => {
        if (!res.code) {
          this.$message.success(res.msg);
          //保存当前用户到vuex
          if (this.loginForm.username.indexOf("SA") < 0) {
            this.$store.state.isTea = true
          } else {
            this.$store.state.isTea = false
          }
          this.$store.commit('login', res.data)
          let path = this.$route.query.redirect;
          this.$router.replace((path == '/' || path == undefined) ? "/index" : path);
        }
        else {
          console.info(res.msg)
          this.$message.error("账号或密码错误！");
        }
      })
    },
    adminLogin() {
      console.log(this.loginForm)
      // let data = { 'id': 0, 'name': '管理员', 'token': 'wqhsisdhoo' }
      // sessionStorage.setItem('admin', data.name);
      // this.$router.replace("/admins/stu");
      // return

      this.postRequest('/api/login', this.loginForm).then(res => {
        if (!res.code) {
          this.$message.success(res.msg);
          this.$store.commit('login', res.data)
          window.sessionStorage.setItem("admin", res.data.name);
          let path = this.$route.query.redirect;
          this.$router.replace((path == '/' || path == undefined) ? "/admins/stu" : path);
        }
        else {
          console.info(res.msg)
          this.$message.error("账号或密码错误！");
        }
      })
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.radio == '1') {
            this.userLogin()
          } else {
            this.adminLogin()
          }
        } else {
          this.$message.error("账号和密码不能为空！");
          return false;
        }
      })
    }
  },
}
</script>



<style scoped>
.icon {
  cursor: pointer;
  width: 40px;
  height: 40px;
}
.page-holder {
  overflow-x: hidden;
  min-height: calc(100vh - 72px);
  display: flex !important;
  align-items: center !important;
}

.row {
  display: flex;
  flex-wrap: wrap;
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
  align-items: center !important;
}

.mb {
  width: 100%;
  margin-left: auto !important;
  margin-right: 40px;
  flex: 0 0 40%;
  max-width: 40%;
  margin-bottom: 3rem !important;
  margin-bottom: 0 !important;
}

.px {
  flex: 0 0 40%;
  max-width: 40%;
}

.text {
  color: #4680ff;
  font-size: 0.9rem !important;
  margin-bottom: 3px !important;
}

.img {
  max-width: 85%;
  height: auto;
}

.login {
  background-color: aliceblue;
  height: 100%
}

h1,
h2 {
  margin-bottom: 0.5rem;
  font-family: "Poppins", sans-serif;
  font-weight: 800;
  line-height: 1.2;
  color: inherit;
}

h1 {
  font-size: 2.25rem;
}

h2 {
  font-size: 1.8rem;
}
</style>