import {getUserInfo} from 'common/js/cache'
import {mapGetters} from 'vuex'

export const configMixin = {
  computed:{
    ...mapGetters([
      'servicesNumber',
      'faultsNumber',
      'eventsNumber'
    ]),
    grid(){
      return this.configJson()
    }
  },
  methods: {
    configJson() {
      let rule = getUserInfo().user.role
      let config = [
        {name: "服务请求", path: "/serviceRequest", class: 'icon-fuwuqingqiu fz24 mb1', number: this.servicesNumber},
        {name: "人工报障", path: "/faultsWarning", class: 'icon-xitongguzhang mb2', number: this.faultsNumber},
        {name: "告警事件", path: "/myEvents", class: 'icon-shijiantai mb3', number: this.eventsNumber},
        {name: "维护期", path: "/maintain", class: 'icon-navicon-xxwh mb5'},
        {name: "变更白板", path: "/change", class: 'icon-change mb4'}
      ]
      switch (rule) {
        case "2": // 二线
          return [config[0],config[2],config[3],config[4]]
        case "4": // 普通用户
          return [config[0],config[1]]
        case "5": // 服务台
          return [config[0],config[1],config[2]]
        case 'admin': // admin
          return config
        default:  // 其它
          return [config[0],config[2]]
      }
    }
  }
}
