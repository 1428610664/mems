<template>

  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">维护期详情</x-header>
      <div class="wrapper-content" :class="FlowActions.length ? '' : 'bom'">
        <group label-width="5em" label-margin-right="2em" label-align="right">

          <x-input title="维护期名称" :readonly="true" v-model="bindData.cname"></x-input>
          <x-textarea title="描述" v-model="bindData.cdesc" :show-counter="false" :rows="1" autosize></x-textarea>
          <x-input title="维护期单号" :readonly="true" v-model="bindData.cid"></x-input>
          <div class="hr"></div>
          <div class="hz-cell"><span class="label c4">状态</span><span :class="getStateType(bindData.status).class">{{getStateType(bindData.status).title}}</span></div>
          <x-input title="创建时间" :readonly="true" v-model="bindData.createTime"></x-input>
          <x-input title="创建人" :readonly="true" v-model="bindData.createUser"></x-input>
          <x-input title="维护周期" :readonly="true" v-model="winType"></x-input>
          <x-input title="维护开始时间" :readonly="true" v-model="bindData.beginTime"></x-input>
          <x-input title="维护结束时间" :readonly="true" v-model="bindData.endTime"></x-input>
          <x-input title="开始时间" v-if="bindData.winType != 0" :readonly="true" v-model="bindData.loopStartTime"></x-input>
          <x-input title="结束时间" v-if="bindData.winType != 0" :readonly="true" v-model="bindData.loopEndTime"></x-input>
        </group>
        <div>
          <div class="cell-title c4 fz14"> 维护期规则</div>
          <div v-if="ip.length" style="padding: 10px 15px">{{ipText}}</div>
          <v-tree ref="tree2" v-if="appTree.length" :data='appTree'/>
        </div>
      </div>
      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>

</template>

<script>

  import {XHeader, Group, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import SelectDay from 'components/select-day'
  import datetime from 'components/datetime'
  import {getUrl} from 'common/js/Urls'
  import utils from 'common/js/utils'
  import SysAppUtils from 'common/js/SysAppUtils'
  import {mapGetters} from 'vuex'

  export default {
    name: "index",
    data() {
      return {
        winType: "",
        appTree: [],
        ip: [],

        bindData: {
          cname: '',             // 维护期名称
          cdesc: '',             // 内容
          cid: '',               // 单号
          status: '',           // 状态
          createTime: '',      // 创建时间
          createUser: '',      // 创建人
          winType: '',             // 维护周期
          beginTime: '',       // 维护开始时间
          endTime: '',         // 维护结束时间
          loopStartTime: '',  // 开始时间
          loopEndTime: '',    // 结束时间
        }
      }
    },
    computed: {
      ...mapGetters([
        'maintain',
      ]),
      FlowActions() {
        let actions = []
        if (this.bindData.status == 0) {
          actions = [// 修改、删除、禁用
            {TypeId: 0, FlowActionName: "修改"},
            {TypeId: 1, FlowActionName: "删除"},
            {TypeId: 1, FlowActionName: "禁用"}
          ]
        }else if(this.bindData.status == 1){
          actions = [
            {TypeId: 1, FlowActionName: "禁用"}
          ]
        }
        return actions
      },
      ipText(){
        let str = "ip地址包含："
        for( let i = 0, ilen = this.ip.length; i < ilen; i++){
          str += this.ip[i].ip + ","
        }
        return str.substring(0, str.length - 1)
      }
    },
    created() {
      this.init()

    },
    methods: {
      footerEvent(action) {
        console.log(JSON.stringify(action))

        // 禁用POST /changes/{cid}/update  status:4   cid:201804190008
        // 删除DELETE /changes/{cid}    cid:201804190009
      },
      init() {
        if(!this.maintain){
          history.go(-1)
          return
        }

        let arr = ["createTime", "beginTime", "endTime"]
        for (let k in this.bindData) {
          if(arr.indexOf(k) > -1){
            if(k == "beginTime" || k == "endTime"){
              this.bindData[k] = new Date(this.maintain[k].time).format(this.maintain.winType != 0 ? "yyyy-MM-dd" : "yyyy-MM-dd hh:mm:ss")
            }else{
              this.bindData[k] = new Date(this.maintain[k].time).format("yyyy-MM-dd hh:mm:ss")
            }
          }else{
            this.bindData[k] = this.maintain[k]
          }
          this.winType = this.getWinType(this.maintain.winType) + "维护期"
        }
        // 赋值tree树控件
        console.log(this.maintain.rule)
        this.appTree = this._getTreeDate(JSON.parse(this.maintain.rule).app)
        this.ip = JSON.parse(this.maintain.rule).ip
      },
      /**
       * 解析app数据为Tree数据
       * @param tempArr
       * @returns {Array}
       * @private
       */
      _getTreeDate(tempArr){
        let zNodes =[];
        let _arrSys=SysAppUtils.screenSys(tempArr,"sys");//提取系统
        let  _assembly=SysAppUtils.screenSys(tempArr,"assembly");//提取组件
        _assembly=SysAppUtils.screenCom(tempArr,_assembly);//组件,集群
        _arrSys=SysAppUtils.mergeSys(_arrSys,_assembly);//组件,系统合并
        _arrSys.forEach(function (v,i) {
          let _zNodes=SysAppUtils.loadText(v,i);
          _zNodes.forEach(function (v, item) {
            zNodes.push(JSON.parse(v));
          });
        });
        return zNodes
      },
      _getIP(){

      }
    },
    components: {
      commFooter,
      datetime,
      SelectDay,

      XHeader,
      Group,
      XTextarea,
      XInput,
      Selector
    }
  }
</script>

<style scoped>


  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    overflow-y: auto;
  }

  .wrapper-content {
    position: absolute;
    top: 46px;
    bottom: 45px;
    overflow: auto;
    width: 100%;
  }
  .wrapper-content.bom{
    bottom: 0;
  }

  .cell-title{
    padding: 10px 15px;
  }

</style>
