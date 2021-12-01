w<style scoped>
.select-count {
  font-weight: 600;
  color: #40a9ff;
}

.select-clear {
  margin-left: 10px;
  color: #40a9ff;
}
</style>
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card>
          <el-tag effect="plain">
            <i class="el-icon-s-tools"></i>
            操作栏
          </el-tag>
          <el-divider direction="vertical"></el-divider>
          <el-button :loading="loading" plain type="primary" icon="el-icon-refresh" @click="defaultChangePage" >刷新</el-button>
          <el-button :loading="loading" plain type="danger" icon="el-icon-delete"  @click="handleDeleteBatch" >删除</el-button>
          <el-button type="primary" plain icon="el-icon-set-up" @click="openTip = !openTip">{{
              openTip ? "关闭提示" : "开启提示"
            }}</el-button>
          <el-tooltip class="item" effect="dark" content="键入客户端ID" placement="right">
            <el-input
              style="padding-top: revert;margin-bottom: revert; width: 130px"
              placeholder="键入客户端ID"
              prefix-icon="el-icon-search"
              @on-change="searchClient()"
            >
            </el-input>
          </el-tooltip>
          <!--    分割线-->
          <el-divider content-position="center">
            <el-tag effect="plain">
              <svg-icon icon-class="peoples" />
              OAuth客户端列表
            </el-tag>
          </el-divider>
          <!--        提示-->
          <Alert show-icon v-show="openTip">
            已选择
            <span class="select-count">{{ this.selectList.length }}</span> 项
            <a class="select-clear" @click="clearSelectAll()">清空</a>
          </Alert>
          <!--      表格-->
          <el-table
            :data="tableData"
            v-loading="loading"
            ref="table"
            max-height="400"
            size="small"
            @selection-change="handleSelectionChange"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-card>
                  <el-descriptions class="margin-top" border :column="1">
                    <el-descriptions-item label="客户密钥到期时间">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        客户密钥到期时间
                      </template>
                      <Tag type="dot" color="primary"> {{ format(props.row.clientSecretExpiresAt) }} </Tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="客户端认证方法" :span="2">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        客户端认证方法
                      </template>
                      <Tag type="dot" color="primary"
                        :key="tag"
                        v-for="tag in formatSettingValue(props.row.clientAuthenticationMethods)"
                        :disable-transitions="false"
                        effect="plain"
                        size="medium"
                      >
                        {{tag}}
                      </Tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="授权类型">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        授权类型
                      </template>
                      <Tag type="dot" color="primary"
                        :key="tag"
                        v-for="tag in formatSettingValue(props.row.authorizationGrantTypes)"
                        :disable-transitions="false"
                        effect="plain"
                        size="medium"
                      >
                        {{tag}}
                      </Tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="重定向 Uris">
                      <template slot="label">
                        <i class="el-icon-location-outline"></i>
                        重定向 Uris
                      </template>
                      <Tag
                        type="dot" color="primary"
                        :key="tag"
                        v-for="tag in props.row.redirectUris"
                        :disable-transitions="false"
                        effect="plain"
                        size="medium"
                      >
                        {{tag}}
                      </Tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="scopes">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        scopes
                      </template>
                      <Tag type="dot" color="primary"
                        :key="tag"
                        v-for="tag in props.row.scopes"
                        :disable-transitions="false"
                        effect="plain"
                        size="medium"
                      >
                        {{tag}}
                      </Tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="需要证明密钥">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        需要证明密钥
                      </template>
                      <el-switch
                        v-model="props.row.clientSettings.requireProofKey"
                        disabled
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                    </el-descriptions-item>
                    <el-descriptions-item label="需要授权同意">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        需要授权同意
                      </template>
                      <el-switch
                        v-model="props.row.clientSettings.requireAuthorizationConsent"
                        disabled
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                    </el-descriptions-item>
                    <el-descriptions-item label="刷新令牌生存时间/秒">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        刷新令牌生存时间/秒
                      </template>
                      <Tag type="dot"  color="primary"> {{ props.row.tokenSettings.refreshTokenTimeToLive }}</Tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="重用刷新令牌">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        重用刷新令牌
                      </template>
                      <el-switch
                        v-model="props.row.tokenSettings.tokenSettings"
                        disabled
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                    </el-descriptions-item>
                    <el-descriptions-item label="访问令牌生存时间/秒">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        访问令牌生存时间/秒
                      </template>
                      <Tag type="dot"  color="primary"> {{ props.row.tokenSettings.accessTokenTimeToLive }} </Tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="Token签名算法">
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        Token签名算法
                      </template>
                      <Tag type="dot"  color="primary"> {{ props.row.tokenSettings.idTokenSignatureAlgorithm }}</Tag>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-card>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              >
            </el-table-column>
            <el-table-column
              prop="clientId"
              label="客户端ID"
              >
            </el-table-column>
            <el-table-column
              prop="clientSecret"
              label="客户端密钥"
              >
            </el-table-column>
            <el-table-column
              prop="clientName"
              label="客户端名"
              >
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="创建日期" prop="clientIdIssuedAt" sortable width="168px"  align="center">
              <template slot-scope="scope">
                <el-tag
                  disable-transitions
                >
                  <i class="el-icon-time"></i>
                  {{ format(scope.row.clientIdIssuedAt) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
              >
              <template slot-scope="{ row, index }">
                <el-button-group>
                  <el-button
                    type="text"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(index, row)">编辑
                  </el-button>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(index, row)">删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <!--        分割线-->
          <br/>
          <!--      分页组件-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[5, 10, 15]"
            :page.sync="page"
            :page-size.sync="size"
            :page-count="pages"
            :total.sync="total">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card>
          <!--    分割线-->
          <el-divider content-position="left">
            <el-button-group>
              <el-tag effect="plain">
                <i class="el-icon-edit-outline"></i>
                表单
              </el-tag>
            </el-button-group>
          </el-divider>
<!--          表单-->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="'right'">
            <el-form-item label="编辑状态">
              <el-switch
                v-model="isEdit"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled>
              </el-switch>
            </el-form-item>
            <el-form-item label="客户端ID" prop="clientId" required>
              <el-input
                clearable
                prefix-icon="el-icon-user-solid"
                placeholder="请输入ID"
                :disabled="isEdit"
                v-model="ruleForm.clientId">
                <el-button slot="append" @click="autoGeneratorId">Auto</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="客户端密钥" prop="clientSecret" required>
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
            <el-form-item label="客户端名称" prop="clientName" required>
              <el-input
                clearable
                prefix-icon="el-icon-view"
                placeholder="请输入名称"
                v-model="ruleForm.clientName">
              </el-input>
            </el-form-item>
            <el-form-item label="客户端身份验证方法" prop="clientAuthenticationMethods" required>
              <el-select
                v-model="ruleForm.clientAuthenticationMethods"
                multiple
                filterable
                clearable
                default-first-option
                placeholder="请输入值">
                <el-option
                  v-for="item in authenticationMethodsOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="授权授予类型" prop="authorizationGrantTypes">
              <el-select
                v-model="ruleForm.authorizationGrantTypes"
                multiple
                filterable
                clearable
                default-first-option
                placeholder="请输入值">
                <el-option
                  v-for="item in grantsOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户密钥到期时间" prop="clientSecretExpiresAt">
              <el-date-picker
                v-model="ruleForm.clientSecretExpiresAt"
                type="datetime"
                placeholder="选择日期时间"
                value-format="timestamp"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="scopes" prop="scopes">
              <el-select
                v-model="ruleForm.scopes"
                multiple
                filterable
                allow-create
                clearable
                default-first-option
                placeholder="请输入值">
              </el-select>
            </el-form-item>
            <el-form-item label="redirectUris" prop="redirectUris">
              <el-select
                v-model="ruleForm.redirectUris"
                multiple
                filterable
                clearable
                allow-create
                default-first-option
                placeholder="请输入值">
              </el-select>
            </el-form-item>
<!--            client settings-->
            <el-form-item label="需要证明密钥" prop="clientSettings.requireProofKey">
              <el-switch v-model="ruleForm.clientSettings.requireProofKey"></el-switch>
            </el-form-item>
            <el-form-item label="需要授权同意" prop="clientSettings.requireAuthorizationConsent">
              <el-switch v-model="ruleForm.clientSettings.requireAuthorizationConsent"></el-switch>
            </el-form-item>
<!--            token settings-->
            <el-form-item label="Token签名算法	" prop="tokenSettings.idTokenSignatureAlgorithm">
              <el-autocomplete
                v-model="ruleForm.tokenSettings.idTokenSignatureAlgorithm"
                :fetch-suggestions="loadAlg"
                clearable
                placeholder="单击选择"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="令牌有效期/秒" prop="tokenSettings.accessTokenTimeToLive">
              <el-input-number
                v-model="ruleForm.tokenSettings.accessTokenTimeToLive"
                controls-position="right"
                placeholder="秒"
                :min="tokenMinTime"
                :max="tokenMaxTime"
              >
              </el-input-number>
            </el-form-item>
            <el-form-item label="刷新令牌有效期/秒" prop="tokenSettings.refreshTokenTimeToLive" >
              <el-input-number
                v-model="ruleForm.tokenSettings.refreshTokenTimeToLive"
                controls-position="right"
                placeholder="秒"
                :min="tokenRefreshMinTime"
                :max="tokenRefreshMaxTime"
              >
              </el-input-number>
            </el-form-item>
            <el-form-item label="重用刷新令牌" prop="tokenSettings.reuseRefreshTokens" >
              <el-switch v-model="ruleForm.tokenSettings.reuseRefreshTokens"></el-switch>
            </el-form-item>
            <div align="center">
              <el-button type="primary" plain icon="el-icon-paperclip" @click="submitForm('ruleForm')">新增/更新</el-button>
              <el-button type="warning" plain icon="el-icon-refresh" @click="resetForm('ruleForm')">重置</el-button>
            </div>
          </el-form>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Config from '@/settings'
import {
  deleteBatchClient,
  saveClient,
  updateClient,
  deleteClient,
  findByPage,
  loadTokenSignatureAlgorithm,
  loadAuthorizationGrantTypes,
  loadClientAuthenticationMethods
} from "../../../api/seucirty/security";
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
      multipleTable: [],
      page: 1,
      total: 0,
      size:5,
      search: '',
      pages: null,
      select: 0,
      openTip: true,
      tableData: [],
      selectList: [],
      algOptions: [],
      authenticationMethodsOptions:[],
      grantsOptions:[],
      ruleForm: {
        id: '',
        clientId: '',
        clientSecret: '',
        clientName: '',
        clientIdIssuedAt: '',
        clientSecretExpiresAt: '',
        clientAuthenticationMethods: [],
        authorizationGrantTypes: [],
        redirectUris: [],
        scopes: [],
        tokenSettings: {
          accessTokenTimeToLive: '',
          refreshTokenTimeToLive: '',
          reuseRefreshTokens: false,
          idTokenSignatureAlgorithm: '',
        },
        clientSettings: {
          requireProofKey: false,
          requireAuthorizationConsent: false
        }
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
        clientName: [
          { required: true, message: '请输入客户端ID', trigger: 'blur' },
        ],
        authorizationGrantTypes: [
          { required: true, message: '请至少选择一种认证方式', trigger: 'change' }
        ],
        requireAuthorizationConsent: [
          { required: true, message: '需要授权同意', trigger: 'change' }
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
    }
  },
  created() {
    this.defaultChangePage()
    loadAuthorizationGrantTypes()
    .then(res => {
      this.grantsOptions = res.data
    })
    loadClientAuthenticationMethods()
    .then(res => {
      this.authenticationMethodsOptions = res.data
    })
  },
  methods: {
    formatSettingValue(data) {
      try {
        let target = []
        data.forEach(value => {
          target.push(value)
        })
        return (target.length == 0 ? 'none' :target)
      }catch (e) {
        return  ['none']
      }
    },
    changePage(data) {
      this.loading = true
      findByPage(data)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.totalRecord
          this.pages = res.data.totalPage
          setTimeout(() => {
            this.loading = false
          },300)
        }).catch(reason => {
        this.loading = true
      })
    },
    getSelect() {
      return this.multipleTable.length
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
      this.isEdit = false
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    savaOrUpdate() {
      let  data = JSON.parse(JSON.stringify(this.ruleForm));
      // 编辑状态
      if (this.isEdit) {
        updateClient(data).then(res => {
          this.notifyYes('更新客户端成功')
          this.resetForm('ruleForm')
          this.defaultChangePage()
        })
      } else {
        data.id = null
        saveClient(data).then(res => {
          this.notifyYes('添加客户端成功')
          this.resetForm('ruleForm')
          this.defaultChangePage()
        })
      }
    },
    loadAlg(queryString, cb) {
      let map = []
      loadTokenSignatureAlgorithm()
        .then(res => {
          setTimeout(() => {
            this.loading = false
            for (const index in res.data) {
                map.push({
                  label: res.data[index],
                  value: res.data[index]
                })
            }
            cb(map)
          }, 200);
        })
    },
    copyForm(tableData) {
      // 直接赋值会使用同一个地址，reset后数据将改变
      return JSON.parse(JSON.stringify(tableData))
    },
    format(time) {
      if (!time) {
        return '无'
      }
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let second = date.getSeconds();
      return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second;
    },
    notifyYes(message){
      this.$Message.success(message);
    },
    handleSizeChange(val) {
      this.size = val;
      this.defaultChangePage()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.defaultChangePage()
    },
    handleSelectionChange(e) {
      this.selectList = e;
      this.selectList.length = e.length;
    },
    handleEdit(index, row) {
      if (!this.isEdit) {
        this.$Message.warning('编辑客户端信息需要重新设置密钥');
        this.isEdit = true
        this.ruleForm = this.copyForm(row)
      } else {
        this.isEdit = false
        this.resetForm('ruleForm')
      }
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
    searchClient() {
      this.tableData = this.tempData.filter(data => !this.search || data.clientId.toLowerCase().includes(this.search.toLowerCase()))
    },
    handleDeleteBatch() {
      let ids = [];
      for (let i = 0; i < this.selectList.length; i++) {
         let client = this.selectList[i];
         if (client.clientId == Config.applyId) {
           this.$Message.warning("禁止删除当前登录客户端");
           return
         }
         ids.push(client.clientId)
      }
      if (ids.length <= 0) {
        this.$Message.warning("当前没有选中客户端")
        return;
      }
      deleteBatchClient(ids).then(res=>{
        this.$Message.success("批量删除成功")
        this.defaultChangePage()
      })
    },
    handleDelete(index, row) {
      if (Config.applyId == row.clientId) {
        this.$Message.warning("禁止删除当前登录客户端")
        return;
      }
        this.$confirm('此操作将永久删除客户端：' + row.clientId + ' 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteClient(row.clientId).then(res => {
            this.$Message.success("删除成功")
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
        }).catch(() => {
          this.$Message.info("已取消删除")
        });
    },
    defaultChangePage() {
      let query = {
        page: this.page,
        size: this.size
      }
      this.changePage(query)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

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
.el-alert {
  border-radius: 4px;
  line-height: 16px;
  margin-bottom: 10px;
}
</style>
