<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-card class="box-card" shadow="never">
      <div slot="header" align="center" class="clearfix">
        <span class="role-span">职位管理</span>
      </div>
      <!--工具栏-->
      <div class="head-container">
        <eHeader :dict="dict" :permission="permission"/>
        <crudOperation :permission="permission"/>
      </div>
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        style="width: 100%;"
        highlight-current-row
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column prop="name" label="名称" fixed="left" />
        <el-table-column prop="jobSort" label="排序">
          <template slot-scope="scope">
            {{ scope.row.jobSort }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createTime" sortable width="168px">
          <template slot-scope="scope">
            <el-tag
              disable-transitions
              type=""
            >
              <i class="el-icon-time"></i>
              {{ parseTime(scope.row.createTime) }}
            </el-tag>
          </template>
        </el-table-column>
        <!--   编辑与删除   -->
        <el-table-column
          v-permission="['ROLE_admin','position:edit','position:del']"
          label="操作"
          width="130px"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
      <!--表单渲染-->
      <eForm :position-status="dict.position_status"/>
    </el-card>
  </div>
</template>

<script>
import crudJob from '@/api/system/job'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

export default {
  name: 'Position',
  components: {eHeader, eForm, crudOperation, pagination, udOperation},
  cruds() {
    return CRUD({
      title: '岗位',
      url: 'api/positions/page',
      sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudJob}
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['position_status'],
  data() {
    return {
      permission: {
        add: ['ROLE_admin', 'position:add'],
        edit: ['ROLE_admin', 'position:edit'],
        del: ['ROLE_admin', 'position:del']
      }
    }
  },
  methods: {
    // 改变状态
    changeEnabled(data, val) {
      let value = 0
      if (!val) {
        value = 1
      }
      this.$confirm('此操作将 "' + this.dict.position_status[value].label + '" ' + data.name + '岗位, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudJob.edit(data).then(() => {
          this.crud.notify(this.dict.position_status[value].label + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  margin-bottom: 5px;
}
</style>
