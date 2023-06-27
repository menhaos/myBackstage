<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '10px' }">
      <!-- 头部区域 -->
      <div slot="header" class="clearfix">
        <span>销售额占比</span>
        <el-radio-group v-model="radioValue" size="small" style="float: right">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="线下"></el-radio-button>
        </el-radio-group>
      </div>
      <!-- 内容 -->
      <div class="SaleShare-content" id="saleShare-charts"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'SaleShare',
  data() {
    return {
      radioValue: '全部渠道',
      saleShareChart: null,
    }
  },
  mounted() {
    this.saleShareChart = echarts.init(
      document.querySelector('#saleShare-charts')
    )
    this.saleShareChart.setOption({
      title: {
        text: '',
        subtext: '',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 30,
        },
        subtextStyle: {
          fontSize: 20,
        },
        show: true,
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}\n{c}',
            fontSize: '16px',
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' },
          ],
        },
      ],
    })
    //
    this.saleShareChart.on('mouseover', (content) => {
      this.saleShareChart.setOption({
        title: {
          text: content.data.name,
          subtext: content.data.value,
        },
      })
    })
  },
}
</script>

<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
</style>

<style lang="scss" scoped>
.box-card {
  .SaleShare-content {
    width: 100%;
    height: 350px;
  }
}
</style>