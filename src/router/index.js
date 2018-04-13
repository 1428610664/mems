import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    }, {
      path: '/home',
      component: (resolve) => require(['view/home'], resolve),
      children: [
        {
          path: '/serviceRequest',
          component: (resolve) => require(['view/service-request'], resolve),
          children: [
            {
              path: '/addRequest',
              component: (resolve) => require(['view/add-request'], resolve),
            },
            {
              path: '/handleRequest',
              component: (resolve) => require(['view/handle-request'], resolve),
              children: [
                {
                  path: '/turnSend',
                  component: (resolve) => require(['view/turn-send'], resolve)
                }
              ]
            }
          ]
        },
        {
          path: '/faultsWarning',
          component: (resolve) => require(['view/faults-warning'], resolve),
          children: [
            {
              path: '/addWarning',
              component: (resolve) => require(['view/add-warning'], resolve),
            },
            {
              path: '/handleWarning',
              component: (resolve) => require(['view/handle-warning'], resolve),
              children: [
                {
                  path: '/turnSendwarning',
                  component: (resolve) => require(['view/turn-sendwarning'], resolve)
                }
              ]
            }
          ]
        }
      ]
    }, {
      path: '/login',
      component: (resolve) => require(['view/login'], resolve)
    }, {
      path: '/message',
      component: (resolve) => require(['view/message'], resolve)
    }, {
      path: '/me',
      component: (resolve) => require(['view/me'], resolve),
      children: [
        {
          path: '/setting',
          component: (resolve) => require(['view/setting'], resolve)
        },
        {
          path: '/modifyPsw',
          component: (resolve) => require(['view/modify-psw'], resolve)
        },
        {
          path: '/delegation',
          component: (resolve) => require(['view/delegation'], resolve)
        },
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
