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
      let Parms = {}, toUser = getUserInfo().toUser
      if(getUserInfo().user.role == 4){
        Parms = {status: '0,1,2,3,100',createUser: getUserInfo().user.userName +(toUser ? ","+toUser: "")}
      }else{
        Parms = {status: '0,1,2,3,100',handler: getUserInfo().user.userName  +(toUser ? ","+toUser: "")}
      }
      request.get(getUrl("servicesNumber"), Parms).then(res => {
        if(res.success){
          this.setServicesNumber(res.data.number)
        }
      }, error => {

      })
    },
    getFaultsNumber() {
      let toUser = getUserInfo().toUser, Parms = {status: '0,1,2,3,100',handler: getUserInfo().user.userName  +(toUser ? ","+toUser: "")}
      if(getUserInfo().user.role == 4 )Parms = {status: '0,1,2,3,100',createUser: getUserInfo().user.userName  +(toUser ? ","+toUser: "")}
      request.get(getUrl("faultsNumber"), Parms).then(res => {
        if(res.success){
          this.setFaultsNumber(res.data.number)
        }
      }, error => {

      })
    },
    getEventsNumber() {
      let toUser = getUserInfo().toUser, Parms = getUserInfo().user.role == 5?  {status: '0,1',processStatus:0} :{status: '0,1,3',handler: getUserInfo().user.userName   +(toUser ? ","+toUser: "")}
      request.get(getUrl("eventsNumber"), Parms).then(res => {
        if(res.success){
          this.setEventsNumber(res.data.number)
        }
      }, error => {

      })
    }
  }

}
