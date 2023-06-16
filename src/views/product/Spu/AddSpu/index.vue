<template>
  <div class="app-container">
    <el-form label-width="80px">
      <!-- 1.spu名称 √ -->
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请输入SPU名称"
          v-model="spuInfo.spuName"
        ></el-input>
      </el-form-item>
      <!-- 2.品牌选择框 √ -->
      <el-form-item label="品牌">
        <el-select placeholder="请选择" v-model="spuInfo.tmId">
          <el-option
            v-for="tradeMark in tradeMarkList"
            :key="tradeMark.id"
            :value="tradeMark.id"
            :label="tradeMark.tmName"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 3.spu描述文本域 √ -->
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          :rows="3"
          v-model="spuInfo.description"
          resize="none"
          placeholder="请输入商品描述"
        >
        </el-input>
      </el-form-item>
      <!-- 4.照片墙 √ -->
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuInfo.spuImageList || []"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" width="30%">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 5.销售属性 √ -->
      <el-form-item label="销售属性">
        <!-- 选择框  -->
        <el-select
          :placeholder="`还有${saleAttrListChooseLength}项未选择`"
          v-model="baseSaleAttrChoose"
        >
          <el-option
            v-for="(saleAttr, index) in saleAttrListChoose"
            :key="index"
            :value="saleAttr"
            :label="saleAttr.split(':')[1]"
          ></el-option>
        </el-select>
        <!-- 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="
            baseSaleAttrChoose.length <= 0 ||
            spuInfo.spuSaleAttrList.length >= 3
          "
          @click="addNewSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 表格 -->
        <el-table
          border
          style="margin-top: 20px"
          :data="spuInfo.spuSaleAttrList"
        >
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名"
            align="center"
            width="120"
            prop="saleAttrName"
          ></el-table-column>
          <!-- 属性值值名称列 -->
          <el-table-column label="属性值名称列表" align="center">
            <template v-slot="{ row }">
              <!--  @close="handleClose(tag)" -->
              <el-tag
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleClose(index, row)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"
                   @blur="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >新增属性</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            prop="saleAttrName"
          >
            <template v-slot="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteSaleAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 6.保存、取消按钮 -->
      <el-form-item>
        <el-button type="primary" @click="SaveUpdateSpu">保存</el-button>
        <el-button @click="cancelAddSpu">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddSpu',
  data() {
    return {
      //照片墙数据
      dialogImageUrl: '',
      dialogVisible: false,

      //新建SPU带给服务器的字段
      spuInfo: {
        //三级分类id
        category3Id: this.category3Id,
        //商品名称
        spuName: '',
        //商品描述
        description: '',
        //销售属性的列表
        spuSaleAttrList: [],
        //处理过后的照片墙数据
        spuImageList: [],
        //品牌的id值
        tmId: '',
      },
      //品牌信息
      tradeMarkList: [],
      //销售属性
      baseSaleAttrList: [],

      //销售属性的选择
      baseSaleAttrChoose: '',
    }
  },
  //通过父组件传递spuId
  props: ['spuId', 'category3Id'],
  computed: {
    //1.剩余未选择的销售属性长度
    saleAttrListChooseLength() {
      return this.baseSaleAttrList.length - this.spuInfo.spuSaleAttrList.length
    },
    //2.计算出未选择的销售属性数组
    saleAttrListChoose() {
      //总共的可选择属性 this.baseSaleAttrList
      //现在有的数据  this.spuInfo.spuSaleAttrList
      let baseAttrList = []
      let difference = []
      this.baseSaleAttrList.forEach((baseAttr) => {
        baseAttrList.push(`${baseAttr.id}:${baseAttr.name}`)
        this.spuInfo.spuSaleAttrList.forEach((spuAttr) => {
          if (baseAttr.name == spuAttr.saleAttrName) {
            difference.push(`${baseAttr.id}:${baseAttr.name}`)
          }
        })
      })
      let result = new Set(
        baseAttrList.filter((x) => !new Set(difference).has(x))
      )
      return result
    },
  },
  methods: {
    //1.取消添加spu 返回spulist页面
    cancelAddSpu() {
      //通知父组件切换显示
      this.$emit('showSpuList')
    },
    //2.发起网络请求
    async getSpuInfo() {
      //当spuId存在时才发起请求
      if (this.spuId) {
        let spuBaseInfo = await this.$API.spu.reqSpu(this.spuId)
        if (spuBaseInfo.code == 200) {
          this.spuInfo = spuBaseInfo.data
          this.spuInfo.spuSaleAttrList.forEach((item) => {
            this.$set(item, 'inputVisible', false)
            this.$set(item, 'inputValue', '')
          })
        }
        //因为element-ui中需要使用name url 字段 给它加上后在存储
        let spuImagelist = await this.$API.spu.reqSpuImagelist(this.spuId)
        if (spuImagelist.code == 200) {
          let listAraay = spuImagelist.data
          listAraay.forEach((item) => {
            item.name = item.imgName
            item.url = item.imgUrl
          })
          this.spuInfo.spuImageList = listAraay
        }
      }
      let TradeMarkList = await this.$API.spu.reqTradeMarkList()
      let BasesaleAttrList = await this.$API.spu.reqBasesaleAttrList()
      if (TradeMarkList.code == 200) {
        this.tradeMarkList = TradeMarkList.data
      }
      if (BasesaleAttrList.code == 200) {
        this.baseSaleAttrList = BasesaleAttrList.data
      }
    },

    //3.照片墙移除的钩子
    handleRemove(file, fileList) {
      //移除照片将剩余的文件列表赋值给spuImagelist存储
      this.spuInfo.spuImageList = fileList
    },
    //4.照片墙放大查看的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //5.照片上传成功钩子
    handleSuccess(response, file, fileList) {
      //新增的图片没有服务器需要的字段 imgName imgUrl 遍历加上后在存储
      file.url = response.data
      this.$set(file, 'imgUrl', response.data)
      this.$set(file, 'imgName', file.name)
      this.spuInfo.spuImageList.push(file)
    },

    //1.新增销售属性 弹出input框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //2.tag标签确定事件
    handleInputConfirm(row) {
      if (row.inputValue.trim()) {
        //处理新数据
        let newTag = {
          baseSaleAttrId: 1,
          isChecked: null,
          saleAttrName: '',
          saleAttrValueName: '',
          spuId: undefined,
        }
        newTag.spuId = this.spuInfo.tmId
        newTag.saleAttrName = row.saleAttrName
        newTag.baseSaleAttrId = row.baseSaleAttrId
        newTag.saleAttrValueName = row.inputValue
        row.spuSaleAttrValueList.push(newTag)
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    //3.tag标签关闭事件
    handleClose(index, row) {
      this.$delete(row.spuSaleAttrValueList, index)
    },
    //4.添加新商品属性
    addNewSaleAttr() {
      const { baseSaleAttrChoose, spuInfo } = this
      if (baseSaleAttrChoose) {
        const attr = baseSaleAttrChoose.split(':')
        spuInfo.spuSaleAttrList.push({
          baseSaleAttrId: attr[0],
          inputValue: '',
          inputVisible: false,
          saleAttrName: attr[1],
          spuId: this.spuInfo.tmId,
          spuSaleAttrValueList: [],
        })
      }
      this.baseSaleAttrChoose = ''
    },
    //5.删除商品属性
    deleteSaleAttr(index) {
      this.$delete(this.spuInfo.spuSaleAttrList, index)
    },

    //1.修改或新增spu事件
    async SaveUpdateSpu() {
      let result = await this.$API.spu.reqSaveUpdateSpu(this.spuInfo)
      if (result.code == 200) {
        //弹出成功提示
        this.$message({ type: 'success', message: '新增spu成功' })
        //返回spu列表页面
        this.cancelAddSpu()
        //重新请求页面  如果新增spu跳转到第一页  如果为修改页面，保持原页码 stay表示当前页码不变
        this.$emit('reQuestSpuList', this.spuInfo.id ? 'stay' : 1)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message || 'fail'))
      }
    },
  },
  mounted() {
    //发起请求
    this.getSpuInfo()
  },
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>