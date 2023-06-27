<template>
  <div>
    <el-card class="box-card">
      <!-- 头部区域 -->
      <div slot="header" class="clearfix">
        <!-- 标题 -->
        <span>线上热门搜索</span>
        <!-- 下拉框 -->
        <el-dropdown style="float: right" size="small">
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>今日</el-dropdown-item>
            <el-dropdown-item>本周</el-dropdown-item>
            <el-dropdown-item>本月</el-dropdown-item>
            <el-dropdown-item>本年</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!-- 内容区域 -->
      <div class="SearchHot-content">
        <!-- 可视化表格区域 -->
        <div class="charts">
          <div class="charts-left charts-item">
            <!-- 表格标题 -->
            <div class="charts-title">
              搜索用户数
              <i class="el-icon-info"></i>
            </div>
            <!-- 表格信息-->
            <div class="charts-info" style="font-size: 14px; margin: 10px 0">
              <span style="margin-right: 20px; font-size: 20px">12321</span>
              17.1
              <i class="el-icon-caret-top" style="color: red"></i>
            </div>
            <!-- 可视化图标 -->
            <div id="charts-searchTotal"></div>
          </div>
          <div class="charts-right charts-item">
            <!-- 表格标题 -->
            <div class="charts-title">
              人均搜索次数
              <i class="el-icon-info"></i>
            </div>
            <!-- 表格信息-->
            <div class="charts-info" style="font-size: 14px; margin: 10px 0">
              <span style="margin-right: 20px; font-size: 20px">2.7</span>
              26.2
              <i class="el-icon-caret-bottom" style="color: green"></i>
            </div>
            <!-- 可视化图标 -->
            <div id="charts-searchAverage"></div>
          </div>
        </div>
        <!-- 表格 -->
        <el-table :data="tableArray" size="mini">
          <el-table-column
            label="排名"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="搜索关键字"
            align="center"
            width="130"
          ></el-table-column>
          <el-table-column
            label="用户数"
            sortable
            align="center"
          ></el-table-column>
          <el-table-column
            label="周涨幅"
            sortable
            align="center"
          ></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          align="center"
          size="mini"
          :total="20"
          :current-page="1"
          :page-size="6"
          layout="prev, pager, next"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'SearchHot',
  data() {
    return {
      tableArray: [],
    }
  },
  mounted() {
    //总共搜索次数
    let searchTotal = echarts.init(
      document.querySelector('#charts-searchTotal')
    )
    searchTotal.setOption({
      grid: {
        left: '10px',
        right: '10px',
      },
      legend: {
        data: ['意向', '预购', '成交'],
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: [45, 35, 53, 21, 32, 41, 51],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(58,77,233,0.8)',
              },
              {
                offset: 1,
                color: 'rgba(58,77,233,0.3)',
              },
            ]),
          },
        },
      ],
    })

    //人均搜索图表
    let searchAverage = echarts.init(
      document.querySelector('#charts-searchAverage')
    )
    searchAverage.setOption({
      grid: {
        left: '10px',
        right: '10px',
      },
      legend: {
        data: ['意向', '预购', '成交'],
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: [31, 24, 47, 25, 36, 43, 32],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(58,77,233,0.8)',
              },
              {
                offset: 1,
                color: 'rgba(58,77,233,0.3)',
              },
            ]),
          },
        },
      ],
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
.SearchHot-content {
  .charts {
    display: flex;
    .charts-item {
      flex: 1;
      &:first-child {
        margin-right: 10px;
      }
      .charts-title {
        font-size: 14px;
      }
      #charts-searchTotal {
        width: 100%;
        height: 70px;
      }
      #charts-searchAverage {
        width: 100%;
        height: 70px;
      }
    }
  }
}
</style>