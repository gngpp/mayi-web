<template>
  <div>
    <div v-if="query.dictName === ''">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
<!--        <div v-if="crud.props.searchToggle">-->
<!-- -->
<!--        </div>-->
        <!-- 搜索 -->
        <el-input v-model="query.label" clearable size="small" placeholder="输入字典标签查询" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery()" />
        <rrOperation />
      </div>
      <!--表单组件-->
      <Modal
        width="500"
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
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="form.label" style="width: 370px;" clearable />
          </el-form-item>
          <el-form-item label="字典值" prop="value">
            <el-input v-model="form.value" style="width: 370px;" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="dictSort">
            <el-input-number v-model.number="form.dictSort" :min="0" :max="999" controls-position="right" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </Modal>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        highlight-current-row
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column label="所属字典" fixed="left">
          {{ query.dictName }}
        </el-table-column>
        <el-table-column prop="label" label="字典标签" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="dictSort" label="排序" />
        <el-table-column v-permission="['ROLE_admin','dict:edit','dict:del']" label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudDictDetail from '@/api/system/dictDetail'
import CRUD, {form, header, presenter} from '@crud/crud'
import pagination from '@crud/Pagination'
import rrOperation from '@crud/RR.operation'
import udOperation from '@crud/UD.operation'

const defaultForm = { id: null, label: null, value: null, dictSort: 999 }

export default {
  components: { pagination, rrOperation, udOperation },
  cruds() {
    return [
      CRUD({ title: '字典详情', url: 'api/dictionaries/details/page', query: { dictName: '' }, sort: ['dictSort,asc', 'id,desc'],
        crudMethod: { ...crudDictDetail },
        optShow: {
          add: true,
          edit: true,
          del: true,
          reset: false
        },
        queryOnPresenterCreated: false
      })
    ]
  },
  mixins: [
    presenter(),
    header(),
    form(function() {
      return Object.assign({ dictId: this.dictId }, defaultForm)
      // return Object.assign(defaultForm)
    })],
  data() {
    return {
      dictId: null,
      rules: {
        label: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        dictSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      },
      permission: {
        add: ['ROLE_admin', 'dict:add'],
        edit: ['ROLE_admin', 'dict:edit'],
        del: ['ROLE_admin', 'dict:del']
      },
      formatBoolean: function(row, column, cellValue) {
        let ret
        if (cellValue) {
          ret = 'true'
        } else {
          ret = 'false'
        }
        return ret
      }
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
