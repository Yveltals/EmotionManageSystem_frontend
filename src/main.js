import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css'; 
import store from './store/index';
import 'font-awesome/css/font-awesome.min.css'

import {postRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";

Vue.config.silent = true
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(ViewUI);
Vue.prototype.postRequest=postRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.deleteRequest=deleteRequest;

/*路由前置守卫*/
// router.beforeEach((to,from,next)=>{
//   if (to.path=="/login"||to.path=="/adminlogin"){
//     next(); //通过本次路由请求
//   }else if (to.path=="/admins/stu"&&to.path=="/admins/tea") {
//     if(!window.sessionStorage.getItem('admin')){
//       ElementUI.Message.error({message:"不具有访问权限！"});
//       next(from)
//     }
//     else next()
//   }
//   else{
//     if (window.sessionStorage.getItem('user')||window.sessionStorage.getItem('admin')){
//       next()
//     }else {
//       ElementUI.Message.error({message:"请登录后访问！"});
//       next('/login');
//     }
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
