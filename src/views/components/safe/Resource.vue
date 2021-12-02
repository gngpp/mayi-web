<template>
  <div class="app-container">
    <el-row :gutter="20">
<!--      表格-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card>
          <el-tag effect="plain">
            <i class="el-icon-s-tools"></i>
            操作栏
          </el-tag>
          <el-divider direction="vertical"></el-divider>
          <el-button :loading="loading" type="primary" icon="el-icon-refresh" plain  @click="refreshTable()">刷新</el-button>
          <el-button :loading="loading" plain type="danger" icon="el-icon-delete">删除</el-button>
          <el-button @click="dialogVisible = true">添加</el-button>
          <el-divider content-position="center">
            <el-tag effect="plain">
              <svg-icon icon-class="tree" />
              接口资源列表
            </el-tag>
          </el-divider>
          <!--    资源表格-->
          <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%"
            row-key="id"
            highlight-current-row
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="name"
              fixed
              label="资源名称"
              width="200"
              sortable>
              <template slot-scope="scope">
                <svg-icon icon-class="tree-table" />
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="fullUri"
              width="250"
              label="URI">
              <template slot-scope="scope">
                <Tag
                  type="dot" color="primary"
                  v-if="scope.row.uri"
                  size="medium"
                >{{ scope.row.uri }}</Tag>
                <i v-if="!scope.row.uri" class="el-icon-error"/>
              </template>
            </el-table-column>
            <el-table-column width="100" label="leaf">
              <template slot-scope="scope">
                <el-switch
                  disabled
                  v-model="scope.row.leaf"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-popover
                  placement="right"
                  width="400"
                  trigger="click">
                  <el-descriptions class="margin-top" title="带边框列表" :column="1" border>
                    <el-descriptions-item v-if="scope.row.leaf">
                      <template slot="label">
                        <i class="el-icon-user"></i>
                        请求方法
                      </template>
                      <Tag
                        type="dot" color="primary"
                        :key="tag"
                        :disable-transitions="false"
                        effect="plain"
                        size="medium"
                      >
                        {{ scope.row.method }}
                      </Tag>
                    </el-descriptions-item>
                    <el-descriptions-item v-if="scope.row.leaf">
                      <template slot="label">
                        <i class="el-icon-location-outline"></i>
                        请求pattern
                      </template>
                      <Tag
                        type="dot" color="primary"
                        :key="tag"
                        :disable-transitions="false"
                        effect="plain"
                        size="medium"
                      >
                        {{scope.row.fullUri}}
                      </Tag>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        接口状态
                      </template>
                      <el-switch
                        v-model="scope.row.enabled"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-office-building"></i>
                        接口放行
                      </template>
                      <el-switch
                        v-model="scope.row.allow"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-office-building"></i>
                        权限绑定
                      </template>
                      <el-tag
                        :key="tag"
                        v-for="tag in formatPermission(scope.row.bindingPermissions)"
                        size="medium"
                      >{{ tag }}</el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-button type="text" slot="reference">查看</el-button>
                </el-popover>
                <el-button type="text" size="small">编辑</el-button>
              </template>
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
      </el-col>
<!--      表单-->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card>
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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {selectResourcePage} from "../../../api/seucirty/security";


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
    open(data) {
      this.$alert('这是一段内容', '接口信息', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      });
    },
    formatPermission(bindingPermissions) {
      try {
        let permissions = []
        bindingPermissions.forEach(value => {
          permissions.push(value.value)
        })
        return (permissions.length == 0 ? ['none'] :permissions)
      }catch (e) {
        return  ['none']
      }
    },
    refreshTable() {
      this.loading = true
      let data = {
        page: this.currentPage,
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
</style>
