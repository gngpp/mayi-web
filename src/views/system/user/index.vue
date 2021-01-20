<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <el-card
          style="border-radius: 10px"
          class="box-card"
          shadow="hover"
        >
          <div slot="header" class="clearfix">
            <span class="role-span">部门列表</span>
          </div>
          <div class="head-container">
            <el-input
              v-model="filterText"
              clearable
              placeholder="输入部门名称搜索"
              prefix-icon="el-icon-search"
              size="small"
            />
          </div>
          <el-tree
            ref="tree"
            :filter-node-method="filterNode"
            class="filter-tree"
            empty-text="无部门"
            highlight-current-row
            :data="sideDeptList"
            :load="getDeptData"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            icon-class="el-icon-circle-plus"
          />
        </el-card>
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--表单渲染-->
        <el-dialog
          :before-close="crud.cancelCU"
          :close-on-click-modal="false"
          :title="crud.status.title"
          :visible.sync="crud.status.cu > 0"
          append-to-body
          center
          close-on-press-escape
          modal
          show-close
          width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="66px" size="mini">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username"/>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model.number="form.phone"/>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName"/>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="部门" prop="department.id">
              <treeselect
                v-model="form.department.id"
                :options="deptList"
                :load-options="loadDeptList"
                style="width: 178px"
                placeholder="选择部门"
              />
            </el-form-item>
            <el-form-item label="职位" prop="positionList">
              <el-select
                v-model="positionData"
                style="width: 178px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeJob"
              >
                <el-option
                  v-for="item in positionList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.gender" style="width: 178px">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.enabled" :disabled="form.id === user.id">
                <el-radio
                  v-for="item in dict.user_status"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;" label="角色" prop="roleList">
              <el-select
                v-model="roleData"
                style="width: 437px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeRole"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.name"
                  :disabled="level !== 1 && item.level <= level"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-card class="box-card" shadow="never">
          <div slot="header" align="center" class="clearfix">
            <span class="role-span">用户管理</span>
          </div>
          <!--工具栏-->
          <div class="head-container">
            <div v-if="crud.props.searchToggle">
              <!-- 搜索 -->
              <el-input
                v-model="query.blurry"
                class="filter-item"
                clearable
                placeholder="输入名称或者邮箱搜索"
                size="small"
                style="width: 200px;"
                @keyup.enter.native="crud.toQuery"
              />
              <date-range-picker v-model="query.createTime" class="date-item"/>
              <el-select
                v-model="query.enabled"
                class="filter-item"
                clearable
                placeholder="状态"
                size="small"
                style="width: 90px"
                @change="crud.toQuery"
              >
                <el-option
                  v-for="item in enabledTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
              <rrOperation/>
            </div>
            <crudOperation :permission="permission" show=""/>
          </div>
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            border
            highlight-current-row
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
            :row-class-name="tableRowClassName">
            >
            <el-table-column :selectable="checkboxT" type="selection" width="55"/>
            <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名"/>
            <el-table-column :show-overflow-tooltip="true" prop="nickName" label="昵称"/>
            <el-table-column prop="gender" label="性别"/>
            <el-table-column :show-overflow-tooltip="true" prop="phone" width="100" label="电话"/>
            <el-table-column :show-overflow-tooltip="true" width="135" prop="email" label="邮箱"/>
            <el-table-column :show-overflow-tooltip="true" label="部门" prop="department">
              <template slot-scope="scope">
                <div>{{ scope.row.department.name }}</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="enabled">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  :disabled="user.id === scope.row.id"
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
                >
                  <i class="el-icon-time"></i>
                  {{ parseTime(scope.row.createTime) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-permission="['admin','user:edit','user:del']"
              label="操作"
              width="115"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <udOperation
                  :data="scope.row"
                  :permission="permission"
                  :disabled-dle="scope.row.id === user.id"
                />
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #ffffff;
}
</style>
<script>
import crudUser from '@/api/system/user'
import {isvalidPhone} from '@/utils/validate'
import {getDept, getDeptVertex} from '@/api/system/dept'
import {getAll, getLevel} from '@/api/system/role'
import {getAllPosition} from '@/api/system/job'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import {mapGetters} from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

let userRoles = []
let userPositions = []
const defaultForm = {
  id: null,
  username: null,
  nickName: null,
  gender: '男',
  email: null,
  enabled: 'false',
  roleIds: [],
  positionIds: [],
  department: {id: null, name: null},
  departmentId: null,
  phone: null
}
export default {
  name: 'User',
  components: {Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker},
  cruds() {
    return CRUD({title: '用户', url: 'api/users/page', crudMethod: {...crudUser}})
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['user_status'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      filterText: '',
      departmentId: null,
      department: {id: null, name: null},
      deptList: [],
      sideDeptList: [],
      positionList: [],
      level: 3,
      roleList: [],
      positionData: [], roleData: [], // 多选时使用
      defaultProps: {children: 'children', label: 'name', isLeaf: 'leaf'},
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        {key: 'true', display_name: '激活'},
        {key: 'false', display_name: '锁定'}
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.crud.msg.add = '新增成功，默认密码：123456'
    const params = {
      page: 0,
      size: 999,
      query: {}
    }
    getDept(params).then(res => {
      const data = res.data.records
      this.buildDept(data)
      this.sideDeptList = data
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.enabled) {
        return 'success-row';
      } else {
        return 'warning-row';
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    changeRole(value) {
      userRoles = []
      value.forEach(function (data, index) {
        const role = {id: data}
        userRoles.push(role)
      })
    },
    changeJob(value) {
      userPositions = []
      value.forEach(function (data, index) {
        const job = {id: data}
        userPositions.push(job)
      })
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id == null) {
        this.getDept()
      } else {
        this.getSupDept(form.department.id)
      }
      this.getRoles()
      this.getRoleLevel()
      this.getPositionList()
      form.enabled = form.enabled.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.positionData = []
      this.roleData = []
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.positionData = []
      this.roleData = []
      this.getPositionList()
      crudUser.getUserRoleIds(form.id).then(res => {
        this.roleData = res.data
        userRoles = res.data
      })
      crudUser.getUserJobIds(form.id).then(res => {
        this.positionData = res.data
        userPositions = res.data
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.department.id) {
        this.$message({
          message: '部门不能为空',
          type: 'warning'
        })
        return false
      } else if (this.positionData.length === 0) {
        this.$message({
          message: '岗位不能为空',
          type: 'warning'
        })
        return false
      } else if (this.roleData.length === 0) {
        this.$message({
          message: '角色不能为空',
          type: 'warning'
        })
        return false
      }
      crud.form.roleIds = this.roleData
      crud.form.positionIds = this.positionData
      crud.form.departmentId = crud.form.department.id
      // delete crud.form.department
      delete crud.form.createTime
      return true
    },
    // 获取左侧部门数据
    getDeptData(node, resolve) {
      setTimeout(() => {
        if (node.data.children && node.data.hasChildren) {
          resolve(node.data.children)
        }
      }, 100)
    },
    getDept() {
      getDept({
        page: 0,
        size: 999,
        query: {
          enabled: true
        }}).then(res => {
        const data = res.data.records
        this.buildDept(data)
        this.deptList = data
      })
    },
    getSupDept(departmentId) {
      getDeptVertex(departmentId).then(res => {
        const date = res.data.records
        this.buildDept(date)
        this.deptList = date
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
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.departmentId = null
      } else {
        this.query.departmentId = data.id
      }
      this.crud.toQuery()
    },
    // 改变状态
    changeEnabled(data, val) {
      let value = 0
      if (!val) {
        value = 1
      }
      data.departmentId = data.department.id
      data.positionIds = []
      data.roleIds = []
      this.$confirm('此操作将 "' + this.dict.user_status[value].label + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.edit(data).then(res => {
          this.crud.notify(this.dict.user_status[value].label + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
          this.$notify.error({
            title: '错误',
            message: '无权操作'
          })
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll().then(res => {
        this.roleList = res.data.records
      }).catch(() => { })
    },
    // 获取弹窗内岗位数据
    getPositionList() {
      const params = {
        page: 0,
        size: 999,
        query: {
          enabled: true
        }
      }
      getAllPosition(params).then(res => {
        this.positionList = res.data.records
      }).catch(() => {
      })
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.data
      }).catch(() => { })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  margin-bottom: 5px;
}
</style>
