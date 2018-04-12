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
</style>
<template>
  <div class="tab_div">
    <tab :line-width=2 active-color='#fc378c' v-model="index">
      <tab-item class="vux-center"  v-for="(item, i) in list" :key="i">
        {{item}}({{numberMsg['key'+i]}})
      </tab-item>
    </tab>
    <swiper v-model="index" height="180px" :show-dots="false">
      <swiper-item v-for="(item, i) in list" :key="i">
        <div v-if="i==0" class="p_content">
          <div v-show="opinions!=''" v-for="row in opinions">
            <div class="m-t15 fz12">
              <span class="tab_user_name fz12">{{row.userName}}</span>
              <span class="tab_time fz12">{{new Date(row.time.time).format("yyyy-MM-dd hh:mm:ss")}}</span>({{row.descs}})
              <div class="xheditor-con-div tab_summary fz12" v-html="row.content"></div>
            </div>
          </div>
           <p class="fz12" v-show="opinions==''">暂无内容</p>
        </div>
        <div v-if="i==1" class="p_content">
          <div v-show="messages!=''" v-for="row in messages">
            <div class="m-t15 fz12">
              <span class="tab_user_name fz12">{{row.sendUser}}</span>
              <span class="tab_time fz12">{{new Date(row.sendTime.time).format("yyyy-MM-dd hh:mm:ss")}}</span>
              <div class="xheditor-con-div tab_summary fz12" v-html="row.summary"></div>
            </div>
          </div>
          <p class="fz12" v-show="messages==''">暂无消息</p>
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
        numberMsg:{
          key0:0,
          key1:0,
        }
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
        request.get(getUrl('opinion',this.id), {status:0}).then((res) => {
          this.numberMsg.key0 = res.data.rows.length
          if (res.data.rows.length == "0") {
            this.opinions = ""
          } else {
            this.opinions = res.data.rows
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      },
      loadTasMessages() {
        request.get(getUrl('messages'), {refId:this.id, status:0}).then((res) => {
          this.numberMsg.key1 = res.data.rows.length
          if (res.data.rows.length == "0") {
            this.messages = ""
          } else {
            this.messages = res.data.rows
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
