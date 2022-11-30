import Vue from 'vue'
import Vuex from 'vuex'
import SockJS from '../utils/sockjs'
import '../utils/stomp'
import { Notification } from 'element-ui';
import { postRequest} from "../utils/api";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
    token_: '',
    name_: '',
    id_: null,
    isTea: false,
    classStart: false,
    classBeginTime: null, // 课程开始时间
    classId: null,  //当前课程Id
    courseId: null,
    courseTitle: null,
    sessions: [],//聊天记录
    users: [],//用户列表
    stomp: null,
  },
  mutations: {
    login(state, data) {
      this.state.token_ = data.token
      sessionStorage.setItem('token', data.token);
      this.state.id_ = data.id
      sessionStorage.setItem('id', data.id);
      this.state.name_ = data.name
      sessionStorage.setItem('user', data.name);
    },
    logout(state) {
      sessionStorage.clear();
      this.state.token_ = ''
      this.state.name_ = ''
      this.state.id_ = ''
      this.state.isTea = false
    },
    getSession(state) {
      let msg = new Object()
      msg.courseInstanceId = this.state.classId
      msg.startId = null
      msg.count = 15
      msg.timestamp = null
      postRequest('/api/message/getMessages',msg).then(res=>{
        if(!res.code){
          // console.log(res.data)
          state.sessions = []
          for(let i=res.data.count-1;i>=0;--i){
            let obj = res.data.messages[i]
            if(obj.userId == 17 || obj.userId == 41)
              obj.avatar = 'https://cdn.jsdelivr.net/gh/Yveltals/Picgo/avatar/0.png'
            else
              obj.avatar = 'https://cdn.jsdelivr.net/gh/Yveltals/Picgo/avatar/'+(obj.userId%6+1)+'.png'
            state.sessions.push(obj)
            //Vue.set(state.sessions1, '讨论区', res);
          }
        }else{
          console.info(res.msg)
        }
      })
    },
  },
  actions: {
    // 连接Stomp站点,实现连接服务端连接与消息订阅
    connect(context) {
      var headers = {'token': this.state.token_}
      context.state.stomp = Stomp.over(new SockJS('https://b2884t1064.oicp.vip/ems_course_session?token=' + this.state.token_));
      context.state.stomp.connect({}, success => {
        // 订阅课程实例
        context.state.stomp.subscribe("/api/session/" + this.state.classId, msg => {
          console.log(msg)
          context.commit('getSession') //获取聊天记录
        },headers)
        // context.state.stomp.subscribe("/user/" + this.state.id_ + "/receive", msg => {
          // console.log(msg)
        // },headers)
      }, error => {
        Notification.info({
          title: '系统消息',
          message: "无法与服务端建立连接，请尝试重新登陆系统~",
          position: "top-right"
        });
      })
    },
    //与Websocket服务端断开连接
    disconnect(context) {
      if (context.state.stomp != null) {
        context.state.stomp.disconnect()
        //  console.log("关闭连接~");
      }
    },
  }
})


export default store;
