import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
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
              path: '/myWarning',
              component: (resolve) => require(['view/my-warning'], resolve)
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
            },
          ]
        },
        {
          path: '/myEvents',
          component: (resolve) => require(['view/my-events'], resolve),
          children: [
            {
              path: '/handleEvents',
              component: (resolve) => require(['view/handle-events'], resolve),
              children: [
                {
                  path: '/turnSendevents',
                  component: (resolve) => require(['view/turn-sendevents'], resolve)
                },
                {
                  path: '/closeEvent',
                  component: (resolve) => require(['view/close-events'], resolve)
                }
              ]
            },
          ]
        },
        {
          path: '/maintain',
          component: (resolve) => require(['view/maintain'], resolve),
          children: [
            {
              path: '/addMaintain',
              component: (resolve) => require(['view/add-maintain'], resolve)
            },
            {
              path: '/maintainDetails',
              component: (resolve) => require(['view/maintain-details'], resolve)
            }
          ]
        },
        {
          path: '/change',
          component: (resolve) => require(['view/change'], resolve),
          children: [
            {
              path: '/addChange',
              component: (resolve) => require(['view/add-change'], resolve)
            },
            {
              path: '/changeDetails',
              component: (resolve) => require(['view/change-details'], resolve)
            },
            {
              path: '/changnEnd',
              component: (resolve) => require(['view/change-end'], resolve)
            }
          ]
        },
        {
          path: '/eventStatistics',
          component: (resolve) => require(['view/event-statistics'], resolve),
        },
        {
          path: '/serviceStatistics',
          component: (resolve) => require(['view/service-statistics'], resolve),
        },
        {
          path: '/faultsStatistics',
          component: (resolve) => require(['view/faults-statistics'], resolve),
        }
      ]
    }, {
      path: '/login',
      component: (resolve) => require(['view/login'], resolve)
    }, {
      path: '/message',
      component: (resolve) => require(['view/message'], resolve),
      children: [
        {
          path: '/messageDetails',
          component: (resolve) => require(['view/message-details'], resolve)
        }
      ]
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
