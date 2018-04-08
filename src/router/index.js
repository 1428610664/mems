import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/page1'
    },{
      path: '/page1',
      component: (resolve) => require(['view/page1'], resolve)
    }, {
      path: '/page2',
      component: (resolve) => require(['view/page2'], resolve)
    }, {
      path: '/page3',
      component: (resolve) => require(['view/page3'], resolve)
    }, {
      path: '/page4',
      component: (resolve) => require(['view/page4'], resolve),
      children: [
        {
          path: '/test',
          component: (resolve) => require(['view/test'], resolve)
        }
      ]
    }
  ]
})
Router.prototype.goBack = function() {
  this.isBack = true
  window.history.go(-1)
}
