<template>
  <div>
    <divider>{{title}}</divider>
    <div style="padding: 6px 15px">
      <checker v-model="cacsi" default-item-class="list-item" selected-item-class="item-selected">
        <checker-item :value="item" v-for="(item, index) in evalArray" :key="index">{{item.value}}</checker-item>
      </checker>
    </div>
    <x-textarea v-model="evaluate" :show-counter="false" :rows="5" placeholder="请输入其他意见..."></x-textarea>
  </div>
</template>

<script>

  import {XTextarea, Divider, Checker, CheckerItem} from 'vux'
  import utils from 'common/js/utils'

  export default {
    name: "index",
    props: {
      title: {
        type: String,
        default: '对本次请求解决是否满意'
      },
    },
    data() {
      return {
        cacsi: {key: 30, value: '满意'},
        evaluate: '',
        evalArray: [{key: 30, value: '满意'},{key: 20, value: '一般'},{key: 10, value: '不满意'},]
      }
    },
    created() {
    },
    methods: {
      getEvaluate(){

        if(utils.isEmpty(this.cacsi.key)){
          this.$vux.toast.text("请选择满意度", "bottom")
          return false
        }
        if(utils.isEmpty(this.evaluate)){
          this.$vux.toast.text("请填写其他意见", "bottom")
          return false
        }
        return {cacsi: this.cacsi, evaluate: this.evaluate}
      }
    },
    components: {
      XTextarea,
      Divider,
      Checker,
      CheckerItem
    }
  }
</script>

<style scoped>

  .list-item {
    min-width: 90px;
    height: 30px;
    padding: 0 5px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: 0 5px 5px 0;
  }

  .item-selected {
    background: #3D5C99;
    color: #fff;
    border: 1px solid #3D5C99;
  }


</style>
