<template>
  <div class="head-container">
    <el-container>
      <el-main>
        <el-card
          style="border-radius: 10px"
          class="box-card"
          shadow="hover"
        >
          <el-tag effect="plain">
            <i class="el-icon-s-tools"></i>
            操作栏
          </el-tag>
          <el-divider direction="vertical">
          </el-divider>
          <el-button-group>
            <el-button icon="el-icon-refresh" @click="defaultChangePage" type="primary" plain>重置</el-button>
            <el-button icon="el-icon-delete" type="danger" plain>删除</el-button>
          </el-button-group>
          <!--    分割线-->
          <el-divider content-position="center">
            <el-tag effect="plain">
              <svg-icon icon-class="peoples" />
              OAuth客户端列表
            </el-tag>
          </el-divider>
          <!--      表格-->
          <el-table
            ref="multipleSelection"
            v-loading="loading"
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
              <template slot-scope="props">
                <el-tag>
                  {{ props.row.scope? props.row.scope:'未知' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="细节"
              type="expand"
            >
              <template slot-scope="props">
                <el-form  >
                  <el-form-item label="资源ID">
                    <el-tag>
                      {{ props.row.resourceIds? props.row.resourceIds:'未知' }}
                    </el-tag>
                  </el-form-item>
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
              <template slot="header">
                <el-input
                  v-model="search"
                  placeholder="键入客户端ID"
                  size="mini"/>
              </template>
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    plain
                    type="primary"
                    size="mini"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button
                    plain
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
        </el-card>
      </el-main>
      <el-main>
        <el-card
          style="border-radius: 10px"
          class="box-card"
          shadow="hover"
        >
          <!--    分割线-->
          <el-divider content-position="left">
            <el-button-group>
              <el-tag effect="plain">
                <i class="el-icon-edit-outline"></i>
                表单
              </el-tag>
            </el-button-group>
          </el-divider>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
            <el-form-item label="编辑状态">
              <el-switch
                v-model="isEdit"
                disabled>
              </el-switch>
            </el-form-item>
            <el-form-item label="客户端ID" prop="clientId" required>
              <el-input
                clearable
                prefix-icon="el-icon-user-solid"
                placeholder="请输入ID"
                v-model="ruleForm.clientId">
                <el-button slot="append" @click="autoGeneratorId">Auto</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="客户端Secret" prop="clientSecret" required>
              <el-input
                clearable
                prefix-icon="el-icon-view"
                placeholder="请输入Secret"
                v-model="ruleForm.clientSecret">
                <el-button slot="append" @click="autoGeneratorSecret">
                  Auto
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="资源ID" >
              <el-input clearable
              placeholder="多个资源时用逗号(,)分隔"
              v-model="ruleForm.resourceIds">
              </el-input>
            </el-form-item>
            <el-form-item label="权限范围">
              <el-input
                disabled
                prefix-icon="el-icon-success"
                placeholder="服务端默认支持所有权限"
                v-model="ruleForm.scope"
                required
              >
              </el-input>
            </el-form-item>
            <el-form-item label="认证方式" prop="authorizedGrantTypes" required>
              <el-select

                 v-model="ruleForm.authorizedGrantTypes"
                 placeholder="请选择"
                 multiple
                 filterable
                 clearable
                 allow-create
                 default-first-option>
                <el-option
                  v-for="item in optionsAuth"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                  <span style="float: left">{{ item.value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="重定向" prop="webServerRedirectUri">
              <el-input v-model="ruleForm.webServerRedirectUri"
                        placeholder="协议://域名:端口"
                        class="input-with-select"
                        clearable
              >
                <el-select v-model="ruleForm.webServerRedirectUri" slot="prepend" placeholder="请选择">
                  <el-option label="http" value="http://"></el-option>
                  <el-option label="https" value="https://"></el-option>
                </el-select>
                <template slot="append">.com</template>
              </el-input>
            </el-form-item>
            <el-form-item label="权限值" prop="authorities">
              <el-input v-model="ruleForm.authorities"
                        placeholder="若有多个权限值,用逗号(,)分隔"
              ></el-input>
            </el-form-item>
            <el-form-item label="令牌有效期" prop="accessTokenValidity">
              <el-input-number
                v-model="ruleForm.accessTokenValidity"
                controls-position="right"
                placeholder="秒"
                :min="tokenMinTime"
                :max="tokenMaxTime"
              >
              </el-input-number>
            </el-form-item>
            <el-form-item label="刷新令牌有效期" prop="refreshTokenValidity" >
              <el-input-number
                v-model="ruleForm.refreshTokenValidity"
                controls-position="right"
                placeholder="秒"
                :min="tokenRefreshMinTime"
                :max="tokenRefreshMaxTime"
              >
              </el-input-number>
            </el-form-item>
            <el-form-item label="预选属性" prop="additionalInformation">
              <el-input v-model="ruleForm.additionalInformation" placeholder="必须为JSON"></el-input>
            </el-form-item>
            <el-form-item label="自动批准" prop="autoApprove">
              <el-select
                v-model="ruleForm.autoApprove"
                placeholder="请选择"
                filterable
                clearable
                allow-create
                default-first-option>
                <el-option
                  v-for="item in optionsApprove"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-divider></el-divider>
            <el-header>
              <div align="center">
                <el-button type="primary" icon="el-icon-paperclip" @click="submitForm('ruleForm')" plain >新增/更新</el-button>
                <el-button type="primary" icon="el-icon-refresh" plain @click="resetForm('ruleForm')">重置</el-button>
              </div>
            </el-header>
          </el-form>

        </el-card>
      </el-main>
    </el-container>


    <!--      对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      center>

    </el-dialog>
  </div>
</template>

<script>
import Config from '@/settings'
import {selectClientPage, deleteClient} from '@/api/system/security'
import CryptoJS from 'crypto-js'
import {addClient} from "../../../api/system/security";

export default {
  name: "OAuth2Client",
  data() {
    return {
      tokenMinTime: 3600,
      tokenRefreshMinTime: 7200,
      tokenMaxTime: 2678400,
      tokenRefreshMaxTime: 5356800,
      dialogVisible: false,
      isEdit: false,
      loading: true,
      multipleSelection: [],
      page: 1,
      total: 0,
      size:10,
      search: '',
      pages: null,
      select: '',
      tableData: [],
      optionsApprove:[{
        value: 1,
        label: 'true',
      },{
        value: 2,
        label: 'false',
      },{
        value: 3,
        label: 'read',
      },{
        value: 4,
        label: 'write',
      }
      ],
      optionsAuth:[{
          value: 'password',
          label: '账号密码&认证',
      },{
       value: 'password_code',
          label: '账号密码，验证码&认证',
      },{
       value: 'implicit',
          label: '隐式认证',
      },{
       value: 'client_credentials',
          label: '客户端凭证&认证',
      },{
       value: 'authorization_code',
          label: '授权码认证',
      },{
       value: 'refresh_token',
          label: 'refresh令牌认证',
      }
      ],
      ruleForm: {
        clientId: '',
        clientSecret: '',
        resourceIds: '',
        scope: 'all',
        authorizedGrantTypes: [],
        webServerRedirectUri: '',
        authorities: '',
        accessTokenValidity: '',
        refreshTokenValidity: '',
        additionalInformation: '',
        autoApprove: ''
      },
      rules: {
        clientId: [
          { required: true, message: '请输入客户端ID', trigger: 'blur' },
          { min: 10, max: 20, message: '长度在 10 到 20 个数字和大小写字母组合字符', trigger: 'blur' }
        ],
        clientSecret: [
          { required: true, message: '请输入客户端密钥', trigger: 'blur' },
          { min: 10, max: 20, message: '长度在 10 到 20 个数字和大小写字母组合字符', trigger: 'blur' }
        ],
        resourceIds: [
          { required: true, message: '多个资源时用逗号(,)分隔', trigger: 'change' }
        ],
        scope: [
          {  required: true, message: '请选择授权范围', trigger: 'change' }
        ],
        authorizedGrantTypes: [
          { required: true, message: '请至少选择一种认证方式', trigger: 'change' }
        ],
        autoApprove: [
          { required: true, message: '请选择批准授予权限操作', trigger: 'change' }
        ]
      }
    }

  },
  created() {
    this.defaultChangePage()
  },
  methods: {
    changePage(data) {
      this.loading = true
      selectClientPage(data)
        .then(res => {
          setTimeout(() => {
            this.tableData = res.data.records
            this.total = res.data.total
            this.pages = res.data.pages
            this.loading = false
          },300)
        }).catch(reason => {
        this.loading = true
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.savaOrUpdate()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    savaOrUpdate() {
      let  data = this.setForm();
      console.log(data)
      // 编辑状态
      if (this.isEdit) {
      } else {
        addClient(data).then(res => {
          this.notifyYes('添加客户端成功')
          this.resetForm('ruleForm')
        }).catch(reason => {
          this.notifyNo('添加客户端失败')
        })
      }
    },
    setForm() {
      let data = {
          clientId: this.ruleForm.clientId,
          clientSecret: this.ruleForm.clientSecret,
          resourceIds: this.ruleForm.resourceIds,
          scope: 'all',
          authorizedGrantTypes: this.ruleForm.authorizedGrantTypes.toString(),
          webServerRedirectUri: this.ruleForm.webServerRedirectUri,
          authorities: this.ruleForm.authorities,
          accessTokenValidity: this.ruleForm.accessTokenValidity,
          refreshTokenValidity: this.ruleForm.refreshTokenValidity,
          additionalInformation: this.ruleForm.additionalInformation,
          autoApprove: this.ruleForm.autoApprove
        }
      return data
    },
    notifyNo(message) {
      this.$notify({
        title: '失败',
        message: message,
        type: 'error'
      });
    },
    notifyYes(message){
      this.$notify({
        title: '成功',
        message: message,
        type: 'success'
      });
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
       this.isEdit = true
    },
    /**
     * 生成3-32位随机串：randomWord(true, 3, 32)
     * 生成43位随机串：randomWord(false, 43)
     */
   randomWord(randomFlag, min, max) {
      let str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

      // 随机产生
     if (randomFlag) {
       range = Math.round(Math.random() * (max - min)) + min;
     }
     for (let i = 0; i < range; i++) {
       let pos;
       pos = Math.round(Math.random() * (arr.length - 1));
       str += arr[pos];
     }
     return str;
   },
    autoGeneratorId(){
      this.ruleForm.clientId = this.randomWord(true,10, 20)
    },
    autoGeneratorSecret() {
     this.ruleForm.clientSecret = this.randomWord(true, 10, 20)
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
          let query = {
            page: this.page -1,
            size: this.size
          }
          this.changePage(query)
        }
          this.defaultChangePage()
      }).catch(reason => {
        this.defaultChangePage()
      })
    },
    defaultChangePage() {
      let query = {
        page: this.page,
        size: this.size
      }
      this.changePage(query)
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
}  .el-select .el-input {
     width: 130px;
   }
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
