<template>
  <div>
    <div class="top_bar">
          <!--<div class="top_bar_item" @click="msg">-->
             <!--<span>@</span>-->
          <!--</div>-->

          <!--<div class="top_bar_item" @click="msg">-->
            <!--<span>上传</span>-->
            <!--<div>-->
            <!--<input type="file" multiple="" :accept="accept" class="xheFile" size="13" name="filedata">-->
            <!--</div>-->
          <!--</div>-->
     </div>
     <div class="edit_content">
       <textarea class="edit_area" :placeholder="placeholder" v-model="areaValue" rows="5"></textarea>
       <!--<textarea class="edit_area" :placeholder="placeholder" v-model="areaValue" rows="5" @on-enter="onEnter"></textarea>-->
     </div>
  </div>
</template>

<script>

  import {Checklist, XButton} from 'vux'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    data() {
      return {
        areaValue: this.value
      }
    },
    props: {
      value:{ //默认值
        type:String,
        default:''
      },
      accept:{ //默认允许上传的文件格式
        type:String,
        default:'jpg/jpeg/gif/png/zip/rar/txt/doc/xls/ppt/docx/xlsx/pptx'
      },
      placeholder: {
        type: String,
        default: '请填写处理意见'
      },
      upload: { //是否有上传附件功能
        type:Boolean,
        default:false
      },
      atUser:{ //@用户功能
        type:Boolean,
        default:false
      }
    },
    methods: {
      msg () {
        this.$vux.toast.text('功能开发中', "center")
      },
      getTextValue () {
        return this.areaValue
      },
      onEnter() {
        //this.$emit("on-enter",this.areaValue)
      },
      clearVal () {
        this.areaValue = ''
      }
    },
    components: {
      Checklist,
      XButton
    }
  }
</script>

<style scoped>
  .top_bar{ margin-top: 5px;height: 30px; line-height: 30px; background-color: #eee; }
  .top_bar_item{display: inline-block; padding: 0 5px;}
  .edit_content{ padding: 2px; padding-top: 0px;padding-left: 0px;}
  .edit_area{width: 100%}
</style>
