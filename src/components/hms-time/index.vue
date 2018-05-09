<template>
  <div class="hms_time">
    <x-input :title="title" v-model="val" @on-change="change" @on-focus='focus' @on-blur="blur"></x-input>
    <div class="time_select" v-show="inputFocus == true">
       <ul class="time_select_item">
          <li v-for="item in options" @click="itemClick(item)">{{item}}</li>
       </ul>
    </div>
  </div>
</template>

<script>

  import {XInput,Selector ,Group} from 'vux'

  export default {
    name: "index",
    props: {
      value: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        val: this.value,
        options:this.loopTimeArray(),
        inputFocus:false
      }
    },
    watch:{
      value(val){
         this.val = val
      }
    },
    created() {
      this._getTurnUser()
    },
    methods: {
      _getTurnUser() {
      },
      change (val){
        this.$nextTick(()=>{
          this.$emit('on-change', this.val,this.title)
        })
      },
      setVal (){
        this.val = ''
      },
      focus(){
        this.inputFocus = true
      },
      blur(){
        this.$nextTick(()=>{
          this.inputFocus = false
          if(this.val == '') return
          let reg = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/g
          if(reg.test(this.val)){
            console.log("blur",this.val)
            this.$emit('on-blur', this.val,this.title)
          }else {
            this.val = ''
            this.$vux.toast.text("时间格式不合理", "center")
          }
        })
      },
      itemClick(item){
          this.val = item
      }
    },
    components: {
      XInput,
      Group,
      Selector

    }
  }
</script>

<style scoped>
  /*.hms_time{position: relative}*/
  .time_select{position: absolute; width: 50%; right: 0; z-index: 1000;}
  .time_select_item{height: 100px;overflow: auto;border: 1px #eee solid; background-color: #ffffff}
  .time_select_item li{padding-left: 15px;}
  .time_select_item li:hover{background-color: #eee}
</style>
