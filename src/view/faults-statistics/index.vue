<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">报障统计</x-header>
      <tab>
        <tab-item v-for="(item, index) in tab" :key='index' :selected="index == selectIndex" @on-item-click="onTabItemClick">{{item}}</tab-item>
      </tab>

      <div class="content-wrapper">
        <div v-show="selectIndex == 0">
          <v-tab @on-tab-click="tabDataRefresh" ></v-tab>
          <bar-shape :arrData='chartsData.status'></bar-shape>
          <div id="category1" :style="{width: '100vw', height: '80vw'}"></div>
          <div id="category2" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
        <div v-show="selectIndex == 1">
          <v-tab @on-tab-click="tabDataRefresh" ></v-tab>
          <div id="top1" :style="{width: '100vw', height: '80vw'}"></div>
          <div id="top2" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
        <div  v-show="selectIndex == 2">
          <div id="kpiTree" :style="{width: '100vw', height: '100vw'}"></div>
          <div id="kpiLineTree" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Tab, TabItem} from 'vux'
  import VTab from 'components/tab'
  import BarShape from 'components/bar-shape'

  import {getUrl} from 'common/js/Urls'
  import request from 'common/js/request'

  export default {
    name: "index",
    data() {
      return {
        tab: ["分类统计", "Top统计", "KPI统计"],
        selectIndex: 0,

        charts: {},
        dataType:['D','D'],
        chartsData: {
          appName: {},
          cacsi: {},
          type: {},
          depart: {},
          status: {}
        },
      }
    },
    computed: {},
    created() {
      setTimeout(() => {
        this._requestData()
        window.addEventListener('resize',this._resize,false);
      }, 20)
    },
    methods: {
      onTabItemClick(index) {
        this.selectIndex = index
        this._requestData()
      },
      initTab1() {
        this.charts.category1Chart = this.$echarts.init(document.getElementById('category1'))
        this.charts.category2Chart = this.$echarts.init(document.getElementById('category2'))

        let option = {
          title : {
            text: '报障类型',
            x:'right',
            top: "20"
          },
          tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            top: '55',
            data:this._getChartPie('type','key')
          },
          series: [
            {
              type:'pie',
              avoidLabelOverlap: false,
              data:this._getChartPie('type')
            }
          ]
        }
        let option2 = {
          title : {
            text: '满意度',
            x:'right',
            top: "20"
          },
          tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            top: '55',
            data:this._getChartPie('cacsi','key')
          },
          series: [
            {
              type:'pie',
              avoidLabelOverlap: false,
              data:this._getChartPie('cacsi')
            }
          ]
        }
        this.charts.category1Chart.setOption(option)
        this.charts.category2Chart.setOption(option2)
      },
      initTab2() {
        this.charts.top1Chart = this.$echarts.init(document.getElementById('top1'))
        this.charts.top2Chart = this.$echarts.init(document.getElementById('top2'))
        let option1 = {
          title: {
            text: '业务分布（Top5）'
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          grid: {
            bottom:'40%',
          },
          xAxis: {
            type: 'category',
            axisLabel:{
              rotate:45
            },
            data: this.getData('appName','key')
          },
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          series: [
            {
              type: 'bar',
              data: this.getData('appName'),
              barWidth: 20
            },
          ]
        }
        // let option2 = {
        //   title: {
        //     text: '人工报障部门（Top5）'
        //   },
        //   xAxis: {
        //     type: 'category',
        //     axisLabel:{
        //       rotate:45
        //     },
        //     data: this.getData('depart','key')
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
        //     data: this.getData('depart'),
        //     type: 'bar',
        //     barWidth: 20,
        //   }]
        // }
        this.charts.top1Chart.setOption(option1)
        option1.title.text = '人工报障部门（Top5）'
        option1.xAxis.data = this.getData('depart','key')
        option1.series[0].data = this.getData('depart')
        this.charts.top2Chart.setOption(option1)
      },
      initTab3(){
        this.charts.kpiTree = this.$echarts.init(document.getElementById('kpiTree'))
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
              data: [{value: 50, name: '关闭率'}],
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
            data:['关闭率'],
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
              name:'关闭率',
              type:'line',
              stack: '总量',
              data:[320, 332, 301, 334, 390, 330, 320]
            }
          ]
        }
        this.charts.kpiTree.setOption(kpiOption)
        this.charts.kpiLineTree.setOption(kpiLineOption)
      },
      _resize(){
        for(let char in this.charts){
          this.charts[char].resize()
        }
      },
      _requestData () {
        if(this.selectIndex == 2){
          this.initTab3()
          return
        }
        let _num = this.selectIndex + 1
        request.get(getUrl('faultType'),{dataType:this.dataType[this.selectIndex]}).then(res => {
          if(res.success){
            this.chartsData = res.data
          }else {
            this.chartsData={appName: {}, cacsi: {}, type: {}, depart: {}, status: {}}
          }
          this["initTab" + _num ]()
        }, error => {
          this.chartsData={appName: {}, cacsi: {}, type: {}, depart: {}, status: {}}
          this["initTab" + _num ]()
        })
      },
      tabDataRefresh(val){
        this.dataType[this.selectIndex] = val
        this._requestData()
      },
      getData(key,type){
        let newKey = []
        let _data = []
        let index = 1
        for(let item in this.chartsData[key]){
          if(index<6){
            newKey.push(item)
            _data.push(this.chartsData[key][item])
          }
          index ++
        }
        if(type == 'key'){
          return newKey
        }else {
          return _data
        }
      },
      _getChartPie(key ,type){
        const _arrData ={
          type:{1:'普通',2:'可用性',3:'问询'},
          cacsi:{30:'满意',20:'一般',10:'不满意'}
        }
        let newKey = []
        let _data = []
        let index = 1

        for(let item in this.chartsData[key]){
          if(index<6){
             newKey.push(_arrData[key][item])
             _data.push({value:this.chartsData[key][item],name:_arrData[key][item]})
          }
          index ++
        }
        if(_data.length == 0){
          _data =   key == 'type'? [{value:0, name:'普通'}, {value:0, name:'问询'}, {value:0, name:'可用性'}] :[{value:0, name:'满意'},{value:0, name:'一般'}, {value:0, name:'不满意'}]
          newKey =   key == 'type'? ['普通', '问询', '可用性']:['满意', '一般', '不满意']
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
