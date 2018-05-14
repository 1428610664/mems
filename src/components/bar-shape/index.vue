<template>

  <div>

    <div class="bar-txt-wrapper fz20">
      <div class="bar-txt c-red">
        <span class="fz13">未受理</span>
      </div>
      <div class="bar-txt c-green">
        <span class="fz13">已受理</span><br/>
      </div>
      <div class="bar-txt c-yellow">
        <span class="fz13">已关闭</span><br/>
      </div>
    </div>
    <div class="bar-wrapper">
      <div class="bar" :style="barStyle[0]">{{arrData[0]? arrData[0] : ''}}</div>
      <div class="bar" :style="barStyle[1]">{{arrData[1]? arrData[1] : ''}}</div>
      <div class="bar" :style="barStyle[2]">{{arrData[99]? arrData[99] : ''}}</div>
      <div class="clearFix"></div>
    </div>

  </div>

</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        barStyle:[{ width: '33%'}, { width: '33%'}, { width: '33%' }]
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
        let total = 0
        total = val[0]?val[0] :0
        total += val[1]?val[1] :0
        total += val[99]?val[99] :0
        this.barStyle = [{ width: '33%'}, { width: '33%'}, { width: '33%' }]
        if(this.total == 0) return
        // let percent=[]
        // Math.round((this.arrData[0]?this.arrData[0] :0)/this.total* 100) / 100 * 100
        // percent.push((this.arrData[0]?this.arrData[0] :0)/this.total * 100)
        // percent.push((this.arrData[1]?this.arrData[1] :0)/this.total * 100)
        // percent.push((this.arrData[99]?this.arrData[99] :0)/this.total * 100)
        this.barStyle[0].width = (val[0]?val[0] :0)/total * 100 + "%"
        this.barStyle[1].width = (val[1]?val[1] :0)/total * 100 + "%"
        this.barStyle[2].width = (val[99]?val[99] :0)/total * 100 + "%"
        // let _index = 0
        // for (let item in percent) {
        //   console.log(item)
        //   if(item == 0){
        //     _index++
        //   }
        // }
      }
    }
  }
</script>

<style scoped>

  .bar-txt-wrapper{
    display: flex;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  .bar-wrapper{
    padding: 0 20px;
  }

  .bar-txt{
    flex: 1;
    text-align: center;
  }
  .bar{
    float: left;
    text-align: center;
  }

  .bar{
    height: 16px;
  }

  .c-red{color: red}
  .c-green{color: green}
  .c-yellow{color: yellow}
  .bar-wrapper .bar:nth-child(1){
    background: red;
  }
  .bar-wrapper .bar:nth-child(2){
    background: green;
  }
  .bar-wrapper .bar:nth-child(3){
    background: yellow;
  }

</style>
