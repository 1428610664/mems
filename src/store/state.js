import {getIsLogin, getUserInfo} from 'common/js/cache'

const state = {
  isLogin : getIsLogin(),
  userData : getUserInfo(),

  temporaryRequest: null,   // 服务请求暂存item数据
  handleRequest: null,      // 服务请求处理item数据
}

export default state
