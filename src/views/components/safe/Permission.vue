<template>
  <el-card
    style="border-radius: 10px"
    class="box-card"
    shadow="hover"
  >
    <el-divider content-position="left">
      <i class="el-icon-lock"></i>
      权限字典列表
    </el-divider>
    <div>
      <el-button-group>
        <el-button type="primary" plain @click="handleOpen">新增权限</el-button>
        <el-button @click="toggleSelection(tableData)">删除当页</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </el-button-group>
    </div>
    <el-divider></el-divider>
    <el-table
      ref="multipleTable"
      highlight-current-row
      :data="tableData.filter(data => !search || data.value.toLowerCase().includes(search.toLowerCase()))"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="权限名"
        width="150"
        prop="name">
      </el-table-column>
      <el-table-column
        label="权限值"
        width="150"
      >
        <template slot-scope="scope">
          <svg-icon icon-class="source" />
          <span style="margin-left: 10px">{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        width="250"
        prop="description">
      </el-table-column>
      <el-table-column
        label="创建者"
        width="90"
        prop="createBy">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="180"
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">更新</el-button>
          <el-button
            plain
            size="mini"
            type="danger"
            @click="checkDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-sizes="[10, 100, 200, 300]"
      :current-page="page"
      :page-size="size"
      :total="total">
    </el-pagination>

    <!--    弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      center
      :before-close="handleClose">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px">
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
          <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {selectPermissionPage, deletePermission, updatePermission, savePermission} from "../../../api/system/security";
export default {
  name: "Permission",
  data() {
    return {
      multipleSelection:[],
      dialogVisible: false,
      page: 1,
      size:10,
      total: 0,
      pages: null,
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
              // 关闭窗口
              this.dialogVisible = false
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
                // 关闭窗口
                this.dialogVisible = false
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
      this.$refs[formName].resetFields();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
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
    handleOpen() {
      // 关闭窗口
      this.dialogVisible = true
      // 设置非编辑状态
      this.isEdit = false
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
      selectPermissionPage(data)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.pages = res.data.pages
        })
    },
    handleSizeChange(val) {
      this.size = val;
      this.defaultChangePage()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.defaultChangePage()
    },
    handleEdit(index, row) {
      this.isEdit = true
      this.dialogVisible = true
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
              current: this.page -1,
              size: this.size
            }
            this.changePage(page)
          }
          this.defaultChangePage()
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
        current: this.page,
        size: this.size
      }
      this.changePage(page)
    }
  },
}
</script>

<style scoped>

</style>
