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
  <el-container>
    <el-main>
      <Card style="border-radius: 10px">
        <el-tag effect="plain">
          <i class="el-icon-s-tools"></i>
          操作栏
        </el-tag>
        <el-divider direction="vertical"></el-divider>
        <el-button :loading="loading" icon="el-icon-refresh" type="primary" @click="refreshTable()"  >重置</el-button>
        <el-button :loading="loading" type="danger" icon="el-icon-delete"   @click="deleteSelect">删除</el-button>
        <el-button :loading="loading" type="danger" icon="el-icon-delete"   @click="deleteCurrentPage(tableData)">删除当页</el-button>
        <el-button type="primary" icon="el-icon-set-up" @click="openTip = !openTip">{{
            openTip ? "关闭提示" : "开启提示"
          }}</el-button>
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
              <svg-icon icon-class="message" />
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
            width="170"
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
                  type="primary"
                  icon="el-icon-edit-outline"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  type="danger"
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
      </Card>
    </el-main>
    <el-main>
      <Card
        style="border-radius: 10px"
      >
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
            <el-button type="primary" icon="el-icon-paperclip"  @click="submitForm('form')">新增/更新</el-button>
            <el-button type="primary" icon="el-icon-refresh"  @click="resetForm('form')">重置</el-button>
          </div>
        </el-header>
      </Card>
    </el-main>
  </el-container>
</template>

<script>
import {selectPermissionPage, deletePermissionByIds, updatePermission, savePermission, deletePermission} from "../../../api/system/security";

export default {
  name: "Permission",
  data() {
    return {
      loading: true,
      dialogVisible: false,
      currentPage: 1,
      pageSize:8,
      total: 0,
      pageCount: null,
      tableData: [],
      openTip: true,
      search: '',
      isEdit: false,
      table:[],
      tempData:[],
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
      }
    }
  },
  created() {
    this.defaultChangePage()
  },
  methods: {
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
