<template>
  <div class="head-container">
    <div>
      <!--    分割线-->
      <el-divider content-position="left">
        <i class="el-icon-s-tools"></i>
        <el-button-group>
          <el-button icon="el-icon-document-add" @click="dialogVisible = true" type="primary" plain>添加</el-button>
          <el-button icon="el-icon-delete" type="danger" plain>删除</el-button>
        </el-button-group>
      </el-divider>
    </div>
    <!--      表格-->
      <el-table
        ref="multipleSelection"
        :data="tableData.filter(data => !search || data.clientId.toLowerCase().includes(search.toLowerCase()))"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        stripe
        row-key="clientId"
        style="width: 100%"
        tooltip-effect="dark"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="客户端ID"
          sortable>
          <template slot-scope="scope">
            <el-tag type="success">
              {{ scope.row.clientId }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="客户端Secret"
          prop="clientSecret"
          sortable>
        </el-table-column>
        <el-table-column
          label="权限范围"
          prop="scope"
          sortable
          width="150">
        </el-table-column>
        <el-table-column
          label="资源ID"
          prop="resourceIds"
          sortable
        >
          <template slot-scope="props">
            <el-tag>
              {{ props.row.resourceIds? props.row.resourceIds:'未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="细节"
          type="expand"
        >
        <template slot-scope="props">
            <el-form  >
              <el-form-item label="认证方式:">
                <el-tag>
                  {{ props.row.authorizedGrantTypes?props.row.authorizedGrantTypes:'未知' }}
                </el-tag>
              </el-form-item>
              <el-form-item label="重定向:">
                <el-tag>
                  {{ props.row.webServerRedirectUri? props.row.webServerRedirectUri: '未知' }}
                </el-tag>
              </el-form-item>
              <el-form-item label="权限值:">
                <el-tag>{{ props.row.authorities? props.row.authorities : '未知' }}</el-tag>
              </el-form-item>
              <el-form-item label="Token有效期/秒:">
                <el-tag>{{ props.row.accessTokenValidity? props.row.accessTokenValidity : '未知' }}</el-tag>
              </el-form-item>
              <el-form-item label="RefreshToken有效期/秒:">
                <el-tag>{{ props.row.refreshTokenValidity? props.row.refreshTokenValidity : '未知' }}</el-tag>
              </el-form-item>
              <el-form-item label="预选属性/必须为JSON:">
                <el-tag>{{ props.row.additionalInformation? props.row.additionalInformation : '未知' }}</el-tag>
              </el-form-item>
              <el-form-item label="自动批准:">
                <el-tag>{{ props.row.autoApprove? props.row.autoApprove : '未知' }}</el-tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="170">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              placeholder="键入客户端ID"
              size="mini"/>
          </template>
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                plain
                round
                type="primary"
                size="mini"
                icon="el-icon-edit-outline"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                plain
                round
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 100, 200, 300]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    <!--      对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="客户端ID" prop="clientId" required>
          <el-input
            clearable
            prefix-icon="el-icon-user-solid"
            v-model="ruleForm.clientId">
          </el-input>
        </el-form-item>
        <el-form-item label="客户端Secret" prop="clientSecret">
          <el-input
            disabled
            prefix-icon="el-icon-success"
            placeholder="密钥由服务端自动生成"
            v-model="ruleForm.clientSecret">
          </el-input>
        </el-form-item>
        <el-form-item label="权限范围">
          <el-input
            disabled
            prefix-icon="el-icon-success"
            placeholder="服务端默认支持所有权限"
            v-model="ruleForm.scope">
          </el-input>
        </el-form-item>
        <el-form-item label="资源ID">
          <el-input clearable
                    v-model="ruleForm.resourceIds">
          </el-input>
        </el-form-item>
        <el-form-item label="认证方式" prop="authorizedGrantTypes">
          <el-input clearable v-model="ruleForm.authorizedGrantTypes"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="webServerRedirectUri">
         <el-input v-model="ruleForm.webServerRedirectUri"></el-input>
        </el-form-item>
        <el-form-item label="权限值" prop="authorities">
          <el-input v-model="ruleForm.authorities"></el-input>
        </el-form-item>
        <el-form-item label="Token有效期/秒" prop="accessTokenValidity">
          <el-input v-model="ruleForm.accessTokenValidity"></el-input>
        </el-form-item>
        <el-form-item label="RefreshToken有效期/秒" prop="refreshTokenValidity">
          <el-input  v-model="ruleForm.refreshTokenValidity"></el-input>
        </el-form-item>
        <el-form-item label="预选属性/必须为JSON" prop="additionalInformation">
          <el-input v-model="ruleForm.additionalInformation"></el-input>
        </el-form-item>
        <el-form-item label="自动批准" prop="autoApprove">
          <el-input v-model="ruleForm.autoApprove"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Config from '@/settings'
import {selectClientPage, deleteClient} from '@/api/system/security'
export default {
  name: "OAuth2Client",
  data() {
    return {
      dialogVisible: false,
      multipleSelection: [],
      page: 1,
      total: 0,
      size:10,
      search: '',
      pages: null,
      tableData: [],
      ruleForm: {
        clientId: '',
        clientSecret: '',
        resourceIds: '',
        scope: '',
        authorizedGrantTypes: '',
        webServerRedirectUri: '',
        authorities: '',
        accessTokenValidity: '',
        refreshTokenValidity: '',
        additionalInformation: '',
        autoApprove: ''
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
    this.defaultChangePage()
  },
  methods: {
    changePage(data) {
      selectClientPage(data)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.pages = res.data.pages
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
    handleSizeChange(val) {
      this.size = val;
      this.defaultChangePage()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.defaultChangePage()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {

    },
    handleDelete(index, row) {
      if (Config.applyId == row.clientId) {
        this.$notify.error({
          message: "禁止删除当前登录客户端"
        })
        return;
      }
      deleteClient(row.clientId)
        .then(res => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        });
        if (index == 0) {
          let page = {
            current: this.page -1,
            size: this.size
          }
          this.changePage(page)
        }
          this.defaultChangePage()
      }).catch(reason => {
        this.defaultChangePage()
      })
    },
    defaultChangePage() {
      let page = {
        current: this.page,
        size: this.size
      }
      this.changePage(page)
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
