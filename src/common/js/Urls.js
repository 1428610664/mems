const preUrl = "http://192.168.1.100/ems"

const requestUrl = {
  login: {
    url: "/users/login",
    pre: preUrl
  }
}

export function getUrl(key, id){
  let url = requestUrl[key].pre + requestUrl[key].url
  let ref = /\{(.*?)\}/gi
  if(id){
    url = url.replace(ref, (s, t) => {
      return obj[t]
    })
  }
  return url
}
