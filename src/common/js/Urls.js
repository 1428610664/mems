const preUrl = "http://192.168.1.130/ems"

const requestUrl = {
  login: {
    url: "/users/login",
    pre: preUrl
  },
  myMessage: {
    url: "/messages/my",
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
