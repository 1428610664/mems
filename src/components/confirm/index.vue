<template>
  <div class="vux-confirm">
    <x-dialog
      v-model="showValue"
      :dialog-class="theme === 'android' ? 'weui-dialog weui-skin_android' : 'weui-dialog'"
      :mask-transition="maskTransition"
      :dialog-transition="theme === 'android' ? 'vux-fade' : dialogTransition"
      :hide-on-blur="hideOnBlur"
      :mask-z-index="maskZIndex"
      @on-hide="$emit('on-hide')">
      <div class="weui-dialog__hd" v-if="!!title" :class="{'with-no-content': !showContent}">
        <strong class="weui-dialog__title">{{ title }}</strong>
      </div>
      <template v-if="showContent">
        <div class="weui-dialog__bd" v-if="!showSelector">
          <slot><div v-html="content"></div></slot>
        </div>
        <div v-else class="vux-prompt">
          <selector v-model="msg" :title="selectorTitle" :options="selectorOptions"></selector>
        </div>
      </template>
      <div class="weui-dialog__ft">
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="_onCancel">{{cancelText || '取消'}}</a>
        <a href="javascript:;" class="weui-dialog__btn" :class="`weui-dialog__btn_${confirmType}`" @click="_onConfirm">{{confirmText || '确定'}}</a>
      </div>
    </x-dialog>
  </div>
</template>

<script>

  import XDialog from 'vux/src/components/x-dialog'
  import {Selector} from 'vux'

export default {
  name: 'confirm',
  components: {
    XDialog,
    Selector
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    showSelector: {
      type: Boolean,
      default: false
    },
    selectorOptions: {
      type: Array,
      default(){
        return []
      }
    },
    selectorTitle: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: ''
    },

    placeholder: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'ios'
    },
    hideOnBlur: {
      type: Boolean,
      default: false
    },
    title: String,
    confirmText: String,
    cancelText: String,
    maskTransition: {
      type: String,
      default: 'vux-fade'
    },
    maskZIndex: [Number, String],
    dialogTransition: {
      type: String,
      default: 'vux-dialog'
    },
    content: String,
    closeOnConfirm: {
      type: Boolean,
      default: true
    },
    inputAttrs: Object,
    showContent: {
      type: Boolean,
      default: true
    },
    confirmType: {
      type: String,
      default: 'primary'
    }
  },
  created () {
    this.showValue = this.show
    if (this.value) {
      this.showValue = this.value
    }
  },
  watch: {
    value (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('input', val)
      if (val) {
        /*if (this.showSelector) {
          this.msg = ''
          setTimeout(() => {
            if (this.$refs.input) {
              this.setInputFocus()
            }
          }, 300)
        }*/
        this.$emit('on-show') // emit just after msg is cleared
      }
    }
  },
  data () {
    return {
      msg: this.defaultValue,
      showValue: false
    }
  },
  methods: {
    setInputValue (val) {
      this.msg = val
    },
    setInputFocus () {
      this.$refs.input.focus()
    },
    _onConfirm () {
      if (!this.showValue) {
        return
      }
      if (this.closeOnConfirm) {
        this.showValue = false
      }
      this.$emit('on-confirm', this.msg)
    },
    _onCancel () {
      if (!this.showValue) {
        return
      }
      this.showValue = false
      this.$emit('on-cancel')
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/transition.less';
@import '~vux/src/styles/weui/widget/weui_tips/weui_mask';
@import '~vux/src/styles/weui/widget/weui_tips/weui_dialog';

.vux-prompt {
  padding-bottom: 1.6em;
}

.vux-prompt-msgbox {
  width: 80%;
  border: 1px solid #dedede;
  border-radius: 5px;
  padding: 4px 5px;
  appearance: none;
  outline: none;
  font-size: 16px;
}
</style>
