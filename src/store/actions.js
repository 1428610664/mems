import * as types from './mutation-types'
import {setIsLogin, setUserInfo} from 'common/js/cache'

export const loginAction = function ({commit, state}, {data}) {
  commit(types.SET_ISLOGIN, true)
  commit(types.SET_USERDATA, data)
  setIsLogin(true)
  setUserInfo(data)
}

export const logoutAction = function ({commit, state}) {
  commit(types.SET_ISLOGIN, false)
  commit(types.SET_USERDATA, null)
  setIsLogin(false)
  setUserInfo(null)
}
