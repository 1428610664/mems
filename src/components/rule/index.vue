<template>

  <div class="rule-wrapper">
    <div class="rule-item" v-for="(item, index) in rule">
      <div class="btn-wrapper">
        <i class="btn c1 iconfont icon-jia fz24" @click="onAdd(index)"></i>
        <i class="btn c2 iconfont icon-wuuiconsuoxiao fz24" @click="onSub(index)" v-if="index != 0"></i>
      </div>
      <rule-item :rule="item" :index="index" @on-change="itemChange" :isChange="isChange" @showTreeModel="showTreeModel"></rule-item>
    </div>

    <check-tree :search="true" ref="checkTree" @on-confirm="treeConfirm"></check-tree>

  </div>

</template>

<script>

  import RuleItem from 'components/rule-item'
  import checkTree from 'components/check-tree/all-tree'
  import utils from 'common/js/utils'

  export default {
    name: "index",
    props: {
      isChange : {
        type: Boolean,
        default: false
      },
      rule: {
        type: Array,
        default(){
          return [{type: 0, app: '', appData: [], ip: '', title: '', summary: ''}]
        }
      }
    },
    data() {
      return {
      }
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {
      onAdd(index) {
        this.rule.push({type: 0,ip: '', app: '', appData: [], title: '', summary: ''})
      },
      onSub(index) {
        if (this.rule.length > 1) this.rule.splice(index, 1)
      },
      itemChange(value, index){
        this.rule[index] = value
      },
      getData(){
        let rule = {}, app = [], ip = [], title = [], summary = []
        // 数据拼接
        for(let item of this.rule){
          if(item.type == 0){
            console.log(1111+"============" + JSON.stringify(item.appData))
            app = app.concat(item.appData)
          }else if(item.type == 10){
            if(item.ip.trim())ip.push(item.ip)
          }else if(item.type == 20){
            if(item.title.trim())title.push(item.title)
          }else if(item.type == 30){
            if(item.summary.trim())summary.push(item.summary)
          }
        }
        if(app.length > 0 ) rule.app = app
        if(ip.length > 0) rule.ip = [{"ip": ip.join(","),"opt": "包含"}]
        if(title.length > 0) rule.title = [{"title": title.join(","),"opt": "包含"}]
        if(summary.length > 0) rule.summary = [{"summary": summary.join(","),"opt": "包含"}]

        if(rule.ip && !utils.isIp(rule.ip[0].ip)){
          this.$vux.toast.text("ip输入错误", "bottom")
          return false
        }
        if(JSON.stringify(rule) == "{}"){
          this.$vux.toast.text("必须选择IP或组件", "bottom")
          return false
        }
        if(!rule.app) rule.app = []
        if(!rule.ip) rule.ip = []
        if(!rule.title) rule.title = []
        if(!rule.summary) rule.summary = []
        rule.opt = "and"
        return rule
      },

      showTreeModel(index){
        // this.$vux.toast.text("功能尚未实现", "bottom")
        this.$refs.checkTree.showTreeModel(index, this.rule[index].appData)
      },
      treeConfirm(nodesRule, index){
        console.log("nodesRule==========="+JSON.stringify(nodesRule))
        this.rule[index].app = this._parseCheckData(nodesRule)
        this.rule[index].appData = nodesRule
      },
      /**
       * 解析选中的值
       * @param data
       * @private
       */
      _parseCheckData(data){
        let objS = data, appName = "", appAggregate = [];
        if(Array.isArray(objS)){
          objS.forEach(function (v,i) {
            if(v.objName!=""&&v.objName!=null){
              appName+="["+v.appName+"]包含组件["+v.objName+"]包含ip"+"["+v.ips+"],"
            }else {
              appName+="["+v.appName+"],"
            }
          })
        }else{
          if(objS.objName!=""&&objS.objName!=null){
            appName+="["+objS.appName+"]包含组件["+objS.objName+"]包含ip"+"["+objS.ips+"]"
          }else {
            appName+="["+objS.appName+"]"
          }
        }
        appAggregate=null
        objS=null
        return appName
      }
    },
    components: {
      RuleItem,
      checkTree
    }
  }
</script>

<style scoped>

  .rule-item {
    position: relative;
    border: 1px solid #D9D9D9;
    margin: 20px 8px;
    padding: 6px 0;
  }

  .btn-wrapper {
    position: absolute;
    top: -20px;
    right: 8px;
    font-size: 0;
  }

  .btn {
    margin-right: 8px;
    display: inline-block;

  }

</style>
