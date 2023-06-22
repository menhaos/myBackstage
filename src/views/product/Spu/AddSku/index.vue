<template>
  <div class="app-container">
    <el-form label-width="80px">
      <!-- spu名称 -->
      <el-form-item label="SPU名称">
        {{ editSpu.spuName }}
      </el-form-item>
      <!-- sku名称 -->
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)"></el-input>
      </el-form-item>
      <!-- 重量 -->
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <!-- 描述 -->
      <el-form-item label="规格描述">
        <el-input
          v-model="skuInfo.skuDesc"
          placeholder="规格描述"
          type="textarea"
          rows="3"
          resize="none"
        ></el-input>
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <el-form inline>
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select
              v-model="attr.AttrIdAndValueID"
              :placeholder="`请选择${attr.attrName}}`"
            >
              <el-option
                :value="`${attrValue.attrId}:${attrValue.id}`"
                :label="attrValue.valueName"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form inline>
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              v-model="saleAttr.SpuIdAndValueID"
              :placeholder="`请选择${saleAttr.saleAttrName}}`"
            >
              <el-option
                :value="`${saleAttrValue.spuId}:${saleAttrValue.id}`"
                :label="saleAttrValue.saleAttrValueName"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <el-table
          border
          :data="spuImagelist"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="图片" align="center">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" align="center" prop="imgName">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="{ row }">
              <el-button
                type="primary"
                size="small"
                v-show="row.isDefault == 0"
                @click="setDefaultImage(row)"
                >设为默认</el-button
              >
              <el-tag type="success" v-show="row.isDefault == 1"
                >默认图片</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="saveSku">确定</el-button>
        <el-button @click="cancelAddSku">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddSku',
  props: ['editSpu', 'CategoryId'],
  data() {
    return {
      //收集的sku字段
      skuInfo: {
        //1.父组件数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //2.表单数据
        skuName: '',
        price: '',
        weight: '',
        skuDesc: '',
        //3.需要处理的列表
        //默认图片
        skuDefaultImg: '',
        //图片列表
        skuImageList: [],
        //平台属性
        skuAttrValueList: [
          {
            //收集平台属性 名称和值的id
            attrId: 0,
            valueId: 0,
          },
        ],
        //销售属性
        skuSaleAttrValueList: [
          {
            //收集销售属性  名称和值的id
            saleAttrId: 0,
            saleAttrValueId: 0,
          },
        ],
      },

      //1.存储请求到的图片
      spuImagelist: [],
      //2.存储销售销售属性
      saleAttrList: [],
      //3.存储平台属性列表
      attrList: [],
    }
  },
  methods: {
    //1.发起网路请求获取数据
    async getSkuInfo() {
      const { id } = this.editSpu
      const { category1Id, category2Id, category3Id } = this.CategoryId
      this.skuInfo.category3Id = category3Id
      this.skuInfo.tmId = this.editSpu.tmId
      this.skuInfo.spuId = this.editSpu.id
      //1.请求图片列表
      let spuImagelist = await this.$API.sku.reqSpuImagelist(id)
      if (spuImagelist.code == 200) {
        //请求成功，将所有的数据加上isDefault字段 0表示未被选中
        spuImagelist.data.forEach((item) => {
          this.$set(item, 'isDefault', 0)
        })
        this.spuImagelist = spuImagelist.data
      }
      //2.请求销售属性
      let saleAttrList = await this.$API.sku.reqBasesaleAttrList(id)
      if (saleAttrList.code == 200) {
        this.saleAttrList = saleAttrList.data
      }
      //3.请求平台销售属性
      let attrList = await this.$API.sku.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      )
      if (attrList.code == 200) {
        this.attrList = attrList.data
      }
    },
    //2.取消添加sku 跳转到spuList页面
    cancelAddSku() {
      this.$emit('showSpuList')
    },
    //3.设置默认图片
    setDefaultImage(row) {
      this.spuImagelist.forEach((item) => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    //4.表格选择事件
    handleSelectionChange(imageList) {
      this.skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      })
    },
    //5.提交sku
    async saveSku() {
      //处理skuAttrValueList信息
      this.skuInfo.skuAttrValueList = this.attrList.reduce((pre, item) => {
        //如果这个属性存在
        if (item.AttrIdAndValueID) {
          const [attrId, valueId] = item.AttrIdAndValueID.split(':')
          pre.push({ attrId, valueId })
        }
        return pre
      }, [])
      //处理skuSaleAttrValueList信息
      this.skuInfo.skuSaleAttrValueList = this.saleAttrList.reduce(
        (pre, item) => {
          if (item.SpuIdAndValueID) {
            const [saleAttrId, saleAttrValueId] =
              item.SpuIdAndValueID.split(':')
            pre.push({ saleAttrId, saleAttrValueId })
          }
          return pre
        },
        []
      )
      //发起网络请求提交信息
      let result = await this.$API.sku.reqAddSku(this.skuInfo)
      if (result.code == 200) {
        //成功提示信息，跳转到spuList页面
        this.$message({ type: 'success', message: '添加sku成功' })
        this.$emit('showSpuList')
      }
    },
  },
  mounted() {
    this.getSkuInfo()
  },
}
</script>

<style>
</style>