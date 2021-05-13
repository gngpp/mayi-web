<template>
  <div class="app-container">
    <!--    面板-->
    <el-tabs type="border-card" >
      <el-tab-pane label="客户端管理">
        <span slot="label"><svg-icon icon-class="peoples" /> 客户端管理</span>
        <el-container class="head-container">
          <el-main>
            <OAuth2Client></OAuth2Client>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="权限资源管理">
        <span slot="label">
        <svg-icon icon-class="permission" />
          权限资源管理
        </span>
        <el-container class="head-container">
          <el-main>
            <resource></resource>
          </el-main>
          <el-main>
            <permission></permission>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="权限字典">权限管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OAuth2Client from "../../components/safe/OAuth2Client";
import Resource from "../../components/safe/Resource";
import Permission from "../../components/safe/Permission";

export default {
  name: "Security",
  components: {Permission, Resource, OAuth2Client},
  data() {
    return {
    }

  },
  created() {

  },
  methods: {

  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  margin-bottom: 5px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

</style>
