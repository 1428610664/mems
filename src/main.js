import Vue from 'vue'
import 'common/js/common'
import publicUtils from 'common/js/publicUtils'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
import App from './App'
import store from 'store'
import eruda from 'eruda'
import router from './router'
import 'common/styles/common.css'
import  { ToastPlugin,ConfirmPlugin,LoadingPlugin  } from 'vux'
import echarts from 'echarts'
import VTree from 'components/vue-tree'

Vue.use(VTree)
Vue.prototype.$echarts = echarts

Vue.use(VueRouter)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(publicUtils)


// // 调试 正式环境去除
// eruda.init()


Vue.config.productionTip = false

// 点击事件300毫秒延迟
FastClick.attach(document.body)
// 懒加载图片
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('common/images/logo.png'),
  loading:require('common/images/logo.png'),
  attempt: 1
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
