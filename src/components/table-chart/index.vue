<template>

  <div class="table-wrapper fz14">
    <div class="table-item" v-for="item in tableData">
      <div class=""><span class="circle" :style="{'background-color': item.color}"></span>{{item.name}}</div>
      <div class="ct">{{item.value}}</div>
      <div class="ct">{{isNaN(item.value/total) ? 0 :Math.round(item.value/total*100)}}%</div>
    </div>

  </div>

</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        tableData:[],
        total:0,
      }
    },
    props: {
      arrData: ''
    },
    watch:{
      arrData (val){
        this.arrData = val
        this.initData(val)
      }
    },
    created() {
      setTimeout(() => {
        this.initData(this.arrData)
      }, 20)
    },
    methods: {
      initData (val){
        const categoryColor= {1:'#CC0033',2:"#FF0000",3:'#FFFF00',4:'#FF9933',0:'#00CC00'}
        const arrData = {1:'极高',2:'高',3:'中',4:'低',0:'未分类'}
        let _data = []
        this.total = 0
        for (let key in arrData){
          const _val = val[key] ? val[key]:0
          if(_val != 0){
            this.total += _val
            _data.push({name:arrData[key],value:_val,color:categoryColor[key]})
          }
        }
        if(_data.length == 0){
          _data = [
            {value:0,name:'极高',color:'#CC0033'},
            {value:0,name:'高',color:'#FF0000'},
            {value:0,name:'中',color:'#FFFF00'},
            {value:0,name:'低',color:'#FF9933'},
            {value:0,name:'未分类',color:'#00CC00'}
          ]
        }
        this.tableData = _data
      }
    }
  }
</script>

<style scoped>

  .table-wrapper {
    padding: 8px 10%;
  }

  .table-item {
    display: flex;
    line-height: 34px;
  }

  .table-item:nth-child(n+2) {
    border-top: 1px solid #ddd;
  }

  .table-item > div {
    flex: 1;
  }

  .circle{
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    vertical-align: middle;
    border-radius: 20px;
    background: red;
  }

</style>
