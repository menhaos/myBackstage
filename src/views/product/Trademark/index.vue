<template>
  <div class="app-container">
    <!-- 1.el-button 按钮 
      type 按钮类型
      icon 图标
      size 按钮大小
      click 将弹出框显示
    -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="medium"
      @click="dialogFormVisible = true"
      >上传商品</el-button
    >

    <!-- 2.el-table  列表
      style 自己添加的样式
      data  表格绑定的数据  数据格式为array
      border 边框
    -->
    <el-table
      style="width: 100%; margin-top: 20px"
      :data="trademarkList"
      border
    >
      <!-- 列表项目 el-table-column  是以一列为一个子项目
      label 列名称
      width 宽度(px)  未指定默认平分剩余长度
      align 居中
      type  列的类型
      prop  接收的 array.item.xxx 属性

      注意：需要在表格里面额外添加html结构 使用作用域插槽  <template v-slot="{ row, $index }"> xxx </template> (xxx为想要的结构)
           其中row为array.item $index为对应的索引值
     -->
      <!-- 第一列 序号 -->
      <el-table-column label="序号" width="100" align="center" type="index">
      </el-table-column>
      <!-- 第二列 品牌名称 -->
      <el-table-column label="品牌名称" prop="tmName" align="center">
      </el-table-column>
      <!-- 第三列 品牌logo 使用作用域插槽-->
      <el-table-column label="品牌logo" align="center">
        <!-- v-slot接收到的数据可以结构出row和$index 分别代表每一行数据和索引值 -->
        <!-- 这里由于数据错乱，需要我们重新自定义图片 -->
        <template v-slot="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 70; height: 70px" />
        </template>
      </el-table-column>
      <!-- 第四列 操作列表  使用作用域插槽-->
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="updateTrademarkInfo(row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteTrademarkInfo(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 3.el-pagination 分页器
      1.每页数量改变事件
      @size-change="handleSizeChange(pageSize)"  它会返回当前每页显示的数据数量
      2.当前页码改变事件
      @current-change="handleCurrentChange(currentPage)" 它会返回当前的页码

      page-sizes   可选择的每一页的数据个数
      page-size    当前每一页数据个数
      current-page 当前页数
      page-count   分页器可以显示的最大按钮数量
      layout       分页器结构布局
      total        总数据条数
     -->
    <el-pagination
      style="margin-top: 30px"
      align="center"
      :current-page="page"
      :page-sizes="[3, 4, 5, 6]"
      :page-size="limit"
      :page-count="6"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 4.el-dialog  弹出框 
      title    标题
      visible  是否显示弹出框
      @close   弹出框关闭对应的事件
    -->
    <el-dialog
      title="收货地址"
      :visible.sync="dialogFormVisible"
      @close="resetTmInfo"
    >
      <!-- 5.el-form 表单 
        label-width  使表单对齐
        model        绑定表单数据
        rules        绑定验证规则
        ref          用于提交表单时验证
       -->
      <el-form label-width="100px" :model="tmInfo" :rules="rules" ref="form">
        <!-- 这里的prop 接收需要验证的属性名称 -->
        <el-form-item label="商品名称" prop="tmName">
          <el-input v-model="tmInfo.tmName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO">
          <!-- 6.el-upload 上传
            :on-success="handleAvatarSuccess"   文件上传成功的回调
            :before-upload="beforeAvatarUpload"  文件上传之前的回调
            action 上传的地址
            show-file-list 是否展示已上传文件列表
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmInfo.logoUrl" :src="tmInfo.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendTrademarkInfo('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      trademarkList: [],

      //控制对话框的显示隐藏
      dialogFormVisible: false,
      //表单数据
      tmInfo: {
        id: undefined,
        tmName: '',
        logoUrl: '',
      },
      //表单验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //1.获取列表信息
    async getTrademarkList() {
      const { page, limit } = this
      let result = await this.$API.trademark.reqTrademarkList(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.trademarkList = result.data.records
        return Promise.resolve(result.data.records)
      } else {
        return new Error(result.message || 'fail')
      }
    },
    //2.当前页码改变事件
    handleCurrentChange(currentPage) {
      //重置页数并发起请求
      this.page = currentPage
      this.getTrademarkList()
    },
    //3.每页渲染数量变化时
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getTrademarkList()
    },
    //4.文件上传成功 展示图片，将图片的地址赋值给表单数据和上传组件的图片展示区域
    handleAvatarSuccess(res, file) {
      this.tmInfo.logoUrl = res.data
    },
    //5.文件上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //6.发起网络请求，上传新数据
    sendTrademarkInfo(formName) {
      //表单验证
      this.$refs[formName].validate(async (success) => {
        //验证成功后
        if (success) {
          //两种情况   1.带上id为修改数据  2.不带id为新增数据
          let result = null
          if (this.tmInfo.id) {
            result = await this.$API.trademark.reqUpdateGoods(this.tmInfo)
          } else {
            result = await this.$API.trademark.reqSaveNewGoods(this.tmInfo)
          }
          //请求成功 1.弹出成功提示 2.关闭弹出层 3.重新渲染页面
          if (result.code == 200) {
            Message({
              message: '提交信息成功',
              type: 'success',
              duration: 1500,
            })
            //如果是上传新数据 自动跳转到最后一页   修改数据不改变页码
            if (!this.tmInfo.id) {
              this.$nextTick(function () {
                const lastPage = parseInt(this.total / this.limit) + 1
                this.page = lastPage
                this.getTrademarkList()
              })
            } else {
              this.getTrademarkList()
            }
            this.dialogFormVisible = false
          } else {
            Message({
              message: result.message || 'fail',
              type: 'error',
              duration: 1500,
            })
            this.dialogFormVisible = false
          }
        } else {
          //验证失败抛出错误
          return Promise.reject(new Error('表单验证失败!!'))
        }
      })
    },
    //7.修改数据信息
    updateTrademarkInfo(row) {
      //1.显示弹出层
      this.dialogFormVisible = true
      //2.更改数据
      this.tmInfo.tmName = row.tmName
      this.tmInfo.logoUrl = row.logoUrl
      this.tmInfo.id = row.id
    },
    //8.删除数据信息
    async deleteTrademarkInfo(id) {
      let result = await this.$API.trademark.reqDeleteGoods(id)
      //删除成功  1.弹出成功提示 2.重新请求页面
      if (result.code == 200) {
        Message({
          message: '删除成功',
          type: 'success',
          duration: 1500,
        })
        let result = await this.getTrademarkList()
        //删除之后当前页数据为空 跳到上一页
        if (result.length == 0) {
          this.page -= 1
          this.getTrademarkList()
        }
      } else {
        Message({
          message: result.message || 'fail',
          type: 'error',
          duration: 1500,
        })
      }
    },
    //9.重置商品信息
    resetTmInfo() {
      this.tmInfo.id = undefined
      this.tmInfo.tmName = ''
      this.tmInfo.logoUrl = ''
    },
  },
  mounted() {
    this.getTrademarkList()
  },
}
</script>

<!-- 这里需要去掉scoped 让外部样式渲染里面的样式 -->
<style  lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-upload__tip {
}
</style>