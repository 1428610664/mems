import request from 'common/js/request'
import {actionJson} from 'api/commonEvent'
import utils from 'common/js/utils'

export const eventMixin = {
  data(){
    return{

    }
  },
  created(){

  },
  methods: {
    _checkData(){
      let mark = true
      for(var k in this.checkData){
        if(utils[this.checkData[k].check](this.bindData[k])){
          mark = false
          this.$vux.toast.text(this.checkData[k].message, "bottom")
          continue
        }
      }
      return mark
    },
    /**
     * 事件提交
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
          request[action.type? action.type : "post"](actionJson(action.TypeId, action.id)[0], Object.assign({}, _this.bindData, action.params)).then((res) => {
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
