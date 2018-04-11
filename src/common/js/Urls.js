const preUrl = "http://192.168.1.130/ems"

const requestUrl = {
  // 登录
  login: {
    url: "/users/login",
    pre: preUrl
  },
  // 我的消息
  myMessage: {
    url: "/messages/my",
    pre: preUrl
  },
  // 服务请求
  serviceRequest: {
    url: "/services",
    pre: preUrl
  },
  // 系统分类
  appType: {
    url: "/ips/findAppType",
    pre: preUrl
  },
  // 所属分类
  appName: {
    url: "/ips/findAppNameByType",
    pre: preUrl
  },
  // 人工报障
  faultsWarning: {
    url: "/faults",
    pre: preUrl
  },
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
