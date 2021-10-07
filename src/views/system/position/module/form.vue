<template>
  <Modal
    width="360"
    v-model="crud.status.cu > 0"
    @on-cancel="crud.cancelCU"
    closable
    scrollable
  >
    <p slot="header" style="color:#3e95ee;text-align:center">
      <Icon type="md-add-circle" />
      <span>{{ crud.status.title }}</span>
    </p>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 200px;"
        />
      </el-form-item>
      <el-form-item
        label="排序"
        prop="jobSort"
      >
        <el-input-number
          v-model.number="form.jobSort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 200px;"
        />
      </el-form-item>
      <el-form-item
        v-if="form.pid !== 0"
        label="状态"
        prop="enabled"
      >
        <el-radio
          v-for="item in positionStatus"
          :key="item.id"
          v-model="form.enabled"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      align="center"
    >
      <el-button
        type="primary"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </Modal>
</template>

<script>
import {form} from '@crud/crud'

const defaultForm = {
  id: null,
  name: '',
  jobSort: 999,
  enabled: true
}
export default {
  mixins: [form(defaultForm)],
  props: {
    positionStatus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
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
