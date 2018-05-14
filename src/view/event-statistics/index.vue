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
        // let option2 = {
        //   title: {
        //     text: '数据来源（Top5）'
        //   },
        //   xAxis: {
        //     type: 'category',
        //     data: ['鹰眼', 'RNA', 'VMWARE', 'Spark', '金证']
        //   },
        //   yAxis: {
        //     type: 'value'
        //   },
        //   label: {
        //     normal: {
        //       show: true,
        //       position: 'insideTop'
        //     }
        //   },
        //   series: [{
        //     data: [120, 200, 150, 80, 70],
        //     type: 'bar',
        //     barWidth: 20,
        //   }]
        // }
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
            formatter: "{a} <br/>{b} : {c}%",
            textStyle: {fontSize: 6}
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              radius : '88%',
              center: ['50%', '56%'],
              detail: {formatter:'{value}%'},
              data: [{value: 50, name: '完成率'}],
              pointer: {width: 3, length: "60%"},
              title: {offsetCenter: [0, "80%"]},
            }
          ]
        }

        let kpiLineOption = {
          title: {
            text: 'KPI(7天)'
          },
          tooltip: {
            trigger: 'axis'
          },
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
            data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'误报率',
              type:'line',
              stack: '总量',
              data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
              name:'漏报率',
              type:'line',
              stack: '总量',
              data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
              name:'响应率',
              type:'line',
              stack: '总量',
              data:[150, 232, 201, 154, 190, 330, 410]
            },
            {
              name:'关闭率',
              type:'line',
              stack: '总量',
              data:[320, 332, 301, 334, 390, 330, 320]
            }
          ]
        }
        this.charts.kpiTree1.setOption(kpiOption)
        this.charts.kpiTree2.setOption(kpiOption)
        this.charts.kpiTree3.setOption(kpiOption)
        this.charts.kpiTree4.setOption(kpiOption)
        this.charts.kpiLineTree.setOption(kpiLineOption)
      },
      _resize(){
        for(let char in this.charts){
          this.charts[char].resize()
        }
      },
      _getEventData () {
        if(this.selectIndex == 2){
          this.initTab3()
          return
        }
        let _num = this.selectIndex + 1
        request.get(getUrl('eventType'),{dataType:this.dataType[this.selectIndex]}).then(res => {
          if(res.success){
            this.chartsData = res.data
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
        }, error => {
          this.chartsData={
            appName: {},
            eventCause: {},
            severity: {},
            sourceAgent: {},
            status: {}
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
      }

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
