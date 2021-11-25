<style scoped>
.expand-row{
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col>
        <span class="expand-key">权限值: </span>
        <el-tag
          :key="tag"
          v-for="tag in formatPermission(row.bindingPermissions)"
          :disable-transitions="false"dd
          effect="plain"
          size="medium"
        >
          {{tag}}
        </el-tag>
      </Col>
    </Row>
  </div>
</template>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
<script>
export default {
  name: "permision-expand",
  props: {
    row: Object
  },
  methods: {
    formatPermission(bindingPermissions) {
      try {
        let permissions = []
        bindingPermissions.forEach(value => {
          permissions.push(value.value)
        })
        return (permissions.length == 0 ? '无' :permissions)
      }catch (e) {
        return  ['无']
      }
    },
  }
};
</script>
