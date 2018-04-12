const preUrl = ""

const requestUrl = {
  // 登录
  login: {
    url: "/users/login",
    pre: preUrl
  },
  users: {
    url: "/users",
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
  // 人工报障
  faultsWarning: {
    url: "/faults",
    pre: preUrl
  },
  // 消息面板
  messages: {
    url: "/messages",
    pre: preUrl
  },
  // 处理经过
  opinion: {
    url: "/events/opinion/{id}",
    pre: preUrl
  },
  // 转派用户
  turnUser: {
    url: "/users/turnUser",
    pre: preUrl
  },
  // 服务请求首页number
  servicesNumber: {
    url: "/services/number",
    pre: preUrl
  },
  // 人工报障首页number
  faultsNumber: {
    url: "/faults/number",
    pre: preUrl
  }
}

export function getUrl(key, id){
  let url = requestUrl[key].url
  let ref = /\{(.*?)\}/gi
  if(id){
    url = url.replace(ref,id)
  }
  return url
}
