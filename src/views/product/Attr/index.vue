<template>
  <div>
    <el-card shadow="always" style="margin: 20px 10px">
      <CategorySelect
        @getAttrInfo="getAttrInfo"
        @resetAttrList="resetAttrList"
        :selectDisabled="!isShowAttrList"
      ></CategorySelect>
    </el-card>
    <!-- 数据展示的组件 -->
    <el-card shadow="always" style="margin: 20px 10px">
      <!-- 数据展示页面 -->
      <div class="table-list" v-show="isShowAttrList">
        <!-- 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="attrList.length <= 0"
          @click="isShowAttrList = false"
          >添加属性</el-button
        >
        <!-- 表单 -->
        <el-table :data="attrList" border style="width: 100%">
          <!-- 1.序号列 -->
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <!-- 2.属性名称列 -->
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180"
            align="center"
          >
          </el-table-column>
          <!-- 3.属性值列表列 -->
          <el-table-column prop="address" label="属性值列表">
            <template v-slot="{ row }">
              <el-tag
                v-for="tag in row.attrValueList"
                :key="tag.id"
                type="success"
                style="margin: 0 10px"
              >
                {{ tag.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 4.操作列 -->
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="180"
          >
            <template v-slot="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="small"
                @click="editAttrInfo(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteAttrItem(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 新增数据页面 -->
      <div class="addAttr" v-show="!isShowAttrList">
        <!-- 表单输入 √ -->
        <el-form inline>
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="newAttrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 新增按钮  √ -->
        <!-- 这里的禁用由两个数据控制 在警告状态下或者字符串空情况下都会禁用按钮 -->
        <el-button
          icon="el-icon-plus"
          type="primary"
          :disabled="isWarning || isDisabled"
          @click="addValueName"
          >新增属性</el-button
        >
        <!-- 新增表格 -->
        <el-table :data="newAttrInfo.attrValueList" style="margin: 20px 0">
          <!-- 序号列表 -->
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          ></el-table-column>
          <!-- 属性值名称 -->
          <el-table-column label="属性值名称">
            <template v-slot="{ row, $index }">
              <el-input
                v-model="row.valueName"
                :ref="$index"
                size="mini"
                v-if="row.flag"
                @blur="changeBrowseMode(row, $index)"
                @keyup.native.enter="changeBrowseMode(row, $index)"
              ></el-input>
              <span
                v-else
                @dblclick="changeEditMode(row, $index)"
                style="display: block; height: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteRow($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 保存和取消操作 -->
        <el-button type="primary" @click="sendNewAttrInfo" :disabled="isWarning"
          >保存</el-button
        >
        <el-button @click="resetNewAttrInfo">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      //表格数据
      attrList: [],
      //控制表格的显示隐藏
      isShowAttrList: true,
      //新增表格数据
      newAttrInfo: {
        //属性名
        attrName: '',
        //属性值列表
        attrValueList: [],
        //三级列表的id
        categoryId: undefined,
        //三级列表数据
        categoryLevel: 3,
      },
      //警告状态中
      isWarning: false,
      //存储categoryId
      categoryId: {},
    }
  },
  methods: {
    //1.获取表格数据
    async getAttrInfo(category1Id, category2Id, category3Id) {
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code == 200) {
        this.attrList = result.data
        this.newAttrInfo.categoryId = category3Id
        this.categoryId = { category1Id, category2Id, category3Id }
      } else {
        return Promise.reject(result.message || 'fail')
      }
    },
    //2.重置表格数据
    resetAttrList() {
      this.attrList = []
    },
    //3.删除属性分类
    async deleteAttrItem(row) {
      let result = await this.$API.attr.reqDelete(row.id)
      if (result.code == 200) {
        this.$message({
          message: '删除属性成功',
          type: 'success',
        })
        const { category1Id, category2Id, category3Id } = this.categoryId
        this.getAttrInfo(category1Id, category2Id, category3Id)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message || 'fail'))
      }
    },

    //1.新增属性值
    addValueName() {
      this.newAttrInfo.attrValueList.push({
        //属性值归属于哪个 三级列表  与三级列表id相同
        attrId: undefined,
        valueName: '',
        //添加一个新属性flag 用于控制span和input的切换
        flag: true,
      })
      //新增数据自动获取焦点 这里使用$nextTick是由于dom发生变化需要事件，在下次dom更新后获取焦点
      this.$nextTick(() => {
        const index = this.newAttrInfo.attrValueList.length - 1
        this.$refs[index].focus()
      })
    },
    //2.更换为浏览模式
    changeBrowseMode(row, $index) {
      //输入值不能为空
      if (row.valueName.trim() == '') {
        this.$message({
          message: '请输入正确的属性值',
          type: 'warning',
        })
        this.isWarning = true
        return
      }
      //不能出现重复的属性值
      let isRepetition
      this.newAttrInfo.attrValueList.some((item, index) => {
        if (index != $index) {
          isRepetition = item.valueName == row.valueName ? true : false
        }
      })
      if (isRepetition) {
        this.$message({
          message: '不能输入重复的值',
          type: 'warning',
        })
        this.isWarning = true
        return
      }
      row.flag = false
      this.isWarning = false
    },
    //3.更换为编辑模式
    changeEditMode(row, $index) {
      row.flag = true
      //自动聚焦
      this.$nextTick(() => {
        this.$refs[$index].focus()
      })
    },
    //4.关闭新增属性页面  重置新增属性的数据
    resetNewAttrInfo() {
      this.isShowAttrList = true
      this.isWarning = false
      this.newAttrInfo = {
        //属性名
        attrName: '',
        //属性值列表
        attrValueList: [],
        //三级列表的id
        categoryId: this.newAttrInfo.categoryId,
        //三级列表数据
        categoryLevel: 3,
      }
    },
    //5.修改属性列表
    editAttrInfo(row) {
      //将row新增一个flag属性，控制编辑和浏览模式
      //注意  这里需要使用$set方法，因为vue监听数据需要重新设置setter
      row.attrValueList.forEach((item) => {
        this.$set(item, 'flag', false)
      })
      //将row的值赋予newAttrInfo进行展示
      //注意 这里需要进行深拷贝 由于展示界面和修改界面都用到了这组数据 两个数据会互相影响 使用lodush的方法
      this.newAttrInfo = cloneDeep(row)
      this.isShowAttrList = false
    },
    //6.删除当前行
    deleteRow(index) {
      this.isWarning = false
      this.$delete(this.newAttrInfo.attrValueList, index)
    },
    //7.发送新数据给服务器
    async sendNewAttrInfo() {
      let result = await this.$API.attr.reqAddAttr(this.newAttrInfo)
      if (result.code == 200) {
        //成功后跳转到展示页面 再次请求数据
        this.$message({
          message: '保存成功',
          type: 'success',
        })
        this.isShowAttrList = true
        const { category1Id, category2Id, category3Id } = this.categoryId
        this.getAttrInfo(category1Id, category2Id, category3Id)
        return 'ok'
      } else {
        return Promise.reject(result.message || 'fail')
      }
    },
  },
  computed: {
    //控制新增属性的开关
    isDisabled() {
      return this.newAttrInfo.attrName.trim().length > 0 ? false : true
    },
  },
}
</script>

<style>
</style>