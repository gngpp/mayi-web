<template>
  <div class="app-container">
    <!--表单组件-->
    <Modal
      width="360"
      v-model="crud.status.cu > 0"
      @on-cancel="crud.cancelCU"
      closable
      scrollable
    >
      <p slot="header" style="color:#3e95ee;text-align:center">
        <Icon type="md-add-circle" />
        <span>{{ crud.status.title }}</span>
      </p>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="字典名称" prop="dictName" required>
          <el-input clearable v-model="form.dictName" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="描述" prop="description" required>
          <el-input clearable v-model="form.description" style="width: 200px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button type="primary" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </Modal>
    <!-- 字典列表 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="11" :xl="11" style="margin-bottom: 10px">
        <el-card class="box-card">
          <!--工具栏-->
          <div class="head-container">
            <div v-if="crud.props.searchToggle">
              <!-- 搜索 -->
              <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称或者描述搜索" style="width: 200px;"
                        class="filter-item" @keyup.enter.native="crud.toQuery"/>
              <rrOperation/>
            </div>
            <crudOperation :permission="permission"/>
          </div>
          <!--表格渲染-->
            <!--    分割线-->
            <el-divider content-position="center">
              <el-tag effect="plain">
                <svg-icon icon-class="education" />
                字典列表
              </el-tag>
            </el-divider>
            <!--        提示-->
            <Alert show-icon v-show="crud.openTip">
              已选择
              <span class="select-count">{{ crud.selections.length }}</span> 项
              <a class="select-clear" @click="clearSelectAll()">清空</a>
            </Alert>
            <el-table
              ref="table"
              v-loading="crud.loading"
              :data="crud.data"
              highlight-current-row
              style="width: 100%;"
              @selection-change="crud.selectionChangeHandler"
              @current-change="handleCurrentChange"
            >
              <el-table-column type="selection" width="55" fixed />
              <el-table-column :show-overflow-tooltip="true" prop="dictName" label="名称" align="center" />
              <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
              <el-table-column v-permission="['admin','dict:edit','dict:del']" label="操作" width="130px" align="center" fixed="right">
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
          </el-card>
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="13" :xl="13">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
            <el-button
              v-if="checkPermission(['ROLE_admin','dict:add']) && this.$refs.dictDetail && this.$refs.dictDetail.query.dictName"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dictDetail && $refs.dictDetail.crud.toAdd()"
            >新增</el-button>
          </div>
          <dictDetail ref="dictDetail" :permission="permission" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import dictDetail from './dictDetail'
import crudDict from '@/api/system/dict'

import CRUD, {form, header, presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import rrOperation from '@crud/RR.operation'
import udOperation from '@crud/UD.operation'

const defaultForm = { id: null, dictName: null, description: null, dictDetails: [] }

export default {
  name: 'Dict',
  components: { crudOperation, pagination, rrOperation, udOperation, dictDetail },
  cruds() {
    return [
      CRUD({ title: '字典', url: 'api/dictionaries/page', crudMethod: { ...crudDict }})
    ]
  },
  mixins: [presenter(), header(), form(defaultForm)],
  data() {
    return {
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'description', display_name: '描述' }
      ],
      rules: {
        description: [
          { required: true, message: '请输入描述信息', trigger: 'blur' }
        ],
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
      },
      permission: {
        add: ['ROLE_admin', 'dict:add'],
        edit: ['ROLE_admin', 'dict:edit'],
        del: ['ROLE_admin', 'dict:del']
      }
    }
  },
  methods: {
    checkPermission,
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.query.dictName = ''
      }
      return true
    },
    // 选中字典后，设置字典详情数据
    handleCurrentChange(val) {
      if (val) {
        this.$refs.dictDetail.query.dictName = val.dictName
        this.$refs.dictDetail.dictId = val.id
        this.$refs.dictDetail.crud.toQuery()
      }
    },
    clearSelectAll() {
      this.$refs.table.clearSelection()
    },
  }
}
</script>

<style scoped>
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  margin-bottom: 5px;
}
</style>
