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
     * 转义满意度
     * @param number
     * @returns {string}
     */
    Vue.prototype.getCacsi = function (number) {
      switch ('' + number) {
        case '10': return '不满意'
        case '20': return '一般'
        case '30': return '满意'
        default: ''
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
    /**
     * 维护期、变更白板状态转义
     * @param number
     * @returns {*}
     */
    Vue.prototype.getStateType = function (number) {
      switch (number + '') {
        case '0': return {title: '未开始', class: 'status-danger'}
        case '1': return {title: '执行中', class: 'status-success'}
        case '2': return {title: '已暂停', class: 'status-yellow'}
        case '3': return {title: '已结束', class: 'status-default'}
        case '4': return {title: '已禁用', class: 'status-default'}
        default : return {title: number, class: ''}
      }
    }

    /**
     * 优先级
     * @param number
     * @returns {*}
     */
    Vue.prototype.getSeverity = function (number) {
      switch (number + '') {
        case '0': return {title: '未分类', color: '#71ed42'}
        case '1': return {title: '极高', color: '#FF0000'}
        case '2': return {title: '高', color: '#E36C0A'}
        case '3': return {title: '中', color: '#eaea00'}
        case '4': return {title: '低', color: '#00B0F0'}
        case '5': return {title: '恢复', color: '#92D050'}
        default : return {title: '未分类', color: '#71ed42'}
      }
    }
    /**
     * 事件类别
     * @param number
     * @returns {*}
     */
    Vue.prototype.getEventType = function (number) {
      switch (number + '') {
        case '1': return '普通'
        case '2': return '故障事件（可用性）'
        case '3': return '问询'
        case '4': return '误报'
        case '5': return '驳回'
        case '6': return '屏蔽'
        case '7': return '维护期'
        default : return '普通'
      }
    }
    /**
     * 事件告警状态转义
     * @param number
     * @returns {*}
     */
    Vue.prototype.getEventStatusType = function (row) {

      if(row.status == 99){
        return {title: '已关闭', class: 'status-default'}
      }else if(row["recoverTime"]){
        // 如果【recover_time】有值，事件状态改为：已恢复
        return {title: '已恢复', class: 'status-success'}
      }else if(row["firstHandler"] && row.role == 5){
        return {title: '处理中', class: 'status-success'}
      }else{
        switch (row["suppressEscl"]+""){
          case "1":return {title: '变更', class: 'status-success'}
          case "2":return {title: '维护期', class: 'status-success'}
          case "3":return {title: '已屏蔽', class: 'status-success'}
          case "5":return {title: '误报', class: 'status-success'}
          default :{
            // 处理中的事件【handler】为空时，事件状态为：未受理
            if(row.handler == "" || row.handler == null){
              return {title: '未受理', class: 'status-danger'}
            }else{
              // 【0:未受理】【1:处理中】【5:驳回】
              switch (row.status){
                case "0":return {title: '未受理', class: 'status-danger'}
                case "5":return {title: '驳回', class: 'status-danger'}
                default: return {title: '处理中', class: 'status-success'}
              }
            }
          }
        }
      }
    }
  }
}
