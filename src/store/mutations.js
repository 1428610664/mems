import * as types from './mutation-types'

const mutations = {
  [types.SET_ISLOGIN](state, login) {
    state.isLogin = login
  },
  [types.SET_USERDATA](state, data) {
    state.userData = data
  },
  [types.SET_TEMPORARY_REQUEST](state, data) {
    state.temporaryRequest = data
  },
  [types.SET_HANDLE_REQUEST](state, data) {
    state.handleRequest = data
  },
  [types.SET_TEMPORARY_WARNING](state, data) {
    state.temporaryWarning = data
  },
  [types.SET_HANDLE_WARNING](state, data) {
    state.handleWarning = data
  }
}

export default mutations

