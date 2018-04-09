import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },{
      path: '/home',
      component: (resolve) => require(['view/home'], resolve)
    }, {
      path: '/message',
      component: (resolve) => require(['view/message'], resolve)
    },{
      path: '/me',
      component: (resolve) => require(['view/me'], resolve),
      children: [
        {
          path: '/test',
          component: (resolve) => require(['view/test'], resolve)
        },
        {
          path: '/scroll',
          component: (resolve) => require(['view/scroll-page'], resolve)
        }
      ]
    }
  ]
})
