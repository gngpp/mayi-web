<template>
  <div class="app-container">
    <!--表单组件-->
    <Modal
      v-model="crud.status.cu > 0"
      @on-cancel="crud.cancelCU"
      closable
      scrollable
      draggable
    >
      <p slot="header" style="color:#3e95ee;text-align:center">
        <Icon type="md-add-circle" />
        <span>{{ crud.status.title }}</span>
      </p>
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="部门排序" prop="deptSort">
          <el-input-number
            v-model.number="form.deptSort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="顶级部门" style="width: 400px">
          <el-radio-group v-model="form.isTop" >
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.isTop === '0'"  label="上级部门" prop="pid">
          <treeselect
            v-model="form.pid"
            :load-options="loadDept"
            :options="depts"
            style="width: 250px;"
            placeholder="选择上级类目"
          />
        </el-form-item>
        <el-form-item label="状态" prop="enabled" style="width: 400px">
          <el-radio v-for="item in dict.dept_status"
                    :key="item.id"
                    v-model="form.enabled"
                    :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button  type="primary" @click="crud.cancelCU">取消</el-button>
        <el-button  :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </Modal>
    <!--表格渲染-->
    <el-card class="box-card" shadow="never">
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.name" class="filter-item" clearable placeholder="输入部门名称搜索" size="small"
                    style="width: 200px;" @keyup.enter.native="crud.toQuery"/>
          <date-range-picker v-model="query.createTime" class="date-item"/>
          <el-select v-model="query.enabled" class="filter-item" clearable placeholder="状态" size="small"
                     style="width: 90px" @change="crud.toQuery">
            <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <rrOperation/>
        </div>
        <crudOperation :permission="permission"/>
      </div>
      <!--    分割线-->
      <el-divider content-position="center">
        <el-tag effect="plain">
          <svg-icon icon-class="dept" />
          部门列表
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
        lazy
        highlight-current-row
        :load="getDeptData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :data="crud.data"
        row-key="id"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
        :row-class-name="tableRowClassName">
        >
        <el-table-column :selectable="checkboxT" type="selection" width="55" fixed="left"/>
        <el-table-column label="名称" prop="name" fixed="left">
          <template slot-scope="scope">
            <el-tag
              disable-transitions
              type="''"
            > {{ scope.row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="deptSort" sortable>
          <template slot-scope="scope">
            <el-tag type="info">
              {{ scope.row.deptSort }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="enabled" sortable>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :disabled="scope.row.id === 1"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="changeEnabled(scope.row, scope.row.enabled,)"
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
        <el-table-column v-permission="['ROLE_admin','dept:edit','dept:del']" label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
              :disabled-dle="scope.row.id === 1"
              msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
import crudDept from '@/api/system/dept'
import Treeselect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, name: null, isTop: '1', subCount: 0, pid: null, deptSort: 999, enabled: 'true' }
export default {
  name: 'Dept',
  components: {Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker},
  cruds() {
    return CRUD({title: '部门', pageSize: 9999, url: 'api/departments/page', crudMethod: {...crudDept}})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  created() {
    this.crud.page = {
      page: 1,
      size: 999
    }
  },
  data() {
    return {
      depts: [],
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        deptSort: [
          {required: true, message: '请输入序号', trigger: 'blur', type: 'number'}
        ]
      },
      permission: {
        add: ['ROLE_admin', 'dept:add'],
        edit: ['ROLE_admin', 'dept:edit'],
        del: ['ROLE_admin', 'dept:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ]
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
    clearSelectAll() {
      this.$refs.table.clearSelection()
    },
    getDeptData(tree, treeNode, resolve) {
      const params = {
        page: 0,
        size: 999,
        query: {
          pid: tree.id,
          name: this.query.name,
          enabled: this.query.enabled,
          createTime: this.query.createTime
        }
      }
      setTimeout(() => {
        // 当存在子节点则加载， 否则执行lazy加载
        if (tree.children && tree.hasChildren) {
          resolve(tree.children)
        } else {
          crudDept.getDepts(params).then(res => {
            resolve(res.data.records)
          })
        }
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.pid !== null) {
        form.isTop = '0'
      } else if (form.id !== null) {
        form.isTop = '1'
      }
      form.enabled = `${form.enabled}`
      if (form.id != null) {
        this.getDeptVertex(form.id)
      } else {
        this.getDept()
      }
    },
    getDeptVertex(id) {
      crudDept.getDeptVertex(id).then(res => {
        const data = res.data.records
        this.buildDept(data)
        this.depts = data
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
    getDept() {
      crudDept.getDepts({ page: 0, size: 999, query: { enabled: true }}).then(res => {
        const data = res.data.records
        this.buildDept(data)
        this.depts = data
      })
    },
    // 获取弹窗内部门数据
    loadDept({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudDept.getDepts({ page: 0, size: 999, query: { enabled: true, pid: parentNode.id }})
          .then(res => {
            parentNode.children = res.data.records.map(function(obj) {
              if (obj.hasChildren) {
                obj.children = null
              } else {
                this.$set(obj, 'label', obj.name)
              }
              return obj
            })
            setTimeout(() => {
              callback()
            }, 100)
          })
      }
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (this.form.pid !== null && this.form.pid === this.form.id) {
        this.$message({
          message: '上级部门不能为空',
          type: 'warning'
        })
        return false
      }
      if (this.form.isTop === '1') {
        this.form.pid = null
      }
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      let value = 0
      if (!val) {
        value = 1
      }
      this.$confirm('此操作将 "' + this.dict.dept_status[value].label + '" ' + data.name + '部门, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudDept.edit(data)
          .then(res => {
            function demo(dept) {
              if (value === 1 && dept.hasChildren) {
                dept.children.forEach(childrenDept => {
                  childrenDept.enabled = false
                  demo(childrenDept)
                })
              }
            }
            demo(data)
            this.crud.notify(this.dict.dept_status[value].label + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            // eslint-disable-next-line handle-callback-err
          }).catch(err => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
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
