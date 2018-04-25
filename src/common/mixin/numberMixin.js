import request from 'common/js/request'
import {getUrl} from 'common/js/Urls'
import {mapMutations} from 'vuex'
import {getUserInfo} from 'common/js/cache'

export const numberMixin = {
  methods: {
    ...mapMutations({
      setServicesNumber: 'SET_SERVICE_NUMBER',
      setFaultsNumber: 'SET_FAULTS_NUMBER',
      setEventsNumber: 'SET_EVENTS_NUMBER'
    }),
    getServiceNumber() {
      let Parms = {}
      if(getUserInfo().user.role == 4){
        Parms = {status: '0,1,2,3,100',createUser: getUserInfo().user.userName}
      }else{
        Parms = {status: '0,1,2,3,100',handler: getUserInfo().user.userName }
      }
      request.get(getUrl("servicesNumber"), Parms).then(res => {
        if(res.success){
          this.setServicesNumber(res.data.number)
        }
      }, error => {

      })
    },
    getFaultsNumber() {
      let Parms ={status: '0,1,2,3,100',handler: getUserInfo().user.userName }
      if(getUserInfo().user.role == 4 )Parms = {status: '0,1,2,3,100',createUser: getUserInfo().user.userName}
      request.get(getUrl("faultsNumber"), Parms).then(res => {
        if(res.success){
          this.setFaultsNumber(res.data.number)
        }
      }, error => {

      })
    },
    getEventsNumber() {
      let Parms = getUserInfo().user.role == 5?  {status: '0,1',isTurn:false,processStatus:0} :{status: '0,1',isTurn: true,passUser: getUserInfo().user.userName,isPass:false}
      request.get(getUrl("eventsNumber"), Parms).then(res => {
        if(res.success){
          this.setEventsNumber(res.data.number)
        }
      }, error => {

      })
    }
  }

}
