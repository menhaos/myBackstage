<template>
  <div class="app-container">
    <!-- table表格 -->
    <el-table border :data="skuList">
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="名称"
        align="center"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        align="center"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="默认图片" align="center" width="120">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(KG)"
        align="center"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        align="center"
        width="80"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button
            style="margin: 0 5px"
            type="success"
            icon="el-icon-top"
            size="small"
            v-if="row.isSale == 0"
            @click="skuSale(row)"
          ></el-button>
          <el-button
            style="margin: 0 5px"
            type="info"
            icon="el-icon-bottom"
            size="small"
            v-if="row.isSale == 1"
            @click="skuSoldOut(row)"
          ></el-button>
          <el-button
            style="margin: 0 5px"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="skuEdit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="small"
            style="margin: 0 5px"
            @click="getSkuInfo(row)"
          ></el-button>

          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该商品吗？"
            @onConfirm="deleteSku(row)"
          >
            <el-button
              style="margin: 0 5px"
              type="danger"
              icon="el-icon-delete"
              size="small"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      align="center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[6, 8, 10]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 抽屉展示sku详情 -->
    <el-drawer
      :visible.sync="showDrawer"
      :before-close="handleCloseDrawer"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="4">名称:</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">描述:</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">价格:</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">平台属性:</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="tag in skuInfo.skuAttrValueList"
            :key="tag.id"
            style="margin: 0 5px"
          >
            {{ tag.attrName }}-{{ tag.valueName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">商品图片:</el-col>
        <el-col :span="16">
          <el-carousel style="height: 300px; width: 300px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" style="width: 100%; height: 100%" />
            </el-carousel-item> </el-carousel
        ></el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 6,
      total: 0,
      //sku列表
      skuList: [],
      //存储当前sku信息  这里需要初始化一些数据，防止undefined
      skuInfo: {
        skuName: '',
        skuDesc: '',
        price: '',
        skuAttrValueList: [],
        skuImageList: [],
      },
      //展示抽屉
      showDrawer: false,
    }
  },
  methods: {
    //1.发起请求skuList列表
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      let result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.skuList = result.data.records
      }
    },
    //2.每页数量改变
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    //3.商品上架请求
    async skuSale(row) {
      let result = await this.$API.sku.reqsale(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '上架商品成功' })
        row.isSale = 1
      }
    },
    //4.商品下架请求
    async skuSoldOut(row) {
      let result = await this.$API.sku.reqCancel(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '下架商品成功' })
        row.isSale = 0
      }
    },
    //5.sku编辑
    skuEdit() {
      this.$message({ type: 'info', message: '功能正在开发中' })
    },
    //6.展示当前sku详情
    async getSkuInfo(row) {
      this.showDrawer = true
      let result = await this.$API.sku.reqSkuById(row.id)
      if (result.code == 200) {
        this.skuInfo = result.data
      }
    },
    //7.关闭抽屉
    handleCloseDrawer(done) {
      this.skuInfo = {
        skuName: '',
        skuDesc: '',
        price: '',
        skuAttrValueList: [],
        skuImageList: [],
      }
      done()
    },
    //8.删除sku
    async deleteSku(row) {
      let result = await this.$API.sku.reqDeleteSku(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '删除sku成功' })
        this.getSkuList(this.page)
      }
    },
  },
  mounted() {
    this.getSkuList()
  },
}
</script>

<!-- 自定义样式 -->
<style>
.el-row .el-col-4 {
  font-size: 20px;
  font-weight: 700;
  text-align: right;
  margin-right: 10px;
}
.el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>

<!-- 布局样式 -->
<style>
.el-row {
  margin-bottom: 20px;
}
.el-row::last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

<!-- 轮播图样式 -->
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>