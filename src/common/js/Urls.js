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
  // 转授权
  authorize: {
    url: "/authorize",
    pre: preUrl
  },
  // 取消转授权
  cancelAuthorize: {
    url: "/authorize/{id}",
    pre: preUrl
  },
  // 获取授权给别人的数据
  authorizeToUser: {
    url: "/authorize/toUser",
    pre: preUrl
  },
  // 修改密码
  updatePsw: {
    url: "/users/updatePwd",
    pre: preUrl
  },
  // 我的消息
  myMessage: {
    url: "/messages/my",
    pre: preUrl
  },
  // 消息
  message: {
    url: "/messages",
    pre: preUrl
  },
  // 服务请求
  serviceRequest: {
    url: "/services",
    pre: preUrl
  },
  serviceOpinion: {
    url: "/services/opinion/{id}",
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
  // 所属分类
  component: {
    url: "/ips/findComponent",
    pre: preUrl
  },
  // 树数据
  findTree: {
    url: "/ips/findTree",
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
  },
  // 事件告警首页number
  eventsNumber: {
    url: "/events/number",
    pre: preUrl
  },
  // 事件告警
  events: {
    url: "/events",
    pre: preUrl
  },
  //所有事件告警
  history: {
    url: "events/history",
    pre: preUrl
  },
  // 维护期
  changes: {
    url: "/changes",
    pre: preUrl
  },
  //查询配置
  obtainConfig:{
    url: '/config/rule',
    pre: preUrl
  },
  //事件分类统计报表
  eventType:{
    url: '/serviceWall/eventType',
    pre: preUrl
  } ,
  //报障分类统计报表
  faultType:{
    url: '/serviceWall/faultType',
    pre: preUrl
  },
  //服务请求分类统计报表
  serviceType:{
    url: '/serviceWall/serviceType',
    pre: preUrl
  },
  //事件kpi
  eventKpi:{
    url: '/serviceWall/eventKpi',
    pre: preUrl
  },
  //报障kpi
  faultKpi:{
    url: '/serviceWall/faultKpi',
    pre: preUrl
  },
  //请求kpi
  serviceKpi:{
    url: '/serviceWall/serviceKpi',
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
