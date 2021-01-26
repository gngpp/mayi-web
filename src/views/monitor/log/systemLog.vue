<template>
  <div class="app-container">
    <el-row :gutter="20">
      <div>
        <el-tabs>
          <el-tab-pane label="常规日志">
             <span slot="label">
               <i>
                 <svg-icon icon-class="log"/>
               </i>
               常规日志
             </span>
            <log></log>
          </el-tab-pane>
          <el-tab-pane label="错误日志">
            <span slot="label">
               <i class="el-icon-error"></i>
              错误日志
            </span>
            <error-log></error-log>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-row>
  </div>
</template>

<script>

import ErrorLog from "@/views/monitor/log/errorLog";
import Log from "@/views/monitor/log/index";

export default {
  name: "SystemLog",
  components: {Log, ErrorLog},
  data() {
    return {
      tabPosition: 'left'
    };
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  margin-bottom: 5px;
}
</style>
