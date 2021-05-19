<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <el-card
          style="border-radius: 10px"
          class="box-card"
          shadow="hover"
        >
          <el-divider content-position="left">
            <el-tag effect="plain">
              <i class="el-icon-s-tools"></i>
              操作栏
            </el-tag>
          </el-divider>
          <el-divider direction="vertical">
          </el-divider>
          <!--    按钮组-->
          <el-button-group>
            <el-button type="primary" @click="refreshTable()" plain >刷新</el-button>
            <el-button type="success" icon="el-icon-folder-remove" plain @click="deleteCurrentPage()">取消选择</el-button>
            <el-button type="danger" icon="el-icon-delete"  plain @click="deleteSelect">删除所选</el-button>
            <el-button type="danger" icon="el-icon-delete"  plain @click="deleteCurrentPage(tableData)">删除当页</el-button>
          </el-button-group>
          <!--    分割线-->
          <el-divider content-position="center">
            <el-tag effect="plain">
              <svg-icon icon-class="permission" />
              权限字典列表
            </el-tag>
          </el-divider>
          <!--    权限列表-->
          <el-table
            v-loading="loading"
            ref="multipleTable"
            highlight-current-row
            :data="tableData.filter(data => !search || data.value.toLowerCase().includes(search.toLowerCase()))"
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
            </el-table-column>
            <el-table-column
              label="权限值"
              width="150"
              sortable
            >
              <template slot-scope="scope">
                <svg-icon icon-class="source" />
                <span style="margin-left: 10px">{{ scope.row.value }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建者"
              width="90"
              prop="createBy">
            </el-table-column>
            <el-table-column
              label="描述"
              prop="description">
            </el-table-column>
            <el-table-column
              fixed="right"
              width="170"
              align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    plain
                    round
                    size="mini"
                    type="primary"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    plain
                    round
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="checkDelete(scope.$index, scope.row)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="prev, pager, next, jumper,total"
            hide-on-single-page
            :page.sync="currentPage"
            :page-size.sync="pageSize"
            :page-count="pageCount"
            :total.sync="total">
          </el-pagination>
        </el-card>
      </el-main>
      <el-main>
        <el-card
          style="border-radius: 10px"
          class="box-card"
          shadow="hover"
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
            <el-form-item>
              <el-button type="primary" icon="el-icon-paperclip" plain @click="submitForm('form')">新增/更新</el-button>
              <el-button type="primary" icon="el-icon-refresh" plain @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {selectPermissionPage, deletePermissionByIds, updatePermission, savePermission, deletePermission} from "../../../api/system/security";


export default {
  name: "Permission",
  data() {
    return {
      loading: true,
      multipleSelection:[],
      dialogVisible: false,
      currentPage: 1,
      pageSize:10,
      total: 0,
      pageCount: null,
      tableData: [],
      search: '',
      isEdit: false,
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
                this.total = this.total + 1
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
          this.$refs.multipleTable.toggleRowSelection(row);
        });
        this.$confirm('此操作将永久删除当页权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deletePermissionByIds(ids)
            .then(res => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              let page = {
                current: this.currentPage -1 ,
                size: this.pageSize
              }
              this.changePage(page)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          this.$refs.multipleTable.clearSelection();
        });
      } else {
        this.$refs.multipleTable.clearSelection();
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
          this.multipleSelection.forEach(value => {
            ids.push(value.id)
          })
          deletePermissionByIds(ids)
        .then(res => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          // 选择全部，分页减一页
          if (this.tableData.length === this.multipleSelection.length) {
            let page = {
              current: this.currentPage - 1,
              size: this.pageSize
            }
            this.changePage(page)
          } else {
            this.defaultChangePage()
          }
        }).catch(reason => {
            this.defaultChangePage()
          })
        }
      ).catch(reason => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        this.$refs.multipleTable.clearSelection();
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
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
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          if (index == 0) {
            let page = {
              current: this.currentPage -1,
              size: this.pageSize
            }
            this.changePage(page)
          } else {
            this.defaultChangePage()
          }
        }).catch(reason => {
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'error'
        });
        this.defaultChangePage()
      })
    },
    defaultChangePage() {
      let page = {
        current: this.currentPage,
        size: this.pageSize
      }
      this.changePage(page)
    }
  },
}
</script>

<style scoped>

</style>
