<template>
  <div>
    <span @click="resetDateArray('day', 0)" :class="{ active: active == 0 }"
      >今日</span
    >
    <span @click="resetDateArray('week', 1)" :class="{ active: active == 1 }"
      >本周</span
    >
    <span @click="resetDateArray('month', 2)" :class="{ active: active == 2 }"
      >本月</span
    >
    <span @click="resetDateArray('year', 3)" :class="{ active: active == 3 }"
      >本年</span
    >
    <el-date-picker
      v-model="dateArray"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size="mini"
    >
    </el-date-picker>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'DatePicker',
  data() {
    return {
      //控制active的显示
      active: 0,
      //日期的范围
      dateArray: [],
    }
  },
  methods: {
    //选择当天 本星期 本月 本年
    resetDateArray(type, index) {
      //更改样式
      this.active = index
      //设置时间
      let start = ''
      let end = ''
      if (type == 'day') {
        start = dayjs().format('YYYY-MM-DD')
        end = dayjs().format('YYYY-MM-DD')
      } else if (type == 'week') {
        start = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')
        end = dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD')
      } else if (type == 'month') {
        start = dayjs().startOf('month').format('YYYY-MM-DD')
        end = dayjs().endOf('month').format('YYYY-MM-DD')
      } else if (type == 'year') {
        start = dayjs().startOf('year').format('YYYY-MM-DD')
        end = dayjs().endOf('year').format('YYYY-MM-DD')
      }
      this.dateArray = [start, end]
    },
  },
}
</script>

<style lang="scss" scoped>
span {
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}
.active {
  color: rgb(220, 102, 102);
}
</style>