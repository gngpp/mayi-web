<!--搜索与重置-->
<template>
  <span>
    <el-button class="filter-item" plain type="primary" size="mini" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
    <el-button v-if="crud.optShow.reset" plain class="filter-item" size="mini" type="success" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
  </span>
</template>
<script>
import { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  props: {
    itemClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
