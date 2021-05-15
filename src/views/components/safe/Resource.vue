<template>
  <el-card
    style="border-radius: 10px"
    class="box-card"
    shadow="hover"
  >
    <el-divider content-position="left">
      <i class="el-icon-platform-eleme"></i>
      接口资源列表
    </el-divider>
    <el-button-group>
      <el-button @click="dialogVisible = true">添加</el-button>
      <el-button>查看资源所有节点</el-button>
      <el-button @click="refreshTable()">刷新</el-button>
    </el-button-group>
    <el-divider></el-divider>
<!--    对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
<!--    资源表格-->
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      row-key="id"
      highlight-current-row
      :row-class-name="tableRowClassName"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="资源名称"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        sortable
        prop="uri"
        label="资源URI"
        width="180">
      </el-table-column>
      <el-table-column  label="细节" width="100">
        <el-popover
          slot-scope="scope"
          placement="right"
          width="300"
          trigger="click">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>详情列表</span>
            </div>
            <el-form label-position="left">
              <el-form-item label="完整URL" prop="fullUri">
                <el-tag>
                  {{ String(scope.row.fullUri) }}
                </el-tag>
              </el-form-item>
              <el-form-item label="请求方法" prop="method">
                <el-tag>
                  {{ String(scope.row.method) }}
                </el-tag>
              </el-form-item>
              <el-form-item label="资源树LEAF" prop="leaf">
                <el-tag>
                  {{ formatBoolean(scope.row.leaf) }}
                </el-tag>
              </el-form-item>
              <el-form-item label="可用">
                <el-tag>
                  {{ formatBoolean(scope.row.enabled) }}
                </el-tag>
              </el-form-item>
              <el-form-item label="放行" prop="allow">
                <el-tag>
                  {{ formatBoolean(scope.row.allow) }}
                </el-tag>
              </el-form-item>
            </el-form>
          </el-card>
          <el-button  icon="el-icon-tickets" slot="reference" size="mini" type="primary" plain>查看详情</el-button>
        </el-popover>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="180">
      </el-table-column>
    </el-table>
<!--    分页组件-->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-sizes="[10, 100, 200, 300]"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<style>
.el-table .warning-row {
  background: #f1f1f1;
}

.el-table .success-row {
  background: #ffffff;
}
</style>
<script>

import {selectResourcePage} from "../../../api/system/security";


export default {
  data() {
    return {
      dialogVisible: false,
      loading: true,
      currentPage: 1,
      pageSize:10,
      total: 0,
      pages: null,
      tableData: [],
      search: '',
      details: {
        enabled: null,
        fullUri: null,
        allow: null,
        method: null,
        leaf: null
      },
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
     this.refreshTable()
  },
  methods: {
    refreshTable() {
      this.loading = true
      let data = {
        current: this.currentPage,
        size: this.pageSize
      }
      selectResourcePage(data)
        .then(res => {
          this.tableData = res.data.records

          setTimeout(() => {
            this.loading = false
          }, 300)
        }).catch(reason => {
          this.loading = true
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    tableRowClassName({row, rowIndex}) {
      if (row.leaf) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
      return '';
    },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(treeNode.children)
      }, 1000)
    },
    formatBoolean(cellValue) {
      var ret = ''  //你想在页面展示的值
      if (cellValue) {
        ret = "是"  //根据自己的需求设定
      } else {
        ret = "否"
      }
      return ret;
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  margin-bottom: 5px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
