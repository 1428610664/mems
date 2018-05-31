<template>
  <div>
    <vue-html5-editor :content="content" :height="height" ref="editor" @change="changeContent" :show-module-name="true"></vue-html5-editor>
  </div>
</template>
<script>
  import Vue from 'vue'
  import VueHtml5Editor from 'vue-html5-editor'
  import editorOptions from "common/js/editorOptions"

  let _options = editorOptions.getOptions();
  _options.hiddenModules =  [
    "text",
    "color",
    "font",
    "align",
    "list",
    "link",
    "unlink",
    "tabulation",
    // "image",
    "hr",
    "eraser",
    "undo",
    "full-screen",
    "info",
    'atuser',
    'prompt-msg'
  ]
  _options.i18n['zh-cn'] ['prompt'] = '请填写处理意见'
  let vueHtml5Editor =  new VueHtml5Editor(_options)
  export default {
    data() {
      return {
        content:this.value,
        contentText:'',
        atUser: []
      }
    },
    props: {
      height:{ //默认值
        type: Number,
        default: 150
      },
      value:{
        type:String,
        default: ''
      },
      hiddenModule:{
        type:String,
        default:''
      }
    },
    methods: {
      getContent () {
        return this.content
      },
      getAtUser(){
        return this.atUser.join(',')
      },
      getContentText(){
        return this.contentText
      },
      // focus: function () {
      //   this.$refs.editor.focus()
      // },
      // execCommand(command, arg){
      //   this.$refs.editor.execCommand(command, arg)
      // },
      reset:function () {
        this.$refs.editor.reset()
      },
      changeContent (v){
        this.content = v
        this.atUser = []
        this.contentText = ''
        let objE = document.createElement("div");
        objE.innerHTML = v;
        this._getValue(objE.childNodes,"1")
      },
      _getValue (node,type){
        node.forEach((item)=>{
          if(item.attributes &&item.attributes.username ){
            if(item.className && item.className=='at_user'){
              this.atUser.push(item.attributes.username.value)
            }
          }
          if(item.childNodes && item.childNodes.length) {
            this._getValue(item.childNodes)
          }
          if(type){
            if(item.nodeName == '#text'){
              this.contentText += item.textContent
            }else if( item.nodeName == 'DIV'){
              this.contentText +="<br>" + item.innerHTML
            }else {
              this.contentText +=  item.outerHTML
            }
          }
        })
      }
    },
    components:{
      vueHtml5Editor
    }
  }
</script>

<style>
/*  @import 'https://cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css';*/
  /*.vue-html5-editor>.toolbar{ position: inherit !important;}*/
  .vue-html5-editor>.toolbar{ z-index: 1 !important;}
  .vue-html5-editor>.toolbar>ul>li .icon{ width: inherit;height: inherit}
  .vue-html5-editor .toolbar>ul{ background-color: #eee !important; position: relative;height: 37px;}
  .vue-html5-editor .toolbar>ul li:last-child{position: absolute; right: 2px}
</style>
