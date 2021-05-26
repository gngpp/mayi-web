<style scoped>
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
  <el-container>
    <el-main>
      <Card
        style="border-radius: 10px"
      >
        <el-tag effect="plain">
          <i class="el-icon-s-tools"></i>
          操作栏
        </el-tag>
        <el-divider direction="vertical"></el-divider>
        <el-button :loading="loading" type="primary" icon="el-icon-refresh" @click="defaultChangePage" >重置</el-button>
        <el-button :loading="loading" type="danger" icon="el-icon-delete"  @click="handleDeleteBatch" >删除</el-button>
        <el-button type="primary" icon="el-icon-set-up" @click="openTip = !openTip">{{
            openTip ? "关闭提示" : "开启提示"
          }}</el-button>
        <Poptip trigger="focus">
          <Input
            v-model="search"
            style="padding-top: revert;margin-bottom: revert; width: 130px"
            placeholder="键入客户端ID"
            @on-change="searchClient()"
          >
            <Icon type="ios-search" slot="prefix" />
          </Input>
          <div slot="content">{{ search }}</div>
        </Poptip>
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
        <Table
          :data="tableData"
          ref="table"
          width="100%"
          :loading="loading"
          :columns="columns"
          sortable="custom"
          @on-selection-change="handleSelectionChange"
        >
          <template slot-scope="{ row }" slot="clientId">
            <Icon type="ios-person" />
            {{ row.clientId }}
          </template>
          <template slot-scope="{ row }" slot="clientSecret">
            <Tag>
              <svg-icon icon-class="password" />
              {{ row.clientSecret }}
            </Tag>
          </template>
          <template slot-scope="{ row }" slot="scope">
            <svg-icon icon-class="chain" />
            {{ row.scope? row.scope:'未知' }}
          </template>
          <template slot="opt" slot-scope="{ row, index }" >
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-edit-outline"
                @click="handleEdit(index, row)">编辑
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(index, row)">删除
              </el-button>
            </el-button-group>
          </template>
        </Table>
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
      </Card>
    </el-main>
    <el-main>
      <Card
        style="border-radius: 10px"
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
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
          <el-form-item size="mini" label="编辑状态">
            <el-switch
              v-model="isEdit"
              disabled>
            </el-switch>
          </el-form-item>
          <el-form-item size="mini" label="客户端ID" prop="clientId" required>
            <el-input
              clearable
              prefix-icon="el-icon-user-solid"
              placeholder="请输入ID"
              :disabled="isEdit"
              v-model="ruleForm.clientId">
              <el-button slot="append" @click="autoGeneratorId">Auto</el-button>
            </el-input>
          </el-form-item>
          <el-form-item size="mini" label="客户端Secret" prop="clientSecret" required>
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
          <el-form-item size="mini" label="资源ID" >
            <el-input clearable
                      placeholder="多个资源时用逗号(,)分隔"
                      v-model="ruleForm.resourceIds">
            </el-input>
          </el-form-item>
          <el-form-item size="mini" label="权限范围">
            <el-input
              disabled
              prefix-icon="el-icon-success"
              placeholder="服务端默认支持所有权限"
              v-model="ruleForm.scope"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item size="mini" label="认证方式" prop="authorizedGrantTypes" required>
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
          <el-form-item size="mini" label="重定向" prop="webServerRedirectUri">
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
          <el-form-item size="mini" label="权限值" prop="authorities">
            <el-input v-model="ruleForm.authorities" placeholder="若有多个权限值,用逗号(,)分隔"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="令牌有效期/秒" prop="accessTokenValidity">
            <el-input-number
              v-model="ruleForm.accessTokenValidity"
              controls-position="right"
              placeholder="秒"
              :min="tokenMinTime"
              :max="tokenMaxTime"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item size="mini" label="刷新令牌有效期/秒" prop="refreshTokenValidity" >
            <el-input-number
              v-model="ruleForm.refreshTokenValidity"
              controls-position="right"
              placeholder="秒"
              :min="tokenRefreshMinTime"
              :max="tokenRefreshMaxTime"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item size="mini" label="预选属性" prop="additionalInformation">
            <el-input v-model="ruleForm.additionalInformation" placeholder="必须为JSON"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="自动批准" prop="autoApprove">
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
          <div align="center">
            <el-button type="primary" icon="el-icon-paperclip" @click="submitForm('ruleForm')">新增/更新</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetForm('ruleForm')">重置</el-button>
          </div>
        </el-form>

      </Card>
    </el-main>
  </el-container>
</template>

<script>

import Config from '@/settings'
import {deleteBatchClient, addClient, editClient, deleteClient, selectClientPage} from "../../../api/system/security";
import OAuthTableExpend from "./OAuthTableExpend";
export default {
  name: "OAuth2Client",
  components: {OAuthTableExpend},
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
      tempData: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          sortable: true,
          title: '客户端ID',
          width: 200,
          key: 'clientId',
          slot: 'clientId',
          align: 'center'
        },
        {
          sortable: true,
          title: '客户端Secret',
          width: 200,
          key: 'clientSecret',
          slot: 'clientSecret',
          align: 'center',
        },
        {
          title: '权限范围',
          width: 100,
          key: 'scope',
          slot: 'scope',
          align: 'center'
        },
        {
          width:"auto",
          type: 'expand',
          title: '详情',
          align: 'center',
          render: (h, params) => {
            return h(OAuthTableExpend, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '操作',
          key: 'opt',
          slot: 'opt',
          width: '185px',
          align: 'center',
          fixed: 'right'
        }
      ],
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
          this.tableData = res.data.records
          this.tempData = this.tableData
          this.total = res.data.total
          this.pages = res.data.pages
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
      this.isEdit = false
      this.$refs[formName].resetFields();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    savaOrUpdate() {
      let  data = this.setForm();
      // 编辑状态
      if (this.isEdit) {
        editClient(data).then(res => {
          this.notifyYes('更新客户端成功')
          this.resetForm('ruleForm')
          this.defaultChangePage()
        })
      } else {
        addClient(data).then(res => {
          this.notifyYes('添加客户端成功')
          this.resetForm('ruleForm')
          this.defaultChangePage()
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
    copyForm(tableData) {
      let data = {
        clientId: tableData.clientId,
        clientSecret: tableData.clientSecret,
        resourceIds: tableData.resourceIds,
        scope: 'all',
        authorizedGrantTypes: tableData.authorizedGrantTypes.split(','),
        webServerRedirectUri: tableData.webServerRedirectUri,
        authorities: tableData.authorities,
        accessTokenValidity: tableData.accessTokenValidity,
        refreshTokenValidity: tableData.refreshTokenValidity,
        additionalInformation: tableData.additionalInformation,
        autoApprove: tableData.autoApprove
      }
      return data
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
