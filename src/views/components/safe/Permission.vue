<style scoped>
.select-count {
  font-weight: 600;
  color: #40a9ff;
}

.select-clear {
  margin-left: 10px;
  color: #40a9ff;
}
</style>
<template>
  <div class="app-container">
<!--    <el-main>-->
<!--    -->
<!--    </el-main>-->
<!--    <el-main>-->
<!--   -->
<!--    </el-main>-->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card>
          <el-tag effect="plain">
            <i class="el-icon-s-tools"></i>
            操作栏
          </el-tag>
          <el-divider direction="vertical"></el-divider>
          <el-button  icon="el-icon-refresh" type="primary" plain @click="refreshTable()">重置</el-button>
          <el-button :loading="loading" type="danger" icon="el-icon-delete" plain  @click="deleteSelect">删除</el-button>
          <el-button :loading="loading" type="danger" icon="el-icon-delete" plain  @click="deleteCurrentPage(tableData)">删除当页</el-button>
          <el-button
            :loading="loading"
            @click="openPermissionDrawer"
            type="warning"
            plain
            icon="el-icon-share"
          >
            权限分配
          </el-button>
          <el-button type="primary" plain icon="el-icon-set-up" @click="openTip = !openTip">{{
              openTip ? "关闭提示" : "开启提示"
            }}</el-button>
          <!--        抽屉窗口-->
          <div>
            <Drawer
              title="角色与资源权限分配"
              :closable="true"
              width="1000"
              scrollable
              draggable
              v-model="openDrawer">
              <Alert show-icon>default权限是指用户在客户端认证时所分配的权限</Alert>
              <!--            Tab面板-->
              <Tabs value="name1" @on-click="handlerSelectTags">
                <TabPane label="资源权限绑定" icon="md-contacts" name="name1">
                  <Card>
                    <el-tag effect="plain">
                      <i class="el-icon-s-tools"></i>
                      操作栏
                    </el-tag>
                    <el-divider direction="vertical"></el-divider>
                    <Button :loading="openDrawerLoading" icon="el-icon-refresh" type="info" @click="refreshResourceLinkBidingList">刷新</Button>
                    <!--    分割线-->
                    <el-divider content-position="center">
                      <el-tag effect="plain">
                        <svg-icon icon-class="tree" />
                        资源列表
                      </el-tag>
                    </el-divider>
                    <!--                警告提示-->
                    <Alert v-if="this.table.length != 0" show-icon>
                  <span class="select-count">当前选择绑定权限值：{{
                      this.table.map(value => {
                        return value.value;
                      }).toString()
                    }}</span>
                      <a class="select-clear" @click="clearSelectAll()">清空</a>
                    </Alert>
                    <!--                  解绑操作对话框-->
                    <Modal v-model="openUnbindingResourceModel"
                           @on-ok="unbindingResourcePermission"
                           @on-cancel="cleanUnbindingResourcePermission"
                           draggable scrollable title="解绑权限">
                      <!--                警告提示-->
                      <Alert show-icon type="warning">
                       <span class="select-count">当前选择解绑资源URI：{{
                           this.selectResource.uri
                         }}</span>
                      </Alert>
                      <Select
                        v-model="selectResourcePermissionIdList"
                        multiple
                        style="width:200px">
                        <Option  v-for="item in selectResource.bindingPermissions" :value="item.id" :key="item.id">{{ item.value }}</Option>
                      </Select>
                    </Modal>
                    <Table
                      height="600" highlight-row
                      context-menu
                      show-context-menu
                      :loading="openDrawerLoading"
                      :columns="resourceLinkColumns"
                      @on-contextmenu="handleResourceLinkContextMenu"
                      :data="resourceLinkData">
                      <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                      </template>
                      <template slot-scope="{ row }" slot="enabled" >
                        <Tag v-if="row.enabled" type="dot" color="success">{{ row.enabled }}</Tag>
                        <Tag v-if="!row.enabled" type="dot"  color="error">{{ row.enabled }}</Tag>
                      </template>
                      <template slot-scope="{ row }" slot="allow" >
                        <Tag v-if="row.allow" type="dot" color="success">{{ row.allow }}</Tag>
                        <Tag v-if="!row.allow" type="dot"  color="error">{{ row.allow }}</Tag>
                      </template>
                      <template slot-scope="{ row }" slot="bindingPermissions">
                        <el-tag
                          :key="tag"
                          v-for="tag in formatPermission(row.bindingPermissions)"
                          :disable-transitions="false"
                          size="medium"
                        >
                          {{tag}}
                        </el-tag>
                      </template>
                      <template slot="contextMenu">
                        <DropdownItem @click.native="refreshResourceLinkBidingList">刷新</DropdownItem>
                        <DropdownItem v-if="this.table.length != 0" @click.native="bindingResourcePermission" style="color: #f69502">绑定</DropdownItem>
                        <DropdownItem @click.native="openUnbindingResourceModel = true" style="color: #e53d3d">解绑</DropdownItem>
                      </template>
                    </Table>
                  </Card>
                </TabPane>
                <TabPane label="角色权限绑定" icon="md-pulse" name="name2" >
                  <Card>
                    <el-tag effect="plain">
                      <i class="el-icon-s-tools"></i>
                      操作栏
                    </el-tag>
                    <el-divider direction="vertical"></el-divider>
                    <Button :loading="openDrawerLoading" icon="el-icon-refresh" type="info" @click="refreshRoleBindingList">刷新</Button>
                    <!--    分割线-->
                    <el-divider content-position="center">
                      <el-tag effect="plain">
                        <svg-icon icon-class="role" />
                        角色列表
                      </el-tag>
                    </el-divider>
                    <!--                警告提示-->
                    <Alert v-if="this.table.length != 0" show-icon>
                  <span class="select-count">当前选择绑定权限值：{{
                      this.table.map(value => {
                        return value.value;
                      }).toString()
                    }}</span>
                      <a class="select-clear" @click="clearSelectAll()">清空</a>
                    </Alert>
                    <!--                  解绑操作对话框-->
                    <Modal v-model="openUnbindingRoleModel"
                           @on-ok="unbindingRolePermission"
                           @on-cancel="cleanUnbindingRolePermission"
                           draggable scrollable title="解绑权限">
                      <!--                警告提示-->
                      <Alert show-icon type="warning">
                       <span class="select-count">当前选择角色：{{
                           this.selectRole.name
                         }}</span>
                      </Alert>
                      <Select
                        v-model="selectRolePermissionIdList"
                        multiple
                        style="width:200px">
                        <Option  v-for="item in selectRole.bindingPermissions" :value="item.id" :key="item.id">{{ item.value }}</Option>
                      </Select>
                    </Modal>
                    <Table
                      height="600" highlight-row
                      context-menu
                      show-context-menu
                      :loading="openDrawerLoading"
                      :columns="roleColumns"
                      :data="roleData"
                      @on-contextmenu="handleRoleContextMenu"
                    >
                      <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                      </template>
                      <template slot-scope="{ row }" slot="dataScope">
                        <strong> {{ row.dataScope == 0? '用户部门': (row.dataScope==1? '自定义' : '全部') }} </strong>
                      </template>
                      <template slot-scope="{ row }" slot="enabled" >
                        <Tag v-if="row.enabled" type="dot" color="success">{{ row.enabled }}</Tag>
                        <Tag v-if="!row.enabled" type="dot"  color="error">{{ row.enabled }}</Tag>
                      </template>
                      <template slot="contextMenu">
                        <DropdownItem @click.native="refreshRoleBindingList">刷新</DropdownItem>
                        <DropdownItem v-if="this.table.length != 0" @click.native="bindingRolePermission" style="color: #f69502">绑定</DropdownItem>
                        <DropdownItem @click.native="openUnbindingRoleModel = true" style="color: #e53d3d">解绑</DropdownItem>
                      </template>
                    </Table>
                  </Card>
                </TabPane>
              </Tabs>
            </Drawer>
          </div>
          <!--    分割线-->
          <el-divider content-position="center">
            <el-tag effect="plain">
              <svg-icon icon-class="permission" />
              权限字典列表
            </el-tag>
          </el-divider>
          <Alert show-icon v-show="openTip">
            已选择
            <span class="select-count">{{ this.table.length }}</span> 项
            <a class="select-clear" @click="clearSelectAll()">清空</a>
          </Alert>
          <!--    权限列表-->
          <el-table
            ref="table"
            v-loading="loading"
            highlight-current-row
            :data="tableData"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
              type="selection"
              fixed="left"
              width="55">
            </el-table-column>
            <el-table-column
              label="权限名"
              sortable
              width="150"
              prop="name">
              <template slot-scope="scope">
                <i class="el-icon-info" />
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="权限值"
              width="150"
              sortable
              prop="value"
            >
              <template slot-scope="scope">
                <svg-icon icon-class="permission" />
                <span style="margin-left: 10px">{{ scope.row.value }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建者"
              width="90"
              prop="createBy">
              <template slot-scope="scope">
                <svg-icon icon-class="role" />
                <span style="margin-left: 10px">{{ scope.row.createBy }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="描述"
              width="auto"
              prop="description">
              <template slot-scope="scope">
                <svg-icon icon-class="message" />
                <span style="margin-left: 10px">{{ scope.row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="220"
              align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  @input="searchPermission()"
                  size="mini"
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    type="text"
                    plain
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    type="text"
                    plain
                    icon="el-icon-delete"
                    @click="checkDelete(scope.$index, scope.row)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <!--        分割线-->
          <br/>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[5, 10, 15]"
            :page.sync="currentPage"
            :page-size.sync="pageSize"
            :page-count="pageCount"
            :total.sync="total">
          </el-pagination>
          <div style="margin-top: 20px">
            <Alert type="warning" show-icon>
              <Icon type="ios-bulb-outline" slot="icon"></Icon>
              系统提示
              <template slot="desc">
                删除权限时，将删除对应的角色、资源绑定的权限
              </template>
            </Alert>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card>
          <!--    分割线-->
          <el-divider content-position="left">
            <el-tag effect="plain">
              <i class="el-icon-edit-outline"></i>
              表单
            </el-tag>
          </el-divider>
          <el-form
            ref="form"
            :rules="rules"
            :model="form"
            label-width="80px">
            <el-form-item label="编辑状态">
              <el-switch
                v-model="isEdit"
                disabled>
              </el-switch>
            </el-form-item>
            <el-form-item label="权限名称" prop="name">
              <el-input clearable v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="权限值" prop="value">
              <el-input clearable v-model="form.value"></el-input>
            </el-form-item>
            <el-form-item label="权限描述" prop="description">
              <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <el-header>
            <div align="center">
              <el-button type="primary" plain icon="el-icon-paperclip"  @click="submitForm('form')">新增/更新</el-button>
              <el-button type="primary" plain icon="el-icon-refresh"  @click="resetForm('form')">重置</el-button>
            </div>
          </el-header>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  unbindingResource,
  unbindingRole,
  bindingRole,
  bindingResource,
  selectResourceLinkBindingList,
  selectPermissionPage,
  deletePermissionByIds,
  updatePermission,
  savePermission,
  deletePermission,
  selectRoleBindingList
} from "../../../api/seucirty/security";

import permissionExpand from "./permision-expand"
export default {
  name: "Permission",
  data() {
    return {
      openDrawer: false,
      loading: true,
      openUnbindingResourceModel: false,
      openUnbindingRoleModel: false,
      openDrawerLoading: false,
      dialogVisible: false,
      currentPage: 1,
      pageSize:5,
      total: 0,
      pageCount: null,
      tableData: [],
      openTip: true,
      search: '',
      isEdit: false,
      table:[],
      tempData:[],
      unbindingResourceList: [],
      form: {
        id: null,
        name: '',
        value: '',
        description: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入权限值', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'change' }
        ]
      },
      resourceLinkData:[],
      roleData:[],
      resourceLinkColumns: [
        {
          title: '资源名称',
          align: 'center',
          width: '120',
          slot: 'name',
          fixed: 'left'
        },
        {
          title: '资源URI',
          sortable: true,
          width: '300',
          key: 'uri'
        },
        {
          title: '请求方法',
          align: 'center',
          key: 'method',
          width: '120'
        },
        {
          title: '是否启用',
          key: 'enabled',
          width: '120',
          align: 'center',
          slot: 'enabled'
        },
        {
          title: '是否放行',
          key: 'allow',
          width: '120',
          align: 'center',
          slot: 'allow'
        },
        {
          title: '权限',
          sortable: true,
          align: 'center',
          slot: "bindingPermissions",
          key: 'permissions',
        },
      ],
      roleColumns: [
        {
          type: 'expand',
          width: 100,
          title: '查看权限',
          align: 'center',
          render: (h, params) => {
            return h(permissionExpand, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '角色名称',
          align: 'center',
          width: '100',
          key: 'name',
          slot: 'name',
        },
        {
          title: '数据权限',
          align: 'center',
          width: '150',
          slot: 'dataScope',
          key: 'dataScope'
        },
        {
          title: '状态',
          align: 'center',
          key: 'enabled',
          slot: 'enabled',
          width: '150'
        },
        {
          title: '描述',
          align: 'center',
          key: 'description',
        },
      ],
      selectResourcePermissionIdList: [],
      selectRolePermissionIdList:[],
      selectResource: [],
      selectRole:[]
    }
  },
  created() {
    this.defaultChangePage()
  },
  methods: {
    handlerSelectTags() {
      this.refreshRoleBindingList()
      this.refreshResourceLinkBidingList()
    },
    handleResourceLinkContextMenu (row) {
      this.selectResource = row
    },
    handleRoleContextMenu(row) {
      this.selectRole = row
    },
    cleanUnbindingResourcePermission() {
      this.selectResource = []
      this.selectResourcePermissionIdList =[]
    },
    cleanUnbindingRolePermission() {
      this.selectRole = []
      this.selectRolePermissionIdList = []
    },
    unbindingResourcePermission(row) {
      unbindingResource(this.selectResource.id, this.selectResourcePermissionIdList)
      .then(res => {
        this.$Message.success("解绑成功")
        this.cleanUnbindingResourcePermission()
        this.refreshResourceLinkBidingList()
      })
    },
    unbindingRolePermission(row) {
      unbindingRole(this.selectRole.id, this.selectRolePermissionIdList)
      .then(res => {
        this.$Message.success("解绑成功")
        this.cleanUnbindingRolePermission()
        this.refreshRoleBindingList()
      })
    },
    formatPermission(bindingPermissions) {
      try {
        let permissions = []
        bindingPermissions.forEach(value => {
          permissions.push(value.value)
        })
        return permissions.length == 0 ? ['default'] :permissions
      }catch (e) {
        return ['default']
      }
    },
    bindingRolePermission(row) {
      row = row ? this.selectRole : row
      if (row == undefined) {
        this.$Notice.warning({
          title: '警告',
          desc: "当前没有选择绑定资源"
        });
        return
      }
      if (this.table.length == 0) {
        this.$Notice.warning({
          title: '警告',
          desc: "当前没有选择绑定权限"
        });
        return
      }

      if (row.value == '') {
        this.$Message.warning("绑定权限值不能为空")
        return;
      }
      let permissionList = []
      this.table.forEach(value => {
        permissionList.push(value.id)
      })
      if (permissionList.length == 0) {
        this.$Message.warning("绑定权限列表不能为空")
        return;
      }
      bindingRole(row.id, permissionList)
        .then(res => {
          this.openPermissionDrawer()
          this.$Message.success("绑定成功")
        })
    },
    bindingResourcePermission(row){
      row = row ? this.selectResource : row
      if (row == undefined) {
        this.$Notice.warning({
          title: '警告',
          desc: "当前没有选择绑定资源"
        });
        return
      }
      if (this.table.length == 0) {
        this.$Notice.warning({
          title: '警告',
          desc: "当前没有选择绑定权限"
        });
        return
      }

      if (row.value == '') {
        this.$Message.warning("绑定权限值不能为空")
        return;
      }
      let permissionList = []
      this.table.forEach(value => {
        permissionList.push(value.id)
      })
      if (permissionList.length == 0) {
        this.$Message.warning("绑定权限列表不能为空")
        return;
      }
      bindingResource(row.id, permissionList)
        .then(res => {
          this.openPermissionDrawer()
          this.$Message.success("绑定成功")
      })
    },
    openPermissionDrawer() {
      this.openDrawer = true
      this.refreshResourceLinkBidingList()
      this.refreshRoleBindingList()
    },
    refreshResourceLinkBidingList() {
      this.openDrawerLoading = true
      selectResourceLinkBindingList()
        .then(res => {
          setTimeout(() => {
            this.resourceLinkData = res.data
            this.openDrawerLoading = false
          }, 300)
        })
    },
    refreshRoleBindingList() {
      this.openDrawerLoading = true
      selectRoleBindingList()
      .then(res => {
          setTimeout(()=>{
            this.roleData = res.data
            this.openDrawerLoading = false
          }, 300)
      })
    },
    searchPermission() {
      this.tableData = this.tempData.filter(data => !this.search || data.value.toLowerCase().includes(this.search.toLowerCase()))
    },
    clearSelectAll() {
      this.$refs.table.clearSelection()
    },
    refreshTable() {
      this.defaultChangePage()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let data = {
              id: this.form.id,
              name: this.form.name,
              value: this.form.value,
              description: this.form.description
            }
            updatePermission(data)
            .then(res => {
              this.$notify({
                title: '成功',
                message: '更新权限成功',
                type: 'success'
              });
              // 设置非编辑状态
              this.isEdit = false
              // 清空表单
              this.resetForm('form')
              this.defaultChangePage()
            }).catch(reason => {
              this.$notify.error({
                title: '错误',
                message: '更新权限失败'
              });
            })
          } else {
            let data = {
              name: this.form.name,
              value: this.form.value,
              description: this.form.description
            }
            savePermission(data)
              .then(res => {
                this.$notify({
                  title: '成功',
                  message: '新增权限成功',
                  type: 'success'
                });
                // 设置非编辑状态
                this.isEdit = false
                // 清空表单
                this.resetForm('form')
                this.defaultChangePage()
              }).catch(reason => {
              this.$notify.error({
                title: '错误',
                message: '新增权限失败'
              });
            })
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.isEdit = false
      this.$refs[formName].resetFields();
    },
    deleteCurrentPage(rows) {
      console.log(rows)
      if (rows) {
        const ids = []
        rows.forEach(row => {
          ids.push(row.id)
          this.$refs.table.toggleRowSelection(row);
        });
        this.$confirm('此操作将永久删除当页权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          if (ids.length <= 0) {
            this.$Message.warning("当前没有选中权限条例")
            return;
          }
          deletePermissionByIds(ids)
            .then(res => {
              this.$Message.success("删除成功");
              let query = {
                page: this.currentPage -1 ,
                size: this.pageSize
              }
              this.changePage(query)
            })
        }).catch(() => {
          this.$Message.info("已取消删除")
          this.$refs.table.clearSelection();
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    deleteSelect() {
      this.$confirm('此操作将永久删除所选权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const ids = []
          this.table.forEach(value => {
            ids.push(value.id)
          })
        if (ids.length <= 0) {
          this.$Message.warning("当前没有选中权限条例")
          return;
        }
          deletePermissionByIds(ids).then(res => {
          this.$Message.success("删除成功");
          // 选择全部，分页减一页
          if (this.tableData.length === this.table.length) {
            let query = {
              page: this.currentPage - 1,
              size: this.pageSize
            }
            this.changePage(query)
          } else {
            this.defaultChangePage()
          }
        }).catch(reason => {
            this.defaultChangePage()
          })
        }
      ).catch(reason => {
        this.$Message.info("已取消删除")
        this.$refs.table.clearSelection();
      })
    },
    handleSelectionChange(val) {
      this.table = val
    },
    checkDelete(index, row) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.handleDelete(index, row)
      }).catch(() => {
        this.$Message.success("已取消删除");
      });
    },
    handleOpen(id) {
      console.log(id)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // 设置非编辑状态
          this.isEdit = false
          // 清空表单
          this.resetForm('form')
          done();
        })
        .catch(_ => {});
    },
    changePage(data) {
      this.loading = true
      selectPermissionPage(data)
        .then(res => {
          this.total = res.data.total
          this.currentPage = res.data.current
          this.pageCount = res.data.pages
          this.tableData = res.data.records
          this.tempData = this.tableData
          setTimeout(() =>{
            this.loading = false
          },300)
        }).catch(reason => {
          this.loading = true
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.defaultChangePage()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.defaultChangePage()
    },
    handleEdit(index, row) {
      this.isEdit = true
      this.form.id = row.id
      this.form.name = row.name
      this.form.value = row.value
      this.form.description = row.description
    },
    handleDelete(index, row) {
      deletePermission(row.id)
        .then(res => {
          this.$Message.success("删除成功");
          if (index == 0) {
            let query = {
              page: this.currentPage -1,
              size: this.pageSize
            }
            this.changePage(query)
          } else {
            this.defaultChangePage()
          }
        }).catch(reason => {
        this.$Message.error("删除失败");
        this.defaultChangePage()
      })
    },
    defaultChangePage() {
      let query = {
        page: this.currentPage,
        size: this.pageSize
      }
      this.changePage(query)
    }
  },
}
</script>

<style scoped>

</style>
