<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.filter" class="filter-item" clearable placeholder="模糊搜索" size="small"
                  style="width: 200px;" @keyup.enter.native="crud.toQuery"/>
        <rrOperation />
      </div>
      <crudOperation>
        <el-button
          slot="left"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :loading="delLoading"
          :disabled="crud.selections.length === 0"
          @click="doDelete(crud.selections)"
        >
          强退
        </el-button>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55"/>
      <el-table-column label="用户名" prop="username"/>
      <el-table-column prop="nickName" label="用户昵称"/>
      <el-table-column prop="ip" label="登录IP"/>
      <el-table-column :show-overflow-tooltip="true" label="登录地点" prop="ipRegion"/>
      <el-table-column prop="browser" label="浏览器"/>
      <el-table-column prop="loginTime" label="登录时间">
        <template slot-scope="scope">
          <el-tag
            disable-transitions
          >
            <i class="el-icon-time"></i>
            {{ parseTime(scope.row.loginTime) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="70px">
        <template slot-scope="scope">
          <el-popover
            v-if="user.id !== scope.row.id"
            :ref="scope.$index"
            v-permission="['admin']"
            placement="top"
            width="180"
          >
            <p>确定强制退出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="danger" @click="delMethod(scope.row.id, scope.$index)">确定
              </el-button>
            </div>
            <el-button slot="reference" plain size="mini" type="danger">强退</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import {del} from '@/api/monitor/online'
import CRUD, {crud, header, presenter} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import {mapGetters} from "vuex";

export default {
  name: 'OnlineUser',
  components: {pagination, crudOperation, rrOperation},
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  cruds() {
    return CRUD({url: 'api/online/page', title: '在线用户'})
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      delLoading: false,
      permission: {},
      form: {
        userName: null,
        nickName: null,
        department: null,
        ip: null,
        browser: null,
        loginTime: null
      }
    }
  },
  created() {
    this.crud.msg.del = '强退成功！'
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  methods: {
    doDelete(data) {
      this.$confirm(`确认强退选中的${data.length}个用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        data.forEach(val => {
          ids.push(val.id)
        })
        this.delMethod(ids)
      }).catch(() => {
      })
    },
    // 踢出用户
    delMethod(key, index) {
      let ids = []
      if (key instanceof Array) {
        ids = key
      } else ids.push(key)
      this.delLoading = true
      del(ids).then(() => {
        this.delLoading = false
        if (this.$refs[index]) {
          this.$refs[index].doClose()
        }
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
        if (this.$refs[index]) {
          this.$refs[index].doClose()
        }
      })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    }
  }
}
</script>
