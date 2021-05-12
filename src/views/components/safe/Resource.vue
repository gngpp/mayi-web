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
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="id"
      highlight-current-row
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
      <el-table-column
        prop="fullUri"
        label="完整URI"
        width="286">
      </el-table-column>
      <el-table-column
        prop="method"
        label="请求方法"
        width="100">
      </el-table-column>
      <el-table-column
        prop="leaf"
        label="资源树LEAF"
        width="100">
        <template slot-scope="scope">
          <el-tag>
            {{ formatBoolean(scope.row.leaf) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="enabled"
        label="启用"
        width="70">
        <template slot-scope="scope">
          <el-tag>
            {{ formatBoolean(scope.row.enabled) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="allow"
        label="放行"
        width="60">
        <template slot-scope="scope">
          <el-tag>
            {{ formatBoolean(scope.row.allow) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="180">
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-sizes="[10, 100, 200, 300]"
      :current-page="page"
      :page-size="size"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<script>

import {selectResourcePage} from "../../../api/system/security";

export default {
  data() {
    return {
      dialogVisible: false,
      page: 1,
      size:10,
      total: 0,
      pages: null,
      tableData: [],
      search: ''
    }
  },
  created() {
    let data = {
      current: 1,
      size: 10
    }
    selectResourcePage(data)
      .then(res => {
      this.tableData = res.data.records
    })
  },
  methods: {
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
