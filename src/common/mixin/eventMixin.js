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
    submitEvent(i){
      if(!this._checkData()) return

      console.log("数据："+JSON.stringify(this.bindData))
    }
  }
}
