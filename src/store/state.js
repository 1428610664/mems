import {getIsLogin, getUserInfo} from 'common/js/cache'

const state = {
  isLogin : getIsLogin(),
  userData : getUserInfo(),
  authorize: null,          // 授权数据

  servicesNumber: 0,         // 服务请求首页number
  faultsNumber: 0,           // 人工报障首页number

  temporaryRequest: null,   // 服务请求暂存item数据
  handleRequest: null,      // 服务请求处理item数据

  temporaryWarning: null,   //人工报障暂存item数据
  handleWarning: null,      //人工报障处理item数据
}

export default state
