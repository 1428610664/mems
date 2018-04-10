<style scoped>
  .p_content {
    border: 1px solid #cccccc;
    height: 200px;
    margin-top: 10px;
    overflow: auto;
    padding-left: 15px;
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
    margin-left: 17px;
    color: #8D8D8D
  }

  .tab_user_name {
    color: #00dd1c
  }
</style>
<template>
  <div>
  <tab :line-width=2 active-color='#fc378c' v-model="index">
    <tab-item class="vux-center"  v-for="(item, i) in list" :key="i">
      {{item}}
    </tab-item>
  </tab>
  <swiper v-model="index" height="100px" :show-dots="false">
    <swiper-item v-for="(item, i) in list" :key="i">
      <div v-if="i==0" class="p_content" :style="styleTabname1">
        <div v-show="opinions!=''" v-for="row in opinions">
          <div class="m-t15">
            <span class="tab_user_name">{{row.userName}}</span>
            <span class="tab_time">{{row.time.time}}</span>({{row.descs}})
            <div class="xheditor-con-div tab_summary" v-html="row.content"></div>
          </div>
        </div>
         <p v-show="opinions==''">暂无内容</p>
      </div>
      <div v-if="i==1" class="p_content" :style="styleTabname2">
        <div v-show="messages!=''" v-for="row in messages">
          <div class="m-t15">
            <span class="tab_user_name">{{row.sendUser}}</span>
            <span class="tab_time">{{row.sendTime.time}}</span>
            <div class="xheditor-con-div tab_summary" v-html="row.summary"></div>
          </div>
        </div>
        <p v-show="messages==''">暂无消息</p>
      </div>
    </swiper-item>
  </swiper>
  </div>
</template>
<script type="es6">
  import {Tab, TabItem,Swiper, SwiperItem} from 'vux'
  import {getUrl} from 'common/js/Urls'
  import request from 'common/js/request'

  export default {
    data() {
      return {
        index: 0,
        list: ['处理经过', '消息面板'],
        opinions: "",
        messages: "",
        styleTabname1: {
          height: '100px',
          position: 'relative'
        },
        styleTabname2: {
          height: '100px',
        },
      }
    },
    components: {
      Tab,
      TabItem,
      Swiper,
      SwiperItem
    },
    props: {
      id: {
        type: String,
        default: '',
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
        request.get("http://192.168.1.130/ems/events/opinion/"+this.id , {status:0}).then((res) => {
          console.log(res)
          if (res.data.rows.length == "0") {
            this.opinions = ""
          } else {
            this.opinions = res.data.rows
            this.styleTabname1.height = '200px'
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      },
      loadTasMessages() {
        request.get("http://192.168.1.130/ems/messages", {refId:this.id, status:0}).then((res) => {
          if (res.data.rows.length == "0") {
            this.messages = ""
          } else {
            this.messages = res.data.rows
            this.styleTabname2.height = "200px"
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
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
