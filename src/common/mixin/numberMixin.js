import request from 'common/js/request'
import {getUrl} from 'common/js/Urls'
import {mapMutations} from 'vuex'

export const numberMixin = {
  data(){
    return {
      hz: "123"
    }
  },
  methods: {
    ...mapMutations({
      setServicesNumber: 'SET_SERVICE_NUMBER',
      setFaultsNumber: 'SET_FAULTS_NUMBER'
    }),
    getServiceNumber() {
      request.get(getUrl("servicesNumber"), {isTurn: false, status: 0}).then(res => {
        if(res.success){
          this.setServicesNumber(res.data.number)
        }
      }, error => {

      })
    },
    getFaultsNumber() {
      request.get(getUrl("faultsNumber"), {isMy:false, status: 0}).then(res => {
        if(res.success){
          this.setFaultsNumber(res.data.number)
        }
      }, error => {

      })
    }
  }

}
