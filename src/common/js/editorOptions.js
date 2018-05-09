import atUser from 'components/at-user'
// import upImage from 'components/up-image'
// import upFile from 'components/up-file'



export default {
    getOptions () {
      let options =  {
        // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效
        // global component name
        name: "vue-html5-editor",
        // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
        // if set true,will append module name to toolbar after icon
        showModuleName: false,
        // 自定义各个图标的class，默认使用的是font-awesome提供的图标
        // custom icon class of built-in modules,default using font-awesome
        icons: {
          text: "fa fa-pencil",
          color: "fa fa-paint-brush",
          font: "fa fa-font",
          align: "fa fa-align-justify",
          list: "fa fa-list",
          link: "fa fa-chain",
          unlink: "fa fa-chain-broken",
          tabulation: "fa fa-table",
          image: "fa fa-file-image-o",
          hr: "fa fa-minus",
          eraser: "fa fa-eraser",
          undo: "fa-undo fa",
          "full-screen": "fa fa-arrows-alt",
          info: "fa fa-info",
        },
        // 配置图片模块
        // config image module
        image: {
          // 文件最大体积，单位字节  max file size
          sizeLimit: 512 * 1024,
          // 上传参数,默认把图片转为base64而不上传
          // upload config,default null and convert image to base64
          upload: {
            url: null,
            headers: {},
            params: {},
            fieldName: {}
          },
          // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
          // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
          // set null to disable compression
          compress: {
            width: 1600,
            height: 1600,
            quality: 80
          },
          // 响应数据处理,最终返回图片链接
          // handle response data，return image url
          uploadHandler(responseText){
            //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
            var json = JSON.parse(responseText)
            if (!json.ok) {
              alert(json.msg)
            } else {
              return json.data
            }
          }
        },
        // 语言，内建的有英文（en-us）和中文（zh-cn）
        //default en-us, en-us and zh-cn are built-in
        language: "zh-cn",
        // 自定义语言
        i18n: {
          //specify your language here
          "zh-cn": {
             "imagenew": "",
             "linknew": "",
             "save": "确定",
             "upload": "上传",
          }
        },
        // 隐藏不想要显示出来的模块
        // the modules you don't want
        hiddenModules: [],
        // 自定义要显示的模块，并控制顺序
        // keep only the modules you want and customize the order.
        // can be used with hiddenModules together
        visibleModules: [
          // "text",
          // "color",
          // "font",
          // "align",
          // "list",
           "linknew",
          // "unlink",
          // "tabulation",
          "imagenew",
          // "hr",
          // "eraser",
          // "undo",
          // "full-screen",
          // "info",
          'atuser',
          'prompt',
          'prompt-msg'
        ],
        // 扩展模块，具体可以参考examples或查看源码
        // extended modules
        modules:[
          {
            //custom module with dashboard.html
            name: "linknew",
            icon: "fa fa-chain",
            i18n: "linknew",
            show: true,
            init: function (editor) {
            //  editor.toggleDashboard(editor.modules[0].dashboard)
            },
            //vue component
            // dashboard: {
            //   template: '<up-file ref="updateFile"></up-file>',
            //   data: function () {
            //     return {}
            //   },
            //   components:{upFile},
            //   methods: {
            //     updateFile () {
            //       this.$refs.updateFile.pick()
            //     }
            //   }
            // },
            handler: function (editor) {
              console.log(editor)
               let damo = document.createElement("div") //创建上传附件damo
               damo.innerHTML = '<input type="file">'
               damo.childNodes[0].click() //触发附件上传功能
               damo.childNodes[0].onchange = (event)=>{ //监听上传附件change后上传附件；
                 if(damo.childNodes[0].files.length > 1){
                   editor.$vux.toast.text("一次只能上传一个附件", "bottom")
                   return
                 }
                const file = damo.childNodes[0].files[0]
                if (file.size > 5000 * 1024) {
                  editor.$vux.toast.text("文件超出大小限制", "bottom")
                  return
                }

                const formData = new FormData()
                formData.append('filename', file)
                // formData.append('type', 'filedata')

                const xhr = new XMLHttpRequest()
                 let percent = 0
                xhr.onprogress = (e) => {
                   editor.$vux.loading.show({
                    text: '文件上传中...'
                    })
                    if (e.lengthComputable) {
                      // const percentComplete = e.loaded / e.total
                      // percent = (percentComplete * 100).toFixed(0)
                      // editor.$vux.loading.show({
                      //   text: '文件上传中，上传进度'+percent+'%'
                      // })
                    } else {
                      editor.$vux.loading.hide()
                    }
                }

                xhr.onload = () => {
                  editor.$vux.loading.hide()
                  if (xhr.status >= 300) {
                    editor.$vux.toast.text("请求错误", "bottom")
                    return
                  }
                  try {
                    const url_back =JSON.parse(xhr.responseText).msg.split("||")[0]
                    const name_back =JSON.parse(xhr.responseText).msg.split("||")[1]
                    if (url_back) {
                      editor.execCommand("insertHTML", "<a href='"+process.env.API + url_back+"' class ='file_link'><i class=\"fa fa-download\" aria-hidden=\"true\"></i>&nbsp;"+name_back+"</a>")
                    }
                  } catch (err) {
                    editor.$vux.toast.text("上传失败", "bottom")
                  }
                }
                xhr.onerror = () => {
                  editor.$vux.loading.hide()
                  editor.$vux.toast.text("请求错误", "bottom")
                }
                xhr.open('POST', process.env.API + "/ems/xheditor/upload");
                xhr.send(formData)
              }
               // damo = null
            },
          },
          // {
          //   //custom module with dashboard.html
          //   name: "imagenew",
          //   icon: "fa fa-file-image-o",
          //   i18n: "imagenew",
          //   show: true,
          //   //vue component
          //   dashboard: {
          //     template: '<up-image ref = "imageTing"></up-image>',
          //     data: function () {
          //       return {
          //       }
          //     },
          //     components:{upImage},
          //     methods: {
          //     }
          //   }
          // },
          {
          //custom module with dashboard.html
          name: "atuser",
          icon: "fa fa-at",
          i18n: "atuser",
          show: true,
          init: function (editor) {
          },
          //vue component
          dashboard: {
            template: '<at-user @change="change"></at-user>',
            data: function () {
              return {}
            },
            components:{atUser},
            methods: {
              change (val) {
                this.$parent.execCommand("insertHTML", '<a href="javascript:void(0)" class="at_user" username="'+val.key+'">@'+ val.name+'</a>')
              }
            }
          }
          },
          {
            //custom module with dashboard.html
            name: "prompt",
            icon: "prompt_class",
            i18n: "prompt",
            show: true,
            init: function (editor) {

            }
          },
          {
            //custom module with dashboard.html
            name: "prompt-msg",
            icon: "promptMsg_class",
            i18n: "promptMsg",
            show: true,
            init: function (editor) {
            }
          }
        ]
      }
      return options
    }
}
