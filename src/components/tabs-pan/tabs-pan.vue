<style scoped>
  .tab_div{
    padding: 2px;
  }
  .p_content {
    border: 1px solid #cccccc;
    height: 150px !important;
    overflow: auto;
    margin-top: 15px;
    padding: 1px;
    text-align: left;
  }

  .p_content img {
    max-width: 350px;
    max-height: 320px;
  }

  .tab_summary {
    margin-top: 4px;
    font-size: 12px;
    color: #333333
  }

  .tab_time {
    margin-left: 5px;
    color: #8D8D8D
  }

  .tab_user_name {
    color: #00dd1c
  }
  .msg_content{ position: relative}
  .send_msg {position: absolute; bottom:4px; right: 2px}
  .send_btn {line-height:20px; padding: 5px; border: none; border-radius: 5px;}
</style>
<template>
  <div class="tab_div">
    <tab :line-width=2 active-color='#fc378c' v-model="index">
      <tab-item class="vux-center"  v-for="(item, i) in list" :key="i">
        {{item.name}}({{numberMsg['key'+i]}})
      </tab-item>
    </tab>
    <div v-show="index == 0">
      <div  class="p_content">
        <div v-show="opinions!=''" v-for="row in opinions">
          <div class="m-t15 fz12">
            <span class="tab_user_name fz12">{{row.userName}}</span>
            <span class="tab_time fz12">{{new Date(row.time.time).format("yyyy-MM-dd hh:mm:ss")}}</span><span class="c4">&nbsp;&nbsp;({{row.descs}})</span>
            <div class="editor_summary tab_summary fz12" v-html="getFormatText(row.content)"></div>
          </div>
        </div>
        <p class="fz12" v-show="opinions==''">暂无内容</p>
      </div>
      <div v-show="showComments">
        <html5-editor :height="120"  ref="opinionsContent"></html5-editor>
      </div>
    </div>

    <div v-show="index == 1">
      <div class="p_content">
        <div v-show="messages!=''" v-for="row in messages">
          <div class="m-t15 fz12">
            <span class="tab_user_name fz12">{{row.sendUser}}</span>
            <span class="tab_time fz12">{{new Date(row.sendTime.time).format("yyyy-MM-dd hh:mm:ss")}}</span>
            <div class="editor_messages tab_summary fz12" v-html="getFormatText(row.message)"></div>
          </div>
        </div>
        <p class="fz12" v-show="messages==''">暂无消息</p>
      </div>
      <div v-show="showMsg" class="msg_content">
         <at-editor :height="120" ref="msgContent"></at-editor>
        <!--<edit-box placeholder="请输入消息内容" ref="msgContent" @on-enter="sendMsg"></edit-box>-->
        <div class="send_msg">
          <button class="send_btn b1 c fz14" @click="sendMsg">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="es6">
  import {Tab, TabItem} from 'vux'
  import {getUrl} from 'common/js/Urls'
  import {down} from 'common/js/H5Utils'
  import request from 'common/js/request'
  import html5Editor from 'components/html5-editor/index'
  import atEditor from 'components/html5-editor/atEditor'
  import editBox from 'components/edit-box/edit-box'

  export default {
    data() {
      return {
        index: 0,
        list: [{name:'处理经过',type:1}, {name:'消息面板',type:1}],
        opinions: "",
        messages: "",
        numberMsg:{
          key0:0,
          key1:0,
        }
      }
    },
    components: {
      editBox,
      html5Editor,
      atEditor,

      Tab,
      TabItem
    },
    props: {
      id: {
        type: String,
        default: '',
      },
      opinionUrl: {
        type: String,
        default: '',
      },
      messagesUrl: {
        type: String,
        default: '',
      },
      showComments:{
        type:Boolean,
        default: false
      },
      showMsg:{
        type:Boolean,
        default: false
      },
      paramsMsg:{
        type:Object,
        default: null
      }
    },
    watch: {
      id(id) {
        this.loadTasOpinions()
        this.loadTasMessages()
      }
    },
    methods: {
      loadTasOpinions() {
        request.get(this.opinionUrl ? this.opinionUrl : getUrl('opinion',this.id), {status:0}).then((res) => {
          this.numberMsg.key0 = res.data.rows.length
          if (res.data.rows.length == "0") {
            this.opinions = ""
          } else {
            this.opinions = res.data.rows
            this.$nextTick(()=>{
              this.bindAClick(document.querySelectorAll('.tab_div .editor_summary a'))
            })
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      },
      loadTasMessages() {
        request.get(this.messagesUrl ? this.messagesUrl : getUrl('messages'), {refId:this.id, status:0}).then((res) => {
          this.numberMsg.key1 = res.data.rows.length
          if (res.data.rows.length == "0") {
            this.messages = ""
          } else {
            this.messages = res.data.rows
            this.$nextTick(()=>{
              this.bindAClick(document.querySelectorAll('.tab_div .editor_messages a'))
            })
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      },
      getOpinionVal () {
        if(this.showComments) return this.$refs.opinionsContent.getContentText()
        else  return ''
      },
      getMsgVal () {
        if(this.showMsg) return this.$refs.msgContent.getContentText()
        else  return ''
      },
      getAtUser () {
        if(this.showMsg) return this.$refs.msgContent.getAtUser()
        else  return ''
      },
      refreshMsg() {
        this.loadTasOpinions()
        this.loadTasMessages()
      },
      sendMsg () {
        if(this.$refs.msgContent.getContentText() == '') {
          this.$vux.toast.text("请填写消息内容", "bottom")
          return
        }
        request.post(getUrl('messages'), Object.assign({},this.paramsMsg,{message:this.$refs.msgContent.getContentText()})).then((res) => {
           if(res.success){
             this.$refs.msgContent.reset()
             this.loadTasMessages()
           }else {
             this.$vux.toast.text("发送消息失败", "bottom")
           }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      },
      bindAClick (damo) {
        if (damo != null && damo.length !== 0) {
          damo.forEach((item)=>{
            if((item.target && item.target == "_blank" )){
              if(item.href && item.href.split("/ems/")[0] != process.env.API && item.href.split("/ems/")[1].split("/xheditor/")[0] == 'files' ){
                item.href = process.env.API + "/ems/" + item.href.split("/ems/")[1]
                // const  _html = item.innerHTML
                // item.innerHTML =  "<i class=\"fa fa-download\" aria-hidden=\"true\"></i>&nbsp;" + item.innerHTML
              }
            }
            item.onclick = ()=>{
              if( item.href.split("/ems/")[1].split("/xheditor/")[0] == 'files' || (item.class && item.class =='file_link') || (item.target && item.target == "_blank" )){
                // console.log(item.href.split("/ems/"))
                // let _url =  item.href
                // if(item.href.split("/ems/")[0] != process.env.API ){
                //   _url = process.env.API + "/ems/" + item.href.split("/ems/")[1]
                // }
                console.log(item.href)
                 down(item.href)
              }
              return false
            }
          })
        }
      }
    },
    beforeCreate() {
      this.$nextTick(() => {
        this.loadTasOpinions()
        this.loadTasMessages()
      })
    }
  }
</script>
