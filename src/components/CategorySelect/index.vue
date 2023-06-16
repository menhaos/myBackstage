<template>
  <div>
    <el-form :inline="true" :model="formInfo" class="demo-form-inline">
      <el-form-item label="一级列表">
        <el-select
          v-model="category1Id"
          placeholder="活动区域"
          @change="getCategory2(2)"
          :disabled="selectDisabled"
        >
          <el-option
            v-for="item in formInfo.category1"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级列表">
        <el-select
          v-model="category2Id"
          placeholder="活动区域"
          @change="getCategory3(3)"
          :disabled="selectDisabled"
        >
          <el-option
            v-for="item in formInfo.category2"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级列表">
        <el-select
          v-model="category3Id"
          placeholder="活动区域"
          @change="getInfoList"
          :disabled="selectDisabled"
        >
          <el-option
            v-for="item in formInfo.category3"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  data() {
    return {
      formInfo: {
        category1: [],
        category2: [],
        category3: [],
      },
      category1Id: '',
      category2Id: '',
      category3Id: '',
    }
  },
  props: ['selectDisabled'],
  methods: {
    //请求一级分类列表
    async getCategory1() {
      let result = await this.$API.attr.reqGetCategory1()
      if (result.code == 200) {
        this.formInfo.category1 = result.data
      } else {
        return Promise.reject(new Error(result.message || 'fail'))
      }
    },
    //请求二级分类列表  在一级列表值变化时触发 change事件
    async getCategory2(id) {
      //重置数据
      this.resetFormInfo(id)
      //获得请求
      let result = await this.$API.attr.reqGetCategory2(this.category1Id)
      if (result.code == 200) {
        this.formInfo.category2 = result.data
        return 'ok'
      } else {
        return new Promise.reject(result.message || 'fail')
      }
    },
    //请求三级分类列表  在二级列表值变化时触发 change事件
    async getCategory3(id) {
      //重置数据
      this.resetFormInfo(id)
      //获得请求
      let result = await this.$API.attr.reqGetCategory3(this.category2Id)
      if (result.code == 200) {
        this.formInfo.category3 = result.data
        return 'ok'
      } else {
        return new Promise.reject(result.message || 'fail')
      }
    },
    //通用方法，重置数据
    resetFormInfo(id) {
      //id为2表示重新请求二级列表  清空二级和三级列表关联数据
      if (id == 2) {
        this.formInfo.category2 = []
        this.formInfo.category3 = []
        this.category2Id = ''
        this.category3Id = ''
        //id为3表示重新请求三级列表  清空三级列表的内容
      } else if (id == 3) {
        this.formInfo.category3 = []
        this.category3Id = ''
      }
      //通知父组件清空表格数据列表
      this.$emit('resetAttrList')
    },
    //三级列表的value值确定后，发起网络请求获取数据
    getInfoList() {
      const { category1Id, category2Id, category3Id } = this
      //由于数据展示是在父组件的，触发父组件的自定义方法，父组件获取数据进行展示
      this.$emit('getInfoList', category1Id, category2Id, category3Id)
    },
  },
  mounted() {
    this.getCategory1()
  },
}
</script>

<style>
</style>