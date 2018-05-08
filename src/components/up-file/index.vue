<template>
  <div>

    <div v-show="upload.status=='ready'">

      <input type="text" v-model="fileUrl" maxlength="255" placeholder="请输入地址">
      <input type="file" ref="file" style="display: none !important;" @change="process"
             accept="file/zip,file/rar,file/txt,file/doc,file/xls,file/ppt,file/xlsx,file/pptx">
      <button type="button" @click="pick">上传</button>
    </div>

    <div v-if="upload.status=='progress'">
      进度:{{upload.progressComputable ?  '未知' : '完成'}}
    </div>

    <div v-if="upload.status=='success'">
      请稍等
    </div>

    <div v-if="upload.status=='error'">
      错误:{{upload.errorMsg}}
      <button type="button" @click="reset">重置</button>
    </div>

    <div v-if="upload.status=='abort'">
      上传中断
      <button type="button" @click="reset">重置}</button>
    </div>

  </div>


</template>

<script>
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'
    export default {
      data() {
        return {
          fileUrl: '',
          upload: {
            status: 'ready', // progress,success,error,abort
            errorMsg: null,
            progressComputable: false,
            complete: 0
          },
          config: {
            sizeLimit: 10000 * 1024, //10Mb
            upload:{
               url: 'http://192.168.1.130/ems/xheditor/upload'
            }
          }
        }
      },
      props: {
        option: {}
      },
      methods: {
        reset(){
          this.upload.status = 'ready'
        },
        pick() {
        	 this.$vux.toast.text("功能开发中", "bottom")
//        this.$refs.file.click()
        },
        setUploadError(msg){
          this.upload.status = 'error'
          this.upload.errorMsg = msg
        },
        process() {
          const component = this
          const config = this.config

          const file = this.$refs.file.files[0]
          if (file.size > config.sizeLimit) {
            this.setUploadError('超出大小限制')
            return
          }
          this.$refs.file.value = null

          component.uploadToServer(file)
        },
        uploadToServer(file) {
          const config = this.config
          const formData = new FormData()
          formData.append(file.name,file)

          const xhr = new XMLHttpRequest()

          xhr.onprogress = (e) => {
            this.upload.status = 'progress'
            if (e.lengthComputable) {
              console.log(e)
              this.upload.progressComputable = true
              const percentComplete = e.loaded / e.total
              this.upload.complete = (percentComplete * 100).toFixed(2)
            } else {
              this.upload.progressComputable = false
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 300) {
              this.setUploadError(`request error,code ${xhr.status}`)
              return
            }

            try {
              const url = config.uploadHandler(xhr.responseText)
              if (url) {
                this.$parent.$parent.execCommand("insertImage", url)
              }
            } catch (err) {
              this.setUploadError(err.toString())
            } finally {
              this.upload.status = 'ready'
            }
          }

          xhr.onerror = () => {
            // find network info in brower tools
            this.setUploadError('request error')
          }

          xhr.onabort = () => {
            this.upload.status = 'abort'
          }

          xhr.open('POST', config.upload.url)
          if (typeof config.upload.headers === 'object') {
            Object.keys(config.upload.headers).forEach((k) => {
              xhr.setRequestHeader(k, config.upload.headers[k])
            })
          }
          xhr.send(formData)
        }
      },
      beforeCreate(){
        this.$nextTick(()=>  {
          // this.initSelect()
        })
      }
    }
</script>

<style scoped>


</style>
