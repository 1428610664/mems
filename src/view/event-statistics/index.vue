<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">事件统计</x-header>
      <tab>
        <tab-item v-for="(item, index) in tab" :key='index' :selected="index == selectIndex" @on-item-click="onTabItemClick">{{item}}</tab-item>
      </tab>

      <div class="content-wrapper">
        <div v-show="selectIndex == 0">
          <v-tab @on-tab-click="tabDataRefresh" ></v-tab>
          <bar-shape :arrData='chartsData.status'></bar-shape>
          <div id="category" :style="{width: '100vw', height: '100vw'}"></div>
          <table-chart :arrData="chartsData.severity"></table-chart>
        </div>
        <div v-show="selectIndex == 1">
          <v-tab @on-tab-click="tabDataRefresh" ></v-tab>
          <div id="top1" :style="{width: '100vw', height: '90vw'}"></div>
          <div id="top2" :style="{width: '100vw', height: '90vw'}"></div>
          <div id="top3" :style="{width: '100vw', height: '90vw'}"></div>
        </div>
        <div  v-show="selectIndex == 2">
          <div class="clear">
            <div id="kpiTree1" class="fl" :style="{width: '50vw', height: '50vw'}"></div>
            <div id="kpiTree2" class="fl" :style="{width: '50vw', height: '50vw'}"></div>
            <div id="kpiTree3" class="fl" :style="{width: '50vw', height: '50vw'}"></div>
            <div id="kpiTree4" class="fl" :style="{width: '50vw', height: '50vw'}"></div>
          </div>
          <div id="kpiLineTree" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Tab, TabItem} from 'vux'
  import VTab from 'components/tab'
  import TableChart from 'components/table-chart'
  import BarShape from 'components/bar-shape'
  import {getUrl} from 'common/js/Urls'
  import request from 'common/js/request'

  export default {
    name: "index",
    data() {
      return {
        tab: ["分类统计", "Top统计", "KPI统计"],
        selectIndex: 0,

        categoryColor: ["#CC0033", "#FF0000", "#FFFF00", "#FF9933", "#00CC00"],
        charts: {},
        dataType:['D','D'],
        chartsData:{
          appName: {},
          eventCause: {},
          severity: {},
          sourceAgent: {},
          status: {}
          },
        kpiData:{
          process: {},
          cosle: {},
          cosleRate: 0,
          missing: {},
          distortRate: 0,
          missingRate: 0,
          distort: {},
          processRate: 0
        }
      }
    },
    computed: {},
    created() {
      setTimeout(() => {
        this._getEventData()
        window.addEventListener('resize',this._resize,false);
      }, 20)
    },
    methods: {
      onTabItemClick(index) {
        this.selectIndex = index
        this._getEventData()
      },
      initTab1() {
        console.log("initTab1")
        this.charts.categoryChart = this.$echarts.init(document.getElementById('category'))
        const categoryColor= {1:'#CC0033',2:"#FF0000",3:'#FFFF00',4:'#FF9933',0:'#00CC00'}
        let _color = []
        const arrData = {1:'极高',2:'高',3:'中',4:'低',0:'未分类'}
        let _data = []
        for (let key in arrData){
          const val = this.chartsData.severity[key] ? this.chartsData.severity[key]:0
          if(val != 0){
            _data.push({name:arrData[key],value:this.chartsData.severity[key] ? this.chartsData.severity[key]:0 })
            _color.push(categoryColor[key])
          }
        }
        if(_data.length == 0){
          _data = [
            {value:0,name:'极高',color:''},
            {value:0,name:'高'},
            {value:0,name:'中'},
            {value:0,name:'低'},
            {value:0,name:'未分类'}
          ]
          _color = this.categoryColor
        }
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          color: _color,
          legend: {
            x: 'center',
            y: 'bottom',
            data:_data.map((item)=>{
               return item.name
            })
          },
          calculable: true,
          series: [
            {
              name: '面积模式',
              type: 'pie',
              radius: [30, 120],
              center: ['50%', '50%'],
              roseType: 'area',
              data: _data,
              label: {
                normal: {
                  show: true,
                  position: 'inner',
                  color:'#000',
                  formatter:" {c} ({d}%)"
                },
              }
            }
          ]
        }
        this.charts.categoryChart.setOption(option)
      },
      initTab2() {
        console.log("initTab2")
        this.charts.top1Chart = this.$echarts.init(document.getElementById('top1'))
        this.charts.top2Chart = this.$echarts.init(document.getElementById('top2'))
        this.charts.top3Chart = this.$echarts.init(document.getElementById('top3'))
        let option1 = {
          title: {
            text: '业务分布（Top5）'
          },
          grid: {
            bottom:'40%',
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          xAxis: {
            type: 'category',
            axisLabel:{
              rotate:45
            },
            data :this.getData('appName','key')
          },
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          series: [
            {
              name: '2011年',
              type: 'bar',
            //  data: [18203, 23489, 29034, 104970, 131744],
              data: this.getData('appName'),
              barWidth: 20
            },
          ]
        }
        this.charts.top1Chart.setOption(option1)
        option1.title.text = '数据来源（Top5）'
        option1.xAxis.data = this.getData('sourceAgent','key')
        option1.series[0].data = this.getData('sourceAgent')
        this.charts.top2Chart.setOption(option1)
        option1.title.text = '事件原因（Top5）'
        option1.xAxis.data = this.getData('eventCause','key')
        option1.series[0].data = this.getData('eventCause')
        this.charts.top3Chart.setOption(option1)
      },
      initTab3(){
        console.log("initTab3")
        this.charts.kpiTree1 = this.$echarts.init(document.getElementById('kpiTree1'))
        this.charts.kpiTree2 = this.$echarts.init(document.getElementById('kpiTree2'))
        this.charts.kpiTree3 = this.$echarts.init(document.getElementById('kpiTree3'))
        this.charts.kpiTree4 = this.$echarts.init(document.getElementById('kpiTree4'))
        this.charts.kpiLineTree = this.$echarts.init(document.getElementById('kpiLineTree'))
        let kpiOption = {
          tooltip : {
            formatter: "{b} : {c}%",
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              radius : '95%',
              splitNumber:4,
              detail: {
                formatter:'{value}%',
                fontSize:18,
                backgroundColor: '#ddd',
              },
              data: [{value: this.kpiData.processRate, name: '响应率'}],
              pointer: {width: 3, length: "60%"},
              title: {offsetCenter: [0, "80%"]},
            }
          ]
        }
        this.charts.kpiTree1.setOption(kpiOption)
        kpiOption.series[0].data = [{value: this.kpiData.cosleRate, name: '关闭率'}]
        this.charts.kpiTree2.setOption(kpiOption)
        kpiOption.series[0].data = [{value: this.kpiData.distortRate, name: '误报率'}]
        this.charts.kpiTree3.setOption(kpiOption)
        kpiOption.series[0].data = [{value: this.kpiData.missingRate, name: '漏报率'}]
        this.charts.kpiTree4.setOption(kpiOption)
        let kpiLineOption = {
          title: {
            text: 'KPI(7天)'
          },
          tooltip: {
            trigger: 'axis'
          },
          color: ["#4F81BD", "#C0504D","#9BBB59","#8064A2"],
          legend: {
            data:['误报率','漏报率','响应率','关闭率'],
            top: 32
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:this.getKpiData('process','key')
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'误报率',
              type:'line',
              //stack: '总量',
              itemStyle : {normal : {lineStyle:{color:'#4F81BD'}}},
              data:this.getKpiData('distort')
            },
            {
              name:'漏报率',
              type:'line',
              // stack: '总量',
              itemStyle : {normal : {lineStyle:{color:'#C0504D'}}},
              data:this.getKpiData('missing')
            },
            {
              name:'响应率',
              type:'line',
              //stack: '总量',
              itemStyle : {normal : {lineStyle:{color:'#9BBB59'}}},
              data:this.getKpiData('process')
            },
            {
              name:'关闭率',
              type:'line',
           //   stack: '总量',
              itemStyle : {normal : {lineStyle:{color:'#8064A2'}}},
              data:this.getKpiData('cosle')
            }
          ]
        }
        this.charts.kpiLineTree.setOption(kpiLineOption)
      },
      _resize(){
        for(let char in this.charts){
          this.charts[char].resize()
        }
      },
      _getEventData () {
        let _num = this.selectIndex + 1
        request.get(getUrl(this.selectIndex == 2 ? 'eventKpi':'eventType'),this.selectIndex == 2 ? {}:{dataType:this.dataType[this.selectIndex]}).then(res => {
          if(res.success){
            if(this.selectIndex == 2){
              this.kpiData=res.data
            }else {
              this.chartsData=res.data
            }
          }else {
            if(this.selectIndex == 2){
              this.kpiData={
                process: {},
                cosle: {},
                cosleRate: 0,
                missing: {},
                distortRate: 0,
                missingRate: 0,
                distort: {},
                processRate: 0
              }
            }else {
              this.chartsData={
                appName: {},
                eventCause: {},
                severity: {},
                sourceAgent: {},
                status: {}
              }
            }
          }
          this["initTab" + _num ]()
        }, error => {
          if(this.selectIndex == 2){
            this.kpiData={
              process: {},
              cosle: {},
              cosleRate: 0,
                missing: {},
              distortRate: 0,
                missingRate: 0,
                distort: {},
              processRate: 0
            }
          }else {
            this.chartsData={
              appName: {},
              eventCause: {},
              severity: {},
              sourceAgent: {},
              status: {}
            }
          }
          this["initTab" + _num ]()
        })
      },
      tabDataRefresh(val){
        this.dataType[this.selectIndex] = val
        this._getEventData()
      },
      getData(key,type){
        let newKey = []
        let _data = []
        let index = 1
        for(let item in this.chartsData[key]){
          if(index<6){
            newKey.push(this.chartsData[key][item].key)
            _data.push(this.chartsData[key][item].value)
          }
          index ++
        }
        if(type == 'key'){
          return newKey
        }else {
          return _data
        }
      },
      getKpiData(key,type){
        let newKey = []
        let _data = []
        let index = 1
        for(let item in this.kpiData[key]){
          newKey.push(item)
          _data.push(this.kpiData[key][item])
          index ++
        }
        if(type == 'key'){
          return newKey
        }else {
          return _data
        }
      },
    },
    components: {
      XHeader,
      Tab,
      TabItem,

      VTab,
      TableChart,
      BarShape
    }
  }
</script>

<style scoped>

  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 22;
    overflow-y: auto;
  }

  .content-wrapper {
    position: absolute;
    top: 88px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: auto;
  }

</style>
