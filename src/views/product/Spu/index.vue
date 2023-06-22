<template>
  <div>
    <el-card shadow="always" style="margin: 20px 10px">
      <!-- 
        @getInfoList="getAttrInfo" //触发三级分类选择时获取数据列表
        @resetAttrList="resetAttrList"//重置数据
        :selectDisabled="!isShowAttrList" //禁用事件
       -->
      <CategorySelect
        @getInfoList="getSpuList"
        @resetAttrList="resetAttrList"
        :selectDisabled="show != 0"
      ></CategorySelect>
    </el-card>
    <el-card shadow="always" style="margin: 20px 10px">
      <!-- spu列表视图 -->
      <div class="spuList" v-if="show == 0">
        <!-- 1.上传按钮 -->
        <el-button
          type="primary"
          style="margin-bottom: 20px"
          :disabled="spuList.length <= 0"
          @click="addSpuInfo"
          >添加SPU</el-button
        >
        <!-- 2.table组件 -->
        <el-table border :data="spuList">
          <!-- 序号 -->
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <!-- spu名称 -->
          <el-table-column
            label="spu名称"
            align="center"
            prop="spuName"
          ></el-table-column>
          <!-- spu描述 -->
          <el-table-column
            label="spu描述"
            align="center"
            prop="description"
          ></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" align="center">
            <template v-slot="{ row }">
              <el-tooltip content="添加sku" placement="top" :open-delay="500">
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  size="small"
                  style="margin: 0 5px"
                  @click="addSku(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="编辑spu" placement="top" :open-delay="500">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="small"
                  style="margin: 0 5px"
                  @click="editSpuInfo(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="spu信息" placement="top" :open-delay="500">
                <el-button
                  type="info"
                  icon="el-icon-info"
                  size="small"
                  style="margin: 0 5px"
                  @click="showSkuInfo(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除spu" placement="top" :open-delay="500">
                <el-popconfirm
                  :title="`确定删除${row.spuName}吗？`"
                  @onConfirm="deleteSpu(row)"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    slot="reference"
                    style="margin: 0 5px"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 3.分页器 -->
        <el-pagination
          style="margin-top: 20px"
          align="center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 4, 5]"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout=" prev, pager, next, jumper, ->, sizes, total"
        ></el-pagination>
      </div>

      <!-- 添加spu 修改spu模块 -->
      <AddSpu
        v-if="show == 1"
        @showSpuList="showSpuList"
        :spuId="editSpuID"
        :category3Id="CategoryId.category3Id || undefined"
        @reQuestSpuList="reQuestSpuList"
      ></AddSpu>

      <!-- 添加sku模块 -->
      <AddSku
        v-if="show == 2"
        ref="addSku"
        :editSpu="editSpu"
        :CategoryId="CategoryId"
        @showSpuList="showSpuList"
      ></AddSku>
    </el-card>

    <!-- 弹出框 -->
    <el-dialog
      :title="`${spuTitle}的Sku列表`"
      :visible.sync="dialogTableVisible"
      @close="closeSkuInfoList"
    >
      <el-table :data="skuInfoList" v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          align="center"
        ></el-table-column>
        <el-table-column label="默认图片" align="center">
          <template v-slot="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import AddSpu from './AddSpu/index.vue'
import AddSku from './AddSku/index.vue'
export default {
  name: 'Spu',
  data() {
    return {
      //存储CategoryId
      CategoryId: {},
      //存储商品信息
      spuList: [],

      //当前页码
      page: 1,
      //每页展示数据
      limit: 5,
      //数据总量
      total: 0,

      //控制显示哪个组件
      show: 0,

      //当前编辑的SpuId
      editSpuID: undefined,
      //当前添加sku的spu信息
      editSpu: undefined,

      //存储当前spu的sku信息
      skuInfoList: [],
      spuTitle: '',
      dialogTableVisible: false,
      //加载动画
      loading: true,
    }
  },
  components: {
    AddSpu,
    AddSku,
  },
  methods: {
    //1.获取spu展示列表
    async getSpuList(category1Id, category2Id, category3Id) {
      const { page, limit } = this
      let result = await this.$API.spu.reqSpulist(page, limit, category3Id)
      if (result.code == 200) {
        //将需要的数据存储起来
        this.CategoryId = { category1Id, category2Id, category3Id }
        this.total = result.data.total
        this.spuList = result.data.records
        return 'ok'
      } else {
        this.$message({ type: 'error', message: '请求spu列表失败' })
        return Promise.reject(new Error(result.message || 'fail'))
      }
    },
    //2.重置spu列表信息
    resetAttrList() {
      this.spuList = []
    },
    //3.页码改变事件
    handleCurrentChange(page) {
      this.reQuestSpuList(page)
    },
    //4.每页展示数量改变事件
    handleSizeChange(limit) {
      this.limit = limit
      const { category1Id, category2Id, category3Id } = this.CategoryId
      this.getSpuList(category1Id, category2Id, category3Id)
    },
    //5.重新请求数据
    reQuestSpuList(page) {
      if (page != 'stay') {
        this.page = page
      }
      const { category1Id, category2Id, category3Id } = this.CategoryId
      this.getSpuList(category1Id, category2Id, category3Id)
    },

    //1.添加Spu信息
    addSpuInfo() {
      this.show = 1
    },
    //2.编辑Spu信息
    editSpuInfo(row) {
      this.show = 1
      const { id } = row
      this.editSpuID = id
    },
    //3.自定义事件展示spuList
    showSpuList() {
      this.show = 0
      //清空editSpuID
      this.editSpuID = undefined
      this.editSpu = undefined
    },

    //1.删除spu列
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '删除spu成功' })
        //重新加载页面
        //1.当前页商品数量大于1 返回'stay' 即保持当前页数  2.当前页数量小于等于1 删除后当前页没数据 所以跳转到上一页
        let page = this.spuList.length > 1 ? 'stay' : this.page - 1
        // 保证page不能为 0
        if (page instanceof Number && page < 1) {
          page = 1
        }
        this.reQuestSpuList(page)
      }
    },
    //2.添加Sku
    addSku(row) {
      //通过ref方式触发子组件的方法 不行 应为子组件为v-if在dom中不存在3
      this.editSpu = row
      this.show = 2
    },
    //3.展示sku列表
    async showSkuInfo(row) {
      //打开对话框
      this.dialogTableVisible = true
      let result = await this.$API.sku.reqSkuInfo(row.id)
      if (result.code == 200) {
        //存储信息
        this.spuTitle = row.spuName
        this.skuInfoList = result.data
        //关闭加载动画
        this.loading = false
      } else {
        this.$message({ type: 'error', message: result.message || 'fail' })
        this.loading = false
      }
    },
    //4.关闭sku列表
    closeSkuInfoList() {
      //清空信息
      this.skuInfoList = []
      this.spuTitle = ''
      //开启loading动画
      this.loading = true
    },
  },
}
</script>

<style>
</style>