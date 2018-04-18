export default {
  install(Vue, options) {
    /**
     * 转义用户状态
     * @param number
     * @returns {string}
     */
    Vue.prototype.getUserStatus = function (number) {
      switch ('' + number) {
        case '0':
          return '不可用'
        case '1':
          return '可用'
        default:
          return number
      }
    }
    /**
     * 转义满意度
     * @param number
     * @returns {string}
     */
    Vue.prototype.getCacsi = function (number) {
      switch ('' + number) {
        case '10':
          return '不满意'
        case '20':
          return '一般'
        case '30':
          return '满意'
        default:
          ''
      }
    }
    /**
     * 转义用户类型
     * @param number
     * @returns {string}
     */
    Vue.prototype.getUserType = function (number) {
      switch ('' + number) {
        case '1':
          return 'CMDB'
        case '2':
          return 'EMS'
        default:
          return number
      }
    }
    /**
     *
     * 转义用户职责
     * @param number
     * @returns {*}
     */
    Vue.prototype.getUserRole = function (number) {
      switch (number + '') {
        case '1':
          return '一线'
        case '2':
          return '二线'
        case '3':
          return '开发'
        case '4':
          return '普通用户'
        case '5':
          return '服务台'
        case '6':
          return '事件经理'
        case '100':
          return '管理员'
        default :
          return number
      }
    }
    /**
     * 转义消息类别，并返回指定颜色class
     * @param number
     * @returns {*}
     */
    Vue.prototype.getMessgeType = function (number) {
      switch (number + '') {
        case '1':
          return {title: '事件', class: 'item-wrapper-red'}
        case '2':
          return {title: '报障', class: 'item-wrapper-red'}
        case '3':
          return {title: '服务请求', class: 'item-wrapper-blue'}
        default :
          return {title: number, class: ''}
      }
    }
    /**
     * 报障、服务请求状态转义
     * @param number
     * @returns {*}
     */
    Vue.prototype.getStatusType = function (number) {
      switch (number + '') {
        case '0':
          return {title: '未受理', class: 'status-danger'}
        case '1':
          return {title: '处理中', class: 'status-success'}
        case '2':
          return {title: '被驳回', class: 'status-yellow'}
        case '3':
          return {title: '待评价', class: 'status-yellow'}
        case '4':
          return {title: '已取消', class: 'status-success'}
        case '99':
          return {title: '已关闭', class: 'status-default'}
        case '100':
          return {title: '暂存', class: 'status-danger'}
        default :
          return {title: number, class: ''}
      }
    }
    /**
     * 维护期、变更白板状态转义
     * @param number
     * @returns {*}
     */
    Vue.prototype.getStateType = function (number) {
      switch (number + '') {
        case '0':
          return {title: '未开始', class: 'status-danger'}
        case '1':
          return {title: '执行中', class: 'status-success'}
        case '2':
          return {title: '已暂停', class: 'status-yellow'}
        case '3':
          return {title: '已结束', class: 'status-default'}
        case '4':
          return {title: '已禁用', class: 'status-default'}
        default :
          return {title: number, class: ''}
      }
    }

    /**
     * 优先级
     * @param number
     * @returns {*}
     */
    Vue.prototype.getSeverity = function (number) {
      switch (number + '') {
        case '0':
          return {title: '未分类', color: '#71ed42'}
        case '1':
          return {title: '极高', color: '#FF0000'}
        case '2':
          return {title: '高', color: '#E36C0A'}
        case '3':
          return {title: '中', color: '#eaea00'}
        case '4':
          return {title: '低', color: '#00B0F0'}
        case '5':
          return {title: '恢复', color: '#92D050'}
        default :
          return {title: '未分类', color: '#71ed42'}
      }
    }
    /**
     * 事件类别
     * @param number
     * @returns {*}
     */
    Vue.prototype.getEventType = function (number) {
      switch (number + '') {
        case '1':
          return '普通'
        case '2':
          return '故障事件（可用性）'
        case '3':
          return '问询'
        case '4':
          return '误报'
        case '5':
          return '驳回'
        case '6':
          return '屏蔽'
        case '7':
          return '维护期'
        default :
          return '普通'
      }
    }

    /**
     * 获取天[1,2,3... 31]
     * @returns {Array}
     */
    Vue.prototype.monthArray = function () {
      let arr = []
      for (let i = 1; i < 32; i++) {
        arr.push(i)
      }
      return arr
    }
    /**
     * 获取时点["00:00", "00:30','01:00'...]
     * @returns {Array}
     */
    Vue.prototype.loopTimeArray = function () {
      let arr = []
      for (let i = 0; i < 24; i++) {
        arr.push(i < 10 ? "0" + i + ":00" : i + ":00")
        arr.push(i < 10 ? "0" + i + ":30" : i + ":30")
      }
      return arr
    }
    Vue.prototype.weekArray = function () {
      return [{key: "1", value: '星期一'}, {key: "2", value: '星期二'},{key: "3", value: '星期三'},{key: "4", value: '星期四'},{key: "5", value: '星期五'},{key: "6", value: '星期六'},{key: "0", value: '星期天'}]
    }


    /**
     * 获取时点["00:00", "00:30','01:00'...]
     * @returns {Array}
     */
    Vue.prototype.loopTimeArray = function () {
      let arr = []
      for (let i = 0; i < 24; i++) {
        arr.push(i < 10 ? "0" + i + ":00" : i + ":00")
        arr.push(i < 10 ? "0" + i + ":30" : i + ":30")
      }
      return arr
    }
    /**
     * 获取天[1,2,3... 31]
     * @returns {Array}
     */
    Vue.prototype.monthArray = function () {
      let arr = []
      for (let i = 1; i < 32; i++) {
        arr.push(i)
      }
      return arr
    }
    Vue.prototype.weekArray = function () {
      return [{key: "1", value: '星期一'}, {key: "2", value: '星期二'},{key: "3", value: '星期三'},{key: "4", value: '星期四'},{key: "5", value: '星期五'},{key: "6", value: '星期六'},{key: "0", value: '星期天'}]
    }

  }
}
