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
        <tag color="blue">{{
            formatPermission(row.bindingPermissions)
          }}</tag>
      </Col>
    </Row>
  </div>
</template>
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
        return permissions.length == 0 ? '无' :permissions.toString()
      }catch (e) {
        return '无'
      }
    },
  }
};
</script>
