import axios from "axios"
import {setIsLogin, setUserInfo} from 'common/js/cache'
import store from 'store/index'
import * as types from 'store/mutation-types'


axios.defaults.baseURL = 'http://192.168.1.130/ems'
const commonParams = {}
const option = {}

export default {
  ajax(url, parma, type) {
    let data = Object.assign({}, commonParams, parma)
    return new Promise((resolve, reject) => {
      axios({method: type ,url: url,params: data})
      //axios[type](url, (type.toLowerCase() == "post" ? data : {params: data}), option)
        .then((data) => {
          // 登录失效
          if (!data.data.success && data.data.data && data.data.data.TimeOut) {
            setIsLogin(false)
            setUserInfo(null)
            store.commit(types.SET_ISLOGIN, false)
            store.commit(types.SET_USERDATA, null)
          }else{
            resolve(data.data)
          }
        }).catch((error) => {
        reject(error)
      })
    })
  },
  post(url, parma) {
    return this.ajax(url, parma, "post")
  },
  get(url, parma) {
    return this.ajax(url, parma, "get")
  },
  delete(url, parma){
    return this.ajax(url, parma, "delete")
  }
}
