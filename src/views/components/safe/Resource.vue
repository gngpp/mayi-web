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
          <el-button slot="reference" size="mini" type="primary" plain>查看详情</el-button>
        </el-popover>
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
      page: 1,
      size:10,
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
      }
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
