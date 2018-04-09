import {getIsLogin, getUserInfo} from 'common/js/cache'

const state = {
  isLogin : getIsLogin(),
  userData : getUserInfo(),
}

export default state
