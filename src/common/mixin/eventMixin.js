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
    /**
     * 事件提交
     * @param i
     */
    submitEvent(i){


      console.log("数据："+JSON.stringify(this.bindData))
    }
  }
}
