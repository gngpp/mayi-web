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
        max-height="900"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column label="日志类型" prop="logType"/>
        <el-table-column label="用户名" prop="username"/>
        <el-table-column label="IP" prop="ip"/>
        <el-table-column :show-overflow-tooltip="true" label="IP区域" prop="ipRegion"/>
        <el-table-column label="uri" prop="uri"/>
        <el-table-column label="请求详情" type="expand">
          <template slot-scope="props">
            <el-form class="demo-table-expand" inline label-position="left">
              <el-card>
                <div>
                  <el-form-item label="请求方法">
                    <el-tag>{{ props.row.requestMethod }}</el-tag>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="JSON"></el-form-item>
                  <json-view :data="JSON.parse(props.row.parameter)"
                             icon-style="triangle"
                             label="JSON"
                             line-height="20"
                  ></json-view>
                </div>

              </el-card>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description"/>
        <el-table-column label="User-Agent" prop="userAgent"/>
        <el-table-column align="center" label="请求耗时" prop="spendTime">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.spendTime <= 300">{{ scope.row.spendTime }}ms</el-tag>
            <el-tag v-else-if="scope.row.spendTime <= 1000" type="warning">{{ scope.row.spendTime }}ms</el-tag>
            <el-tag v-else type="danger">{{ scope.row.spendTime }}ms</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createTime" width="180px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import Search from './search'
import {delAllInfo, delLog} from '@/api/monitor/log'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import jsonView from 'vue-json-views'

export default {
  name: 'Log',
  components: {Search, crudOperation, pagination, jsonView},
  cruds() {
    return CRUD({title: '日志', url: 'api/logs/page', query: {logType: "操作日志"}})
  },
  mixins: [presenter()],
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  methods: {
    confirmDelAll() {
      this.$confirm(`确认当页操作日志吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
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

<style>
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
</style>
