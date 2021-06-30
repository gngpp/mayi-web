<template>
  <div v-loading="!show" element-loading-text="数据加载中..." :style="!show ? 'height: 500px' : 'height: 100%'" class="app-container">
    <div v-if="show">
      <el-card class="box-card">
        <div style="color: #666;font-size: 13px;">
          <svg-icon icon-class="system" style="margin-right: 5px" />
          <span>
            系统：{{ data.operatingSystem.os }}
          </span>
          <span>
            IP：{{ data.operatingSystem.ip }}
          </span>
          <span>
            项目已不间断运行：{{ data.operatingSystem.runningDay }}
          </span>
          <i class="el-icon-refresh" style="margin-left: 40px" @click="reset"/>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;color: #666;font-size: 15px">状态</span>
        </div>
        <div>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">CPU使用率</div>
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  {{ data.cpu.name }}
                </div>
                <div style="padding: 3px">
                  {{ data.cpu.package }}
                </div>
                <div style="padding: 3px">
                  {{ data.cpu.core }}
                </div>
                <div style="padding: 3px">
                  {{ data.cpu.logic }}
                </div>
              </div>
              <div class="content">
                <el-progress type="circle" :percentage="parseFloat(data.cpu.used)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ data.cpu.core }} 核心</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">内存使用率</div>
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  总量：{{ data.memory.total }}
                </div>
                <div style="padding: 3px">
                  已使用：{{ data.memory.used }}
                </div>
                <div style="padding: 3px">
                  空闲：{{ data.memory.available }}
                </div>
              </div>
              <div class="content">
                <el-progress type="circle" :percentage="parseFloat(data.memory.usageRate)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ data.memory.used }} / {{ data.memory.total }}</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">交换区使用率</div>
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  总量：{{ data.swap.total }}
                </div>
                <div style="padding: 3px">
                  已使用：{{ data.swap.used }}
                </div>
                <div style="padding: 3px">
                  空闲：{{ data.swap.available }}
                </div>
              </div>
              <div class="content">
                <el-progress type="circle" :percentage="parseFloat(data.swap.usageRate) ? parseFloat(data.swap.usageRate) : 0" />
              </div>
            </el-tooltip>
            <div class="footer">{{ data.swap.used }} / {{ data.swap.total }}</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">磁盘使用率</div>
            <div class="content">
              <el-tooltip placement="top-end">
                <div slot="content" style="font-size: 12px;">
                  <div style="padding: 3px">
                    总量：{{ data.disk.total?data.disk.total:0 }}
                  </div>
                  <div style="padding: 3px">
                    空闲：{{ data.disk.available?data.disk.available:0 }}
                  </div>
                </div>
                <div class="content">
                  <el-progress type="circle" :percentage="parseFloat(data.disk.usageRate)? parseFloat(data.disk.usageRate) : 0" />
                </div>
              </el-tooltip>
            </div>
            <div class="footer">{{ data.disk.used? data.disk.used : 0 }} / {{ data.disk.total?data.disk.total:0 }}</div>
          </el-col>
        </div>
      </el-card>

      <div>
        <el-row :gutter="6">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold;color: #666;font-size: 15px">CPU使用率监控</span>
              </div>
              <div>
                <v-chart :options="cpuInfo" />
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold;color: #666;font-size: 15px">内存使用率监控</span>
              </div>
              <div>
                <v-chart :options="memoryInfo" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import {getToken} from '@/utils/auth'
export default {
  name: 'ServerMonitor',
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      show: false,
      monitor: null,
      socket: null,
      url: '/api/monitor',
      data: {},
      cpuInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            normal: {
              color: 'rgb(32, 160, 255)' // 改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#6fbae1',
              lineStyle: {
                color: '#ff0000' // 改变折线颜色
              }
            }
          }
        }]
      },
      memoryInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            normal: {
              color: 'rgb(32, 160, 255)' // 改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#6fbae1',
              lineStyle: {
                color: '#ff0000' // 改变折线颜色
              }
            }
          }
        }]
      }
    }
  },
  created() {
    this.init()
  },
  destroyed() {
    this.socket.close()
    clearInterval(this.monitor)
  },
  methods: {
    reset() {
      this.cpuInfo.xAxis.data = []
      this.cpuInfo.series.data = []
      this.memoryInfo.xAxis.data = []
      this.memoryInfo.series.data = []
      if (this.socket) {
        this.socket.close()
        this.init()
      } else {
        this.init()
      }
    },
    init() {
      let url = process.env.VUE_APP_WS_API + this.url
      let token = getToken()
      this.socket = new WebSocket(url)
      // 获得消息事件
      let that = this;
      this.socket.onmessage = function (res) {
        that.data = JSON.parse(res.data)
        that.show = true
        that.cpuInfo.xAxis.data.push(that.data.datetime)
        that.memoryInfo.xAxis.data.push(that.data.datetime)
        that.cpuInfo.series[0].data.push(parseFloat(that.data.cpu.used))
        that.memoryInfo.series[0].data.push(parseFloat(that.data.memory.usageRate))
      }

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .box-card {
   box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
   border-radius: 10px;
   margin-bottom: 5px;

   span {
     margin-right: 28px;
   }

   .el-icon-refresh {
     margin-right: 10px;
     float: right;
     cursor: pointer;
   }
 }
  .cpu, .memory, .swap, .disk  {
    width: 20%;
    float: left;
    padding-bottom: 20px;
    margin-right: 5%;
  }
  .title, .footer {
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    color: #999;
    height: 25px;
    line-height: 25px;
  }
  .content {
    text-align: center;
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
