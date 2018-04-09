export default {
  install (Vue, options) {
    /**
     * 转义用户状态
     * @param number
     * @returns {string}
     */
    Vue.prototype.getUserStatus = function (number) {
       switch ('' + number) {
         case '0': return '不可用'
         case '1': return '可用'
         default: return number
       }
    }
    /**
     * 转义用户类型
     * @param number
     * @returns {string}
     */
    Vue.prototype.getUserType = function (number) {
      switch ('' + number) {
        case '1': return 'CMDB'
        case '2': return 'EMS'
        default: return number
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
        case '1': return '一线'
        case '2': return '二线'
        case '3': return '开发'
        case '4': return '普通用户'
        case '5': return '服务台'
        case '6': return '事件经理'
        case '100': return '管理员'
        default : return number
      }
      }
    /**
     * 转义消息类别，并返回指定颜色class
     * @param number
     * @returns {*}
     */
    Vue.prototype.getMessgeType = function (number) {
      switch (number + '') {
        case '1': return {title: '事件', class: 'item-wrapper-red'}
        case '2': return {title: '报障', class: 'item-wrapper-red'}
        case '3': return {title: '服务请求', class: 'item-wrapper-blue'}
        default : return {title: number, class: ''}
      }
      }
    /**
     * 报障、服务请求状态转义
     * @param number
     * @returns {*}
     */
    Vue.prototype.getStatusType = function (number) {
      switch (number + '') {
        case '0': return {title: '未受理', class: 'status-danger'}
        case '1': return {title: '处理中', class: 'status-success'}
        case '2': return {title: '被驳回', class: 'status-yellow'}
        case '3': return {title: '待评价', class: 'status-yellow'}
        case '4': return {title: '已取消', class: 'status-success'}
        case '99': return {title: '已关闭', class: 'status-default'}
        case '100': return {title: '暂存', class: 'status-danger'}
        default : return {title: number, class: ''}
      }
    }
  }
}
