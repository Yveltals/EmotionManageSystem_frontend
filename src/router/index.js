import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/front/Login'
import Index from '../views/front/Index'
import NotFound from '../views/front/NotFound'
import Admins from '../views/admin/Admins'
import Stu from '../views/admin/Stu'
import Tea from '../views/admin/Tea'
import Course from '../views/admin/Course'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden:true
  },
  {
    path:'/index',
    name:'Index',
    component:Index,
    hidden:true
  },
  {
    path:'/admins',
    name:'Admins',
    component:Admins,
    hidden:true,
    children: [
      {
        path: 'stu',
        name: 'Stu',
        component: Stu
      },
      {
        path: 'tea',
        name: 'Tea',
        component: Tea
      },
      {
        path: 'course',
        name: 'Course',
        component: Course
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  },
]
//解决重复访问路由地址报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const router = new VueRouter({
  routes,
  mode: 'history' //fuck xxx
})

export default router
