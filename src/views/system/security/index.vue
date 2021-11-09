<template>
  <div class="app-container">
    <Spin size="large" fix v-if="show" ></Spin>
    <!--    面板-->
    <el-tabs :tab-position="'left'" style="height: 100%;" >
      <el-tab-pane label="OAuth客户端管理">
        <span slot="label"><svg-icon icon-class="peoples" /> OAuth客户端管理</span>
        <OAuth2Client></OAuth2Client>
      </el-tab-pane>
      <el-tab-pane label="权限资源管理">
        <span slot="label">
          <svg-icon icon-class="tree" />接口资源管理
        </span>
        <resource></resource>
      </el-tab-pane>
      <el-tab-pane label="权限管理">
        <span slot="label">
        <svg-icon icon-class="permission" />
         权限分配管理
        </span>
        <permission></permission>
      </el-tab-pane>
      <el-tab-pane label="接口测试平台">
        <span slot="label">
          <svg-icon icon-class="web" />接口测试平台
        </span>
        <div class="app-container">
          <el-form :label-position="'left'">
            <el-form-item label="链接地址">
              <el-input
                clearable
                v-model="apiInput"
                prefix-icon="el-icon-search" ></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <div>
            <elFrame :src="apiInput" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="系统备份管理">  <span slot="label">
          <svg-icon icon-class="database" />系统备份管理
        </span>
      </el-tab-pane>
      <el-tab-pane label="其他">其他</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OAuth2Client from "../../components/safe/OAuth2Client";
import Resource from "../../components/safe/Resource";
import Permission from "../../components/safe/Permission";
import elFrame from '@/components/Iframe/index'
import Config from '@/settings'

export default {
  name: "Security",
  components: {Permission, Resource, OAuth2Client, elFrame},
  data() {
    return {
      show: true,
      apiInput: Config.testApi
    }

  },
  mounted: function () {

  },
  created() {
    setTimeout(() => {
      this.show = false
    }, 1000);
  },
  methods: {
    shipShow(value) {
      this.show = value
    },
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
