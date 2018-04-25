import request from 'common/js/request'
import {actionJson} from 'api/commonEvent'
import utils from 'common/js/utils'

const commonMixin = {
  methods: {
    /**
     * 验证参数
     * @returns {boolean}
     * @private
     */
    _checkData(){
      let mark = true
      for(var k in this.checkData){
        if(utils[this.checkData[k].check](this.bindData[k])){
          mark = false
          this.$vux.toast.text(this.checkData[k].message, "bottom")
          break
        }
      }
      return mark
    }
  }
}

/**
 * 添加请求事件提交
 * @type {{methods: {_checkData(): *, submitEvent(*): undefined}}}
 */
export const addRequestMixin = {
  mixins: [commonMixin],
  methods: {
    /**添加请求事件提交
     * 提交
     * @param i
     */
    submitEvent(action){
      if(!this._checkData()) return
      console.log(JSON.stringify(Object.assign({}, this.bindData, action.params)))
      let _this = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确认'+action.FlowActionName+'？',
        onConfirm () {
          _this.$vux.loading.show({text: '数据提交中...'})
          request[action.type ? action.type : "post"](actionJson(action.TypeId, action.id)[0], Object.assign({}, _this.bindData, action.params)).then((res) => {
            _this.$vux.loading.hide()
            if(res.success)window.history.back()
            _this.$vux.toast.text(res.desc, "bottom")
          }, (error) => {
            _this.$vux.loading.hide()
            console.log("error ： "+JSON.stringify(error))
          })
        }
      })
    }
  }
}

/**
 * 处理服务请求事件提交
 * @type {{mixins: *[], methods: {submitEvent(*): undefined}}}
 */
export const  handleRequestMixin = {
  mixins: [commonMixin],
  methods: {
    submitEvent(action){
      let _this = this
      if(actionJson(action.TypeId, action.id)[2] == 1){
        this.$vux.confirm.show({
          title: '提示',
          content: '确认'+action.FlowActionName+'？',
          onConfirm () {
            _this.$vux.loading.show({text: '数据提交中...'})
            request[action.type ? action.type : "post"](actionJson(action.TypeId, action.id)[0], (action.params ? action.params : {})).then((res) => {
              _this.$vux.loading.hide()
              if(res.success)window.history.back()
              _this.$vux.toast.text(res.desc, "bottom")
            }, (error) => {
              _this.$vux.loading.hide()
              console.log("error ： "+JSON.stringify(error))
            })
          }
        })
      }else{
        _this.$vux.toast.text(action.FlowActionName, "bottom")
        if(action.TypeId == 3){ // 转派
          this.$router.push({path: "/turnSend",query:{id: this.$route.query.id, type: "request"}})
          return
        }
        if(!this._checkData()) return
        console.log(JSON.stringify(Object.assign({}, this.bindData, action.params)))
        this.$vux.confirm.show({
          title: '提示',
          content: '确认'+action.FlowActionName+'？',
          onConfirm () {
            _this.$vux.loading.show({text: '数据提交中...'})
            request[action.type ? action.type : "post"](actionJson(action.TypeId, action.id)[0], Object.assign({}, _this.bindData, action.params)).then((res) => {
              _this.$vux.loading.hide()
              if(res.success)window.history.back()
              _this.$vux.toast.text(res.desc, "bottom")
            }, (error) => {
              _this.$vux.loading.hide()
              console.log("error ： "+JSON.stringify(error))
            })
          }
        })
      }
    }
  }
}

/**
 * 报障提交
 * @type {{mixins: *[], methods: {submitEvent(*): undefined}}}
 */
export const faultsMixin = {
  mixins: [commonMixin],
  methods: {
    /**
     * 事件提交
     * @param i
     */
    submitEvent(action){
      let _this = this
      if(actionJson(action.TypeId, action.id)[2] == 1){ //不需要验证非空
        this.$vux.confirm.show({
          title: '提示',
          content: '确认'+action.FlowActionName+'？',
          onConfirm () {
            _this.$vux.loading.show({text: '数据提交中...'})
            request[action.type ? action.type : "post"](actionJson(action.TypeId, action.id)[0],Object.assign({}, _this.bindData, action.params,
              action.FlowActionName=='再次提交'? {id: action.id,status:0}:{}
            ) ).then((res) => {
              _this.$vux.loading.hide()
              if(res.success)window.history.back()
              _this.$vux.toast.text(res.desc, "bottom")
            }, (error) => {
              _this.$vux.loading.hide()
              console.log("error ： "+JSON.stringify(error))
            })
          }
        })
      }else {
        _this.$vux.toast.text(action.FlowActionName, "bottom")

        if(action.TypeId == 14){ // 转派
          this.$router.push({path: "/turnSendwarning",query:{id: this.$route.query.id,type: "",row:Object.assign({}, this.bindData, action.params)}})
          return
        }
        if(!this._checkData()) return
        this.$vux.confirm.show({
          title: '提示',
          content: '确认'+action.FlowActionName+'？',
          onConfirm () {
            _this.$vux.loading.show({text: '数据提交中...'})
            request[action.type ? action.type : "post"](actionJson(action.TypeId, action.id)[0],Object.assign({}, _this.bindData, action.params,
              action.FlowActionName=='再次提交'? {id: action.id,status:0}:{},
              action.TypeId== 19? {cacsi: _this.cacsiKey,evaluate:_this.evaluate}:{}  //提交评价
            ) ).then((res) => {
              _this.$vux.loading.hide()
              if(res.success)window.history.back()
              _this.$vux.toast.text(res.desc, "bottom")
            }, (error) => {
              _this.$vux.loading.hide()
              console.log("error ： "+JSON.stringify(error))
            })
          }
        })
      }
    }
  }
}
/**
 * 事件提交
 * @type {{mixins: *[], methods: {submitEvent(*): undefined}}}
 */
export const eventsMixin = {
  mixins: [commonMixin],
  methods: {
    /**
     * 事件提交
     * @param i
     */
    submitEvent(action){
      let _this = this
      if(actionJson(action.TypeId, action.id)[2] == 1){ //不需要验证非空
        this.$vux.confirm.show({
          title: '提示',
          content: '确认'+action.FlowActionName+'？',
          onConfirm () {
            _this.$vux.loading.show({text: '数据提交中...'})
            request[action.type ? action.type : "post"](actionJson(action.TypeId, action.id)[0],Object.assign({}, _this.bindData, action.params,
              action.FlowActionName=='再次提交'? {id: action.id,status:0}:{},
              action.TypeId== 19? {cacsi: _this.cacsiKey,evaluate:_this.evaluate}:{}  //提交评价
            ) ).then((res) => {
              _this.$vux.loading.hide()
              if(res.success)window.history.back()
              _this.$vux.toast.text(res.desc, "bottom")
            }, (error) => {
              _this.$vux.loading.hide()
              console.log("error ： "+JSON.stringify(error))
            })
          }
        })
      }else {
        _this.$vux.toast.text(action.FlowActionName, "bottom")
        if(action.TypeId == 26){ // 转派
           this.$router.push({path: "/turnSendevents",query:{id: action.id,type: "",row:Object.assign({}, this.bindData)}})
          return
        }
        if(action.TypeId == 30) {
          this.$router.push({path: "/closeEvent",query:{id: action.id,type: "",row:Object.assign({}, this.bindData)}})
          return
        }
        if(!this._checkData()) return
        this.$vux.confirm.show({
          title: '提示',
          content: '确认'+action.FlowActionName+'？',
          onConfirm () {
            _this.$vux.loading.show({text: '数据提交中...'})
            request[action.type ? action.type : "post"](actionJson(action.TypeId, action.id)[0],Object.assign({}, _this.bindData) ).then((res) => {
              _this.$vux.loading.hide()
              if(res.success)window.history.back()
              _this.$vux.toast.text(res.desc, "bottom")
            }, (error) => {
              _this.$vux.loading.hide()
              console.log("error ： "+JSON.stringify(error))
            })
          }
        })
      }
    }
  }
}

/**
 * 处理维护、变更事件提交
 * @type {{mixins: *[], methods: {}}}
 */
export const maintainMixin = {
  mixins: [commonMixin],
  methods: {
    submitEvent(action){
      console.log(JSON.stringify(action.params))
      let _this = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确认'+action.FlowActionName+'？',
        onConfirm () {
          _this.$vux.loading.show({text: '数据提交中...'})
          request[action.type ? action.type : "post"](actionJson(action.TypeId, action.id)[0], action.params).then((res) => {
            _this.$vux.loading.hide()
            if(res.success)window.history.back()
            _this.$vux.toast.text(res.desc, "bottom")
          }, (error) => {
            _this.$vux.loading.hide()
            console.log("error ： "+JSON.stringify(error))
          })
        }
      })
    }
  }
}
