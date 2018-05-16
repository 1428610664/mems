<template>
  <div class="page-bar">
    <ul>
      <li v-if="cur>1"><a @click="pageClick('start')">首页</a></li>
      <li v-if="cur==1"><a class="banclick">首页</a></li>
      <li v-if="cur> 5"><a @click="pageClick('reduce')"><<</a></li>
      <li v-for="index in indexs"  :class="{ 'active': cur == index}">
        <a @click="btnClick(index)">{{ index }}</a>
      </li>
      <li v-if="cur< all - 5"><a @click="pageClick('add')">>></a></li>
      <li v-if="cur!=all"><a @click="pageClick('end')">尾页</a></li>
      <li v-if="cur == all"><a class="banclick">尾页</a></li>
      <li><a>共<i>{{all}}</i>页</a></li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: "index",
    props: {
      total: {
        type: Number,
        default: 50
      },
      limit: {
        type: String,
        default: '50'
      }
    },
    data() {
      return {
        all: 20, //总页数
        cur: 1,//当前页码
      }
    },
    created() {
      setTimeout(() => {
        this.getPageNumber()
      }, 20)
    },
    watch:{

      total(oldValue , newValue){
        this.getPageNumber()
      }
    },
    methods: {
      btnClick (data){//页码点击事件
        if(data != this.cur){
          this.cur = data
          this.$emit('change',this.cur)
        }
      },
      pageClick(type){
       // start reduce add
        switch (type){
          case 'start':
            this.cur = 1
            break;
          case 'reduce':
            this.cur =  this.cur - 5
            break;
          case 'add':
            this.cur =  this.cur + 5
            break;
          case 'end':
            this.cur = this.all
            break;
          default:
        }
        this.$emit('change',this.cur)
      },
      getPageNumber (){
          this.all = Math.ceil((+this.total)/(+this.limit))
      }
    },
    computed: {
      indexs (){
        var left = 1;
        var right = this.all;
        var ar = [];
        if(this.all>= 5){
          if(this.cur > 3 && this.cur < this.all-2){
            left = this.cur - 2
            right = this.cur + 2
          }else{
            if(this.cur<=3){
              left = 1
              right = 5
            }else{
              right = this.all
              left = this.all -4
            }
          }
        }
        while (left <= right){
          ar.push(left)
          left ++
        }
        return ar
      }
    }
  }
</script>

<style scoped>
  ul,li{
    text-align: center;
    margin: 0px;
    padding: 0px;
  }
  li{
    list-style: none;
    display: inline-block;
  }
  .page-bar li:first-child>a {
    margin-left: 0px
  }
  .page-bar a{
    border: 1px solid #ddd;
    text-decoration: none;
    display: inline-block;
    padding: 5px 12px;
    margin-left: -1px;
    line-height:18px;
    color: #337ab7;
    cursor: pointer
  }
  .page-bar a:hover{
    background-color: #eee;
  }
  .page-bar a.banclick{
    cursor:not-allowed;
  }
  .page-bar .active a{
    color: #fff;
    cursor: default;
    background-color: #337ab7;
    border-color: #337ab7;
  }
  .page-bar i{
    font-style:normal;
    color: #d44950;
    margin: 0px 4px;
    font-size: 12px;
  }
</style>
