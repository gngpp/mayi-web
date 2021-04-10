<template>
  <div class="app-container">
    <!--    面板-->
    <el-tabs>
      <el-tab-pane label="用户管理">
        <span slot="label"><svg-icon icon-class="peoples" /> 客户端管理</span>
        <div>
          <div class="head-container">
            <el-button type="primary">添加</el-button>
          </div>
          <!--      表格-->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData.filter(data => !search || data.date.toLowerCase().includes(search.toLowerCase()))"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              default-expand-all
              stripe
              row-key="id"
              style="width: 100%;margin-bottom: 20px;"
              tooltip-effect="dark"
              size="mini"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
                fixed>
              </el-table-column>
              <el-table-column
                label="客户端ID"
                prop="clientId"
                sortable
                fixed
                width="100">
              </el-table-column>
              <el-table-column
                label="客户端Secret"
                prop="clientSecret"
                sortable
                width="150">
              </el-table-column>
              <el-table-column
                label="可访问资源"
                prop="resourceIds"
                sortable
                width="150">
                <template slot-scope="scope">
                  <el-tag
                    disable-transitions>{{ scope.row.resourceIds }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="权限范围"
                prop="scope"
                sortable
                width="150">
              </el-table-column>
              <el-table-column
                label="认证方式"
                prop="authorizedGrantTypes"
                width="150">
              </el-table-column>
              <el-table-column
                label="重定向"
                prop="webServerRedirectUri"
                width="150">
              </el-table-column>
              <el-table-column
                label="权限值"
                prop="authorities"
                width="150">
              </el-table-column>
              <el-table-column
                label="Token有效期/秒"
                prop="accessTokenValidity"
                sortable
                width="150">
              </el-table-column>
              <el-table-column
                label="RefreshToken有效期/秒"
                prop="refreshTokenValidity"
                sortable
                width="200">
              </el-table-column>
              <el-table-column
                label="预选属性/必须为JSON"
                prop="additionalInformation"
                width="170"
              >
              </el-table-column>
              <el-table-column
                label="自动批准"
                prop="autoApprove"
                width="100"
              >
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作" width="150">
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search"
                    placeholder="输入关键字搜索"
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
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  margin-bottom: 5px;
}
</style>
<script>
export default {
  name: "Security",

  data() {
    return {
      multipleSelection: [],
      search: '',
      tableData: []
    }

  },
  created() {

  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
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

<style scoped>

</style>
