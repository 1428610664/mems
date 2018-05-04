<template>
  <div>

    <div v-show="upload.status=='ready'">

      <input type="text" v-model="imageUrl" maxlength="255" placeholder="请输入地址">
      <!--<button type="button" @click="insertImageUrl">保存</button>-->

      <input type="file" ref="file" style="display: none !important;" @change="process"
             accept="image/png">
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
  import axios from "axios"

    export default {
      data() {
        return {
          imageUrl: '',
          upload: {
            status: 'ready', // progress,success,error,abort
            errorMsg: null,
            progressComputable: false,
            complete: 0
          },
          config: {
            // server: null,
            // fieldName: 'image',
            // compress: true,
            // width: 1600,
            // height: 1600,
            // quality: 80,
            sizeLimit: 512 * 1024,// 512k
            upload: {
                url: 'http://192.168.1.130/ems/xheditor/upload',
                headers: {},
                params: {},
                fieldName: {}
            },
            compress: {
              width: 1600,
              height: 1600,
              quality: 80
            },
            uploadHandler(responseText){
              const json = JSON.parse(responseText)
              return json.ok ? json.data : null
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
        insertImageUrl() {
          if (!this.imageUrl) {
            return
          }
          this.$parent.$parent.execCommand("insertImage", this.imageUrl)
          this.imageUrl = null
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

          if (!config.upload && typeof config.server === 'string') {
            config.upload = {url: config.server}
          }
          if (config.upload && !config.upload.url) {
            config.upload = null
          }
          if (config.upload && typeof config.fieldName === 'string') {
            config.upload.fieldName = config.fieldName
          }

          if (typeof config.compress === 'boolean') {
            config.compress = {
              width: config.width,
              height: config.height,
              quality: config.quality
            }
          }

          const file = this.$refs.file.files[0]
          if (file.size > config.sizeLimit) {
            this.setUploadError('超出大小限制')
            return
          }
          this.$refs.file.value = null

          // if (config.compress) {
          //   config.compress.fieldName = config.upload && config.upload.fieldName
          //     ? config.upload.fieldName : 'image'
          //   lrz(file, config.compress).then((rst) => {
          //     if (config.upload) {
          //       component.uploadToServer(rst.file)
          //     } else {
          //       component.insertBase64(rst.base64)
          //     }
          //   }).catch((err) => {
          //     this.setUploadError(err.toString())
          //   })
          //   return
          // }
          // 不需要压缩
          // base64
          // if (!config.upload) {
          //   const reader = new FileReader()
          //   reader.onload = (e) => {
          //     component.insertBase64(e.target.result)
          //   }
          //   reader.readAsDataURL(file)
          //   return
          // }
          // 上传服务器
          component.uploadToServer(file)
        },
        insertBase64(data) {
          this.$parent.$parent.execCommand('insertImage', data)
        },
        uploadToServer(file) {
          const config = this.config

          const formData = new FormData()
          formData.append('filename', file)
          formData.append('name', 'filedata')

          if (typeof config.upload.params === 'object') {
            Object.keys(config.upload.params).forEach((key) => {
              const value = config.upload.params[key]
              if (Array.isArray(value)) {
                value.forEach((v) => {
                  formData.append(key, v)
                })
              } else {
                formData.append(key, value)
              }
            })
          }
          // this.ajax(formData)
          // return

          const xhr = new XMLHttpRequest()

          xhr.onprogress = (e) => {
            this.upload.status = 'progress'
            if (e.lengthComputable) {
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
        },
        ajax (formData) {
          axios({
            method: 'POST',
            url:this.config.upload.url,
            data: formData
          }).then((res) => {
            console.log('111111111111')
          })
        }
      }
    }
</script>

<style scoped>


</style>
