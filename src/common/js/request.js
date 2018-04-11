import axios from "axios"
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
          resolve(data.data)
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
