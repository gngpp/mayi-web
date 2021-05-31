<template>
  <div class="app-container">
    <!-- SAVA UPDATE -->
    <Modal
      v-model="crud.status.cu > 0"
      @on-cancel="crud.cancelCU"
      closable
      scrollable
      >
      <p slot="header" style="color:#3e95ee;text-align:center">
        <Icon type="md-add-circle" />
        <span>{{ crud.status.title }}</span>
      </p>
      <el-form ref="form" :model="form" :rules="rules" inline label-width="80px" size="small">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 380px;"/>
        </el-form-item>
        <el-form-item label="角色级别" prop="level">
          <el-input-number v-model.number="form.level" :min="1" controls-position="right" style="width: 145px;"/>
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-radio-group v-model="form.dataScope" @change="loadDepartment">
            <el-radio-button :label="0">用户部门</el-radio-button>
            <el-radio-button :label="1" >自定义</el-radio-button>
            <el-radio-button :label="2">全部</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色状态" prop="enabled">
          <el-radio v-for="item in dict.role_status" :key="item.name" v-model="form.enabled" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
        <el-form-item v-if="form.dataScope == 1" label="数据权限" prop="departmentIds">
          <treeselect
            v-model="departmentData"
            :load-options="loadDeptList"
            :options="departmentList"
            multiple
            style="width: 380px"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="form.description" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </Modal>

    <el-row :gutter="15">
      <!--角色列表-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <!--工具栏-->
          <div class="head-container">
            <div v-if="crud.props.searchToggle">
              <!-- 搜索 -->
              <el-input v-model="query.blurry" class="filter-item" clearable placeholder="输入名称或者描述搜索" size="small"
                        style="width: 200px;" @keyup.enter.native="crud.toQuery"/>
              <date-range-picker v-model="query.createTime" class="date-item"/>
              <rrOperation/>
            </div>
            <crudOperation :permission="permission"/>
          </div>
          <!--    分割线-->
          <el-divider content-position="center">
            <el-tag effect="plain">
              <svg-icon icon-class="role" />
              角色列表
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
            :row-class-name="tableRowClassName"
            @current-change="handleCurrentChange"
          >
            <el-table-column :selectable="checkboxT" type="selection" width="55"/>
            <el-table-column prop="name" label="名称"/>
            <el-table-column prop="dataScope" label="数据权限">
              <template slot-scope="scope">
                {{ scope.row.dataScope == 0? '用户部门': (scope.row.dataScope==1? '自定义' : '全部') }}
              </template>
            </el-table-column>
            <el-table-column label="角色级别" prop="level" sortable/>
            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述"/>
            <el-table-column align="center" label="状态" prop="enabled">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  :disabled="!checkPermission(['ROLE_admin'])"
                  active-color="#409EFF"
                  inactive-color="#F56C6C"
                  @change="changeEnabled(scope.row, scope.row.enabled)"
                />
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="创建日期" prop="createTime" sortable width="168px">
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
            <el-table-column v-permission="['ROLE_admin','role:edit','role:del']" label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <udOperation
                  v-if="scope.row.level >= level"
                  :data="scope.row"
                  :permission="permission"
                />
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['ROLE_admin','role:edit']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 10px"
              type="primary"
              plain
              @click="saveMenu"
            >保存</el-button>
            <el-button
              v-permission="['ROLE_admin','role:edit']"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 10px"
              type="warning"
              plain
              @click="resetChecked"
            >清空</el-button>
          </div>
          <el-tree
            ref="menu"
            lazy
            :data="menuList"
            :default-checked-keys="menuIds"
            :load="getMenuDataList"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
            @check="menuChange"
          />
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import crudRoles from '@/api/system/role'
import {getDept, getDeptVertex} from '@/api/system/dept'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import Treeselect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DateRangePicker from '@/components/DateRangePicker'
import crudMenu from '@/api/system/menu'
import checkPermission from "../../../utils/permission";

const defaultForm = {
  id: null,
  name: null,
  description: null,
  dataScope: '0',
  enabled: 'true',
  level: 999,
  menuIds: null,
  departmentIds: null
}
export default {
  name: 'Role',
  components: {Treeselect, pagination, crudOperation, rrOperation, udOperation, DateRangePicker},
  cruds() {
    return CRUD({title: '角色', url: 'api/roles/page', sort: ['level,asc'], crudMethod: {...crudRoles}})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['role_status'],
  data() {
    return {
      defaultProps: {children: 'children', label: 'label', isLeaf: 'leaf'},
      dateScopes: ['全部', '用户部门', '自定义'],
      level: 3,
      currentId: 0,
      menuLoading: false,
      showButton: false,
      menuList: [],
      menuIds: [],
      from: {},
      departmentList: [],
      departmentData: [], // 多选时使用
      permission: {
        add: ['ROLE_admin', 'role:add'],
        edit: ['ROLE_admin', 'role:edit'],
        del: ['ROLE_admin', 'role:del']
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    crudRoles.getLevel().then(data => {
      this.level = data.data
    })
    const params = {
      page: 0,
      size: 999,
      query: {}
    }
    crudMenu.getMenus(params).then(res => {
      const data = res.data.records
      this.buildMenu(data)
      this.menuList = data
    })
  },
  methods: {
    getScopeValue(val) {
      if (val == '0') {
        return '用户部门'
      }
      if (val == '1') {
        return '自定义'
      }
      if (val == '2') {
        return '全部'
      }
    },
    checkPermission,
    tableRowClassName({row, rowIndex}) {
      if (row.enabled) {
        return 'success-row';
      } else {
        return 'warning-row';
      }
    },
    clearSelectAll() {
      this.$refs.table.clearSelection()
    },
    // 改变状态
    changeEnabled(data, val) {
      let value = 0
      if (!val) {
        value = 1
      }
      this.$confirm('此操作将 "' + this.dict.role_status[value].label + '" ' + data.name + '岗位, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudRoles.setRoleStatus(data.id, val).then(() => {
          this.crud.notify(this.dict.role_status[value].label + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    resetChecked() {
      // 清空菜单的选中
      this.$refs.menu.setCheckedKeys([])
    },
    getMenuDataList(tree, resolve) {
      setTimeout(() => {
        if (tree.data.children && tree.data.hasChildren) {
          resolve(tree.data.children)
        }
      }, 100)
    },
    [CRUD.HOOK.afterRefresh]() {
      this.$refs.menu.setCheckedKeys([])
    },
    // 新增前初始化部门信息
    [CRUD.HOOK.beforeToAdd]() {
      this.departmentData = []
    },
    // 编辑前初始化自定义数据权限的部门信息
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.departmentData = []
      form.enabled = `${form.enabled}`
      if (form.dataScope == '1') {
        this.getDeptList()
      }
      this.departmentData = form.departmentIds
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.dataScope == 1 && this.departmentData.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
        return false
      } else if (crud.form.dataScope == 1) {
        crud.form.menuIds = this.menuIds
        crud.form.departmentIds = this.departmentData
        delete crud.form.createTime
      } else {
        crud.form.departmentIds = []
      }
      return true
    },
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化选中的key
        this.menuIds = val.menuIds
        this.from = val
        // 显示button
        this.showButton = true
      }
    },
    menuChange(menu) {
      // 判断是否在 menuIds 中，如果存在则删除，否则添加
      const index = this.menuIds.indexOf(menu.id)
      if (index !== -1) {
        this.menuIds.splice(index, 1)
      } else {
        this.menuIds.push(menu.id)
      }
    },
    // 保存菜单
    saveMenu() {
      this.menuLoading = true
      // 得到已选中的 key 值
      const _this = this
      this.menuIds.forEach(function(id) {
        _this.from.menuIds.push(id)
      })
      crudRoles.edit(this.from).then(() => {
        this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    },
    // 改变数据
    update() {
      // 无刷新更新 表格数据
      crudRoles.get(this.currentId).then(res => {
        console.log(res.data)
        for (let i = 0; i < this.crud.data.length; i++) {
          if (res.data.id === this.crud.data[i].id) {
            this.crud.data[i] = res.data
            break
          }
        }
      })
    },
    // 获取部门数据
    getDeptList() {
      getDept({ page:1, size:9999, query: { }})
        .then(res => {
          const data = res.data.records
          this.buildDept(data)
          this.departmentList = data
        })
    },
    buildDept(deptList) {
      deptList.forEach(data => {
        this.$set(data, 'label', data.name)
        if (data.children) {
          this.buildDept(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    buildMenu(menuList) {
      menuList.forEach(data => {
        this.$set(data, 'label', data.title)
        if (data.children) {
          this.buildMenu(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    getVertexDept(deptList) {
      const ids = []
      deptList.forEach(dept => {
        ids.push(dept.id)
      })
      getDeptVertex(ids).then(res => {
        const data = res.data.records
        this.buildDeptList(data)
        this.departmentList = data
      })
    },
    buildDeptList(deptList) {
      deptList.forEach(data => {
        this.$set(data, 'label', data.name)
        if (data.children) {
          this.buildDeptList(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    loadDepartment() {
      this.getDeptList()
    },
    // 获取弹窗内部门数据
    loadDeptList({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDept({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 如果数据权限为自定义则获取部门数据
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDeptList()
      }
    },
    checkboxT(row) {
      return row.level >= this.level
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
   text-align: left;
 }

 ::v-deep .vue-treeselect__multi-value {
   margin-bottom: 0;
 }

 ::v-deep .vue-treeselect__multi-value-item {
   border: 0;
   padding: 0;
 }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  margin-bottom: 5px;
}
</style>
