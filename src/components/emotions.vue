<!--
 * @Author: chanfun
 * @Date: 2022-11-02 19:50:19
 * @LastEditors: chanfun
 * @LastEditTime: 2022-11-11 20:47:38
 * @FilePath: \emo_sys\ems_fe\src\components\emotions.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by `chanfun`, All Rights Reserved. 
-->
<template>
  <div>
    <h2> 当前课程表情分布 </h2>
    <div v-if="$store.state.classStart && Object.keys(this.emotionsData).length > 0">
      <div class="echart" id="pieChart" :style="{ float: 'right', width: '50%', height: '300px' }"></div>
      <div class="echart" id="barChart" :style="{ float: 'right', width: '50%', height: '300px' }"></div>
      <div class="echart" id="stackedLine" :style="{ float: 'left', width: '100%', height: '300px' }"></div>
    </div>
    <div v-else>
      <div>
        <!-- class="wait" -->
        <h2> 您当前没有进行中的课程或者尚无学生投票 </h2>
      </div>
    </div>

    <div>
      平均分: {{ average }}
      方差: {{ variance }}
    </div>

    <div>
      <h2> 查询其他课程</h2>
      <el-button type="primary" @click="dialogFormVisible = true">查询按钮</el-button>
      <el-button type="success" @click="reDraw()">刷新按钮</el-button>
    </div>

    <!-- 查询下拉框 -->
    <div>
      <el-dialog :visible.sync="dialogFormVisible" append-to-body>
        <el-form :model="form">
          <el-form-item label="查询课程" :label-width="formLabelWidth">
            <el-select v-model="form.selectedOptionIndex" placeholder="表情评价">
              <el-option v-for="(item, index) in this.courseList" :key="index" :label="item.name" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="resetDataForSearch()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>


</template>

<script>
import * as echarts from "echarts";

const scoreEmoMap = { "1": "😇 1分", "2": "😅 2分", "3": "🤣 3分", "4": "😂 4分", "5": "😀 5分", "6": "😊 6分" };

export default {
  name: 'emotions',
  props: {
    emotionsData: {
      type: Object,
      required: true
    },
    courseList: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      originDisData: {},
      drawAllFlag: true,
      drawStackedLineFlag: true,
      dialogFormVisible: false,
      form: {
        selectedOptionIndex: 0, // 选中的查询课程
      },
      formLabelWidth: '120px',
      average: -1,
      variance: 0
    }
  },
  mounted() {
    this.originDisData = this.emotionsData;
    this.drawAllFlag = this.$store.state.classStart && Object.keys(this.originDisData).length > 0;
    this.drawStackedLineFlag = this.drawAllFlag;
    this.uniformEmotionDis(this.emotionsData);
    let personsCount = 0;
    let scoresSum = 0;
    for (let key in this.emotionsData) {
      let score = parseInt(key);
      let count = this.emotionsData[key];
      scoresSum += score * count;
      personsCount += count;
    }
    console.log("mounted emotionsData:", this.emotionsData);
    this.average = scoresSum / personsCount;
    for (let key in this.emotionsData) {
      let score = parseInt(key);
      let count = this.emotionsData[key];
      this.variance += count * (this.average - score) * (this.average - score);
    }
    this.init();
  },

  methods: {
    reDraw() {
      // set new options for charts
      // if (this.drawAllFlag) {

      // }
    },
    init() {
      console.log("init: classStart: ", this.$store.state.classStart);
      console.log("init: emotionsData: ", this.emotionsData, "-- ", Object.keys(this.emotionsData).length);
      if (this.drawAllFlag) {
        this.initPieChart();
        this.initBarChart();
        this.initStackedLine();
      }
    },
    resetDataForSearch() {
      // update the emotions data and hide the stackedLine 
      this.drawAllFlag = false;
      this.drawStackedLineFlag = false;
      let param = {};
      param.courseId = this.courseList[this.form.selectedOptionIndex].courseId;
      this.postRequest("/api/emotion/query", param).then(res => {
        if (!res.code) {
          this.emotionsData = res.data.distribution;
          // this.uniformEmotionDis(this.emotionsData);
          this.dialogFormVisible = false;
          this.reDraw();
        } else {
          this.$message.error("查询失败");
        }
      });
    },
    uniformEmotionDis(emotionsDis) {  // uniform the `emotionsDis`
      if (!emotionsDis) {
        emotionsDis = new Object();
      }
      let initData = {};
      for (let key in scoreEmoMap) {
        initData[key] = 0;
      }
      for (let key in emotionsDis) {
        initData[key] = emotionsDis[key];
      } // -> Object.assign(initData, emotionsDis);
      for (let member in emotionsDis) {
        delete emotionsDis[member];
      }
      console.log("uniformEmotionDis():", emotionsDis, initData);
      Object.assign(emotionsDis, initData);
      // return initData;
    },
    getTimeStr(timestamp) {
      let time = new Date(timestamp);
      let hour = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
      let minutes = time.getMinutes();
      let res = (hour < 10 ? '0' + hour : hour) + ":" + (minutes < 10 ? '0' + minutes : minutes);
      return res;
    },
    initPieChart() {
      let chartData = [];
      for (let key in this.emotionsData) {
        var obj = {};
        obj.name = scoreEmoMap[key];
        obj.value = this.emotionsData[key];
        chartData.push(obj);
      }
      const option = {
        title: {
          text: '软件工程',
          subtext: '学生投票情况-饼状图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '表情对应人数',
            type: 'pie',
            radius: '50%',
            data: chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      const pieChart = echarts.init(document.getElementById("pieChart"));// 图标初始化
      pieChart.setOption(option);// 渲染页面
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        pieChart.resize();
      });
    },
    initBarChart() {
      let x_labels = [];
      let y_data = [];
      for (let key in this.emotionsData) {
        x_labels.push(scoreEmoMap[key]);
        y_data.push(this.emotionsData[key]);
      }
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: x_labels,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            data: y_data,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }
        ]
      };
      const barChart = echarts.init(document.getElementById("barChart"));// 图标初始化
      barChart.setOption(option);// 渲染页面
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        barChart.resize();
      });
    },
    initStackedLine() {
      const threshold = 1000 * 60 * 7; // 7 mins
      let nowTime = new Date().getTime();
      let classBeginTime = this.$store.state.classBeginTime;
      let x_labels = [];
      let intervalsEmotionData = []; // 各个时间段的表情数据 
      let stackLinesData = []; // echarts series -> 6 类折线数据

      for (let key in scoreEmoMap) {
        let oneLineData = {};
        oneLineData.type = 'line';
        oneLineData.stack = 'Total';
        oneLineData.key = key;
        oneLineData.name = scoreEmoMap[key]; // '😇 1分'
        oneLineData.data = [];
        stackLinesData.push(oneLineData);
      }
      console.log("stackLinesData: ", stackLinesData);

      // class is going less than 7 mins => set `interval` to 1min
      // else => set 7 `interval`s
      let goneTime = nowTime - classBeginTime;
      console.log("goneTime:", goneTime);
      let fixedIntervalFlag = goneTime <= threshold;
      const interval = fixedIntervalFlag ? 1000 * 60 * 1 : Math.ceil(goneTime / 7);
      if (fixedIntervalFlag) {
        console.log("1min interval:", interval);
      } else {
        console.log("横坐标固定 7 个时间段, interval:", interval);
      }

      console.log("class begins at:", this.getTimeStr(classBeginTime));

      // const interval = 1000 * 60 * 1; // 1min
      let leftTime = classBeginTime;
      let rightTime = classBeginTime + interval >= nowTime ? nowTime : classBeginTime + interval;

      let j = 0;
      while (leftTime <= nowTime) {
        let param = new Object();
        param.courseInstanceId = this.$store.classId;
        param.timestamp_begin = leftTime;
        param.timestamp_end = rightTime;
        let timeLabel = this.getTimeStr(leftTime);
        timeLabel += '~' + this.getTimeStr(rightTime);
        x_labels.push(timeLabel);
        this.postRequest('/api/emotion/query', param).then(res => {
          if (!res.code) {
            let dis = res.data.info.distribution; 	// 可能为空? {"1":0, "2": 2, ...}
            this.uniformEmotionDis(dis);
            intervalsEmotionData.push(dis);
            console.log("request", ++j);
            for (let i = 0; i < stackLinesData.length; ++i) {
              // console.log("while-", j, ", for-", i);
              stackLinesData[i].data.push(dis[stackLinesData[i].key]);
              // console.log("stackLinesData[i].data_after_push:", stackLinesData[i].data);
            }
          } else {
            console.log("drawEmotions: emotion_query error:", res.msg);
            this.$message.error(res.msg)
          }
        });
        leftTime += interval;
        rightTime += interval;
      }


      let emoRepres = Object.values(scoreEmoMap);
      console.log("emoRepres:", emoRepres);
      console.log("x_labels:", x_labels);



      const option = {
        title: {
          text: '表情动态折线图',
          left: 'auto'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: emoRepres,
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: x_labels,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 人',
            // ...
          }
        },
        // series 数组每个元素对应一条折线:
        series: stackLinesData
      };
      const stackedLines = echarts.init(document.getElementById("stackedLine"));// 图标初始化
      stackedLines.showLoading();
      // stackedLines.setOption(option);   // 渲染页面
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        stackedLines.resize();
      });

      setTimeout(() => { stackedLines.setOption(option); stackedLines.hideLoading(); }, 2000);
      // let intervalId = setInterval(() => { stackedLines.setOption(option); }, 2000);
    }



  }
};
</script>

<style>
.wait {
  margin-top: 150px;
  font-size: 25px;
  text-align: center;
  color: rgb(200, 200, 200);
}
</style>