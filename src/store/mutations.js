import * as types from './mutation-types'

const mutations = {
  [types.SET_ISLOGIN](state, login) {
    state.isLogin = login
  },
  [types.SET_USERDATA](state, data) {
    state.userData = data
  }
}

export default mutations

