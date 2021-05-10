<template>
  <div>
    <div class="head-container">
      <el-button type="primary">添加</el-button>
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
        <el-table-column align="center" fixed="right" label="操作" width="150">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              placeholder="键入客户端ID"
              size="mini"/>
          </template>
          <template slot-scope="scope">
            <el-button
              plain
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
import {clientPage, deleteClient} from '@/api/system/security'
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
    this.changePage(this.page, this.size)
  },
  methods: {
    changePage(page, size) {
      clientPage(page, size)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.pages = res.data.pages
        })
    },
    handleSizeChange(val) {
      this.size = val;
      this.changePage(this.page, this.size)
    },
    handleCurrentChange(val) {
      this.page = val;
      this.changePage(this.page, this.size)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      if (Config.applyId == row.clientId) {
        this.$notify.error({
          message: "禁止删除当前登录客户端"
        })
        return;
      }
      deleteClient(row.clientId).then(res => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        });
        if (index == 0) {
          this.changePage(this.page -1 , this.size)
        }
        this.changePage(this.page, this.size)
      }).catch(reason => {
        this.changePage(this.page, this.size)
      })
    },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }
        ])
      }, 1000)
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
