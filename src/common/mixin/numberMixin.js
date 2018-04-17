import request from 'common/js/request'
import {getUrl} from 'common/js/Urls'
import {mapMutations} from 'vuex'

export const numberMixin = {
  methods: {
    ...mapMutations({
      setServicesNumber: 'SET_SERVICE_NUMBER',
      setFaultsNumber: 'SET_FAULTS_NUMBER',
      setEventsNumber: 'SET_EVENTS_NUMBER'
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
    },
    getEventsNumber() {
      request.get(getUrl("eventsNumber"), {isMy:false, status: 0}).then(res => {
        if(res.success){
          this.setEventsNumber(res.data.number)
        }
      }, error => {

      })
    }
  }

}
