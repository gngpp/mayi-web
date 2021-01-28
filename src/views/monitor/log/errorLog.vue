<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="hover"
      style="border-radius: 10px"
    >
      <div class="head-container">
        <Search/>
        <crudOperation>
          <el-button
            slot="left"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :loading="crud.delAllLoading"
            @click="confirmDelAll()"
          >
            清空当页
          </el-button>
        </crudOperation>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        border
        max-height="750"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column label="日志类型" prop="logType"/>
        <el-table-column label="用户名" prop="username"/>
        <el-table-column label="IP" prop="ip"/>
        <el-table-column :show-overflow-tooltip="true" label="IP区域" prop="ipRegion"/>
        <el-table-column label="uri" prop="uri"/>
        <el-table-column label="请求详情" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-card>
                <div>
                  <el-form-item label="请求方法">
                    <el-tag>{{ props.row.requestMethod }}</el-tag>
                  </el-form-item>
                </div>
                <el-divider></el-divider>
                <div>
                  <el-form-item label="JSON"></el-form-item>
                  <json-view :data="JSON.parse(props.row.parameter)"
                             icon-style="triangle"
                             label="JSON"
                             line-height="20"
                  ></json-view>
                </div>
                <el-divider></el-divider>
              </el-card>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"/>
        <el-table-column label="类名" prop="className"/>
        <el-table-column label="方法名" prop="methodName"/>
        <el-table-column label="异常详情" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row.exceptionDetails)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="User-Agent" prop="userAgent"/>
        <el-table-column label="耗时" prop="spendTime">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.spendTime <= 300">{{ scope.row.spendTime }}ms</el-tag>
            <el-tag v-else-if="scope.row.spendTime <= 1000" type="warning">{{ scope.row.spendTime }}ms</el-tag>
            <el-tag v-else type="danger">{{ scope.row.spendTime }}ms</el-tag>
          </template>
        </el-table-column>
        >
        <el-table-column label="创建日期" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialog" title="异常详情" append-to-body top="30px" width="85%">
        <json-view
          v-if="isJson"
          :data="errorInfo"
          line-height="20"
        ></json-view>
      </el-dialog>
      <!--分页组件-->
      <pagination/>
      <el-drawer
        :visible.sync="drawer"
        :with-header="true"
        size="40%"
        title="异常信息"
      >
        <div class="container">
          <json-view
            v-if="isJson"
            :data="errorInfo"
            modal
            show-close
          ></json-view>
        </div>
        <el-backtop target=".container" visibility-height="50">
          <div
            style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
          >
            UP
          </div>
        </el-backtop>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
import {delLog} from '@/api/monitor/log'
import Search from './search'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import jsonView from 'vue-json-views'

export default {
  name: 'ErrorLog',
  components: {Search, crudOperation, pagination, jsonView},
  cruds() {
    return CRUD({title: '异常日志', url: 'api/logs/page', query: {logType: "错误日志"}})
  },
  mixins: [presenter()],
  data() {
    return {
      drawer: false,
      isJson: false,
      errorInfo: '', dialog: false
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  methods: {
    // 获取异常详情
    info(data) {
      try {
        this.errorInfo = JSON.parse(data)
        this.isJson = true
      } catch (e) {
        this.errorInfo = data
        this.isJson = false
      }
      //this.dialog = true
      this.drawer = true
    },
    confirmDelAll() {
      this.$confirm(`确认当页异常日志吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        let isDel = false;
        this.crud.data.forEach(res => {
          isDel = true
          ids.push(res.id)
        })
        if (!isDel) {
          this.$notify({
            type: 'warning',
            title: '当前列表没有日志'
          })
          return
        }
        delLog(ids).then(res => {
          this.crud.delAllLoading = false
          this.crud.dleChangePage(1)
          this.$notify({
            title: '清空成功',
            type: 'success'
          })
          this.crud.toQuery()
        }).catch(err => {
          this.crud.delAllLoading = false
          console.log(err.response.data.message)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}

/deep/ .el-dialog__body {
  padding: 0 20px 10px 20px !important;
}

.java.hljs {
  color: #444;
  background: #ffffff !important;
  height: 630px !important;
}
</style>
<style lang="scss" rel="stylesheet/scss">
.el-drawer.rtl {
  overflow: scroll
}

</style>
<style lang='scss' scoped>
.container {
  width: 100%;
  height: 100vh; //核心
  overflow-x: hidden; //核心
}

.toTop {
  padding: 10px;
  box-shadow: 0px 0px 5px black;
}
</style>
