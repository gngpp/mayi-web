<template>
  <div class="head-container">
    <div>
      <!--    分割线-->
      <el-divider content-position="left">
        <i class="el-icon-s-tools"></i>
        <el-button-group>
          <el-button icon="el-icon-document-add" type="primary" plain>添加</el-button>
          <el-button icon="el-icon-delete" type="danger" plain>删除</el-button>
        </el-button-group>
      </el-divider>

    </div>
    <!--      表格-->
    <div>
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
    </div>
  </div>
</template>

<script>
import Config from '@/settings'
import {selectClientPage, deleteClient} from '@/api/system/security'
export default {
  name: "OAuth2Client",
  data() {
    return {
      multipleSelection: [],
      page: 1,
      total: 0,
      size:10,
      search: '',
      pages: null,
      tableData: []
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
