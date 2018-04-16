import request from 'common/js/request'
import {getUrl} from 'common/js/Urls'

import {mapActions, mapGetters, mapMutations} from 'vuex'


export const authorizeMixin = {
  computed: {
    ...mapGetters([
      'authorize',
    ]),
  },
  methods: {
    ...mapActions([
      'logoutAction'
    ]),
    ...mapMutations({
      setAuthorize: "SET_AUTHORIZE"
    }),
    logout() {
      this.logoutAction()
    },
    cancelAuthorize() {
      request.post(getUrl("cancelAuthorize", this.authorize.data.id), {}).then(res => {
        this.$vux.toast.text(res.desc, "bottom")
        if (!res.success) {
          this.confirmAuthorize()
        } else {
          this.setAuthorize(null)
        }
      }, error => {

      })
    },
    confirmAuthorize() {
      let _this = this
      this.$vux.confirm.show({
        title: '提示',
        confirmText: '取消转授权',
        cancelText: '离开',
        content: '您在' + (new Date(this.authorize.data.createTime.time).format("yyyy-MM-dd hh:mm:ss")) + '转授权给了' + this.authorize.data.toUser + ',如需继续操作事件平台，请取消转授权!',
        onConfirm() {
          _this.cancelAuthorize()
        },
        onCancel() {
          _this.logout()
        }
      })
    }
  }
}
