<template>
  <div class="app-container">
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="580px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="菜单图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="外链菜单" prop="iframe">
          <el-radio-group v-model="form.iframe" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() === '1'" label="菜单缓存" prop="cache">
          <el-radio-group v-model="form.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="菜单可见" prop="hidden">
          <el-radio-group v-model="form.hidden" size="mini">
            <el-radio-button label="false">是</el-radio-button>
            <el-radio-button label="true">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="菜单标题" prop="title">
          <el-input v-model="form.title" :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item v-if="form.type.toString() === '2'" label="按钮名称" prop="title">
          <el-input v-model="form.title" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '0'" label="权限标识" prop="permission">
          <el-input v-model="form.permission" :disabled="form.iframe" placeholder="权限标识" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="路由地址" prop="routePath">
          <el-input v-model="form.routePath" placeholder="路由地址" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input-number v-model.number="form.menuSort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件名称" prop="componentName">
          <el-input v-model="form.componentName" style="width: 178px;" placeholder="匹配组件内Name字段" />
        </el-form-item>
        <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件路径" prop="componentPath">
          <el-input v-model="form.componentPath" style="width: 178px;" placeholder="组件路径" />
        </el-form-item>
        <el-form-item label="上级类目" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="menus"
            :load-options="loadMenus"
            style="width: 450px;"
            placeholder="选择上级类目"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-card
      class="box-card"
      shadow="hover"
    >
      <div slot="header" align="center" class="clearfix">
        <span class="role-span">菜单管理</span>
      </div>
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.blurry" class="filter-item" clearable placeholder="模糊搜索" size="small"
                    style="width: 200px;" @keyup.enter.native="crud.toQuery"/>
          <date-range-picker v-model="query.createTime" class="date-item"/>
          <rrOperation/>
        </div>
        <crudOperation :permission="permission"/>
      </div>
      <el-table
        ref="table"
        v-loading="crud.loading"
        lazy
        highlight-current-row
        border
        stripe
        :load="getMenus"
        :data="crud.data"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="id"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column :show-overflow-tooltip="true" label="菜单标题" width="125px" prop="title" fixed="left" />
        <el-table-column prop="icon" label="图标" align="center" width="60px">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
          </template>
        </el-table-column>
        <el-table-column prop="menuSort" align="center" label="排序">
          <template slot-scope="scope">
            {{ scope.row.menuSort }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="permission" label="权限标识" />
        <el-table-column :show-overflow-tooltip="true" prop="componentPath" label="组件路径" />
        <el-table-column :show-overflow-tooltip="true" prop="componentName" label="组件名称" />
        <el-table-column prop="iframe" label="外链" width="75px">
          <template slot-scope="scope">
            <span v-if="scope.row.iframe">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="cache" label="缓存" width="75px">
          <template slot-scope="scope">
            <span v-if="scope.row.cache">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="hidden" label="可见" width="75px">
          <template slot-scope="scope">
            <span v-if="scope.row.hidden">否</span>
            <span v-else>是</span>
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
        <el-table-column v-permission="['admin','menu:edit','menu:del']" label="操作" width="130px" align="center"
                         fixed="right">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
              msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import crudMenu from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'
import Treeselect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'

// crud交由presenter持有
const defaultForm = { id: null, title: null, menuSort: 999, routePath: null, componentPath: null, componentName: null, iframe: false, roles: [], pid: null, icon: null, cache: false, hidden: false, type: 0, permission: null }
export default {
  name: 'Menu',
  components: {Treeselect, IconSelect, crudOperation, rrOperation, udOperation, DateRangePicker},
  cruds() {

    return CRUD({title: '菜单', pageSize: 9999, url: 'api/menus/page', crudMethod: {...crudMenu}})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  created() {
    this.crud.page = {
      // 页码
      page: 1,
      // 每页数据条数
      size: 9999,
      // 总数据条数
      total: 0
    }
  },
  data() {
    return {
      menus: [],
      permission: {
        add: ['admin', 'menu:add'],
        edit: ['admin', 'menu:edit'],
        del: ['admin', 'menu:del']
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.menus = []
      if (form.id != null) {
        this.getMenuVertex(form.id)
      } else {
        const params = {
          page: 0,
          size: 999,
          query: {}
        }
        crudMenu.getMenus(params).then(res => {
          const data = res.data.records
          this.buildMenu(data)
          this.menus.push({ id: 0, label: '顶级类目', children: data })
        })
      }
    },
    getMenus(tree, treeNode, resolve) {
      const params = {
        page: 0,
        size: 999,
        query: {
          pid: tree.id
        }}
      setTimeout(() => {
        // 当存在子节点则加载， 否则执行lazy加载
        if (tree.children && tree.hasChildren) {
          resolve(tree.children)
        } else {
          crudMenu.getMenus(params).then(res => {
            resolve(res.data.records)
          })
        }
      }, 100)
    },
    getMenuVertex(id) {
      crudMenu.getMenuVertex(id).then(res => {
        const data = res.data.records
        this.buildMenu(data)
        // const children = res.data.records.map(function(obj) {
        //   if (!obj.leaf && !obj.children) {
        //     obj.children = null
        //   }
        //   return obj
        // })
        this.menus = [{ id: 0, label: '顶级类目', children: data }]
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
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudMenu.getMenusTree(parentNode.id).then(res => {
          parentNode.children = res.map(function(obj) {
            if (!obj.leaf) {
              obj.children = null
            } else {
              this.$set(obj, 'label', obj.title)
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 选中图标
    selected(name) {
      this.form.icon = name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

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
