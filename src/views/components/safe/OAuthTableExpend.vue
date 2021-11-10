
<template>
  <card>
    <p slot="title">
      <Icon type="ios-albums-outline" />
      详情
    </p>
    <el-descriptions class="margin-top" direction="vertical" :column="2" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          资源ID
        </template>
        <el-tag size="small">
          {{ row.resourceIds? row.resourceIds : '无' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          认证方式
        </template>
        <el-tag size="small">
          {{ row.authorizedGrantTypes? row.authorizedGrantTypes:'无' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          重定向URL
        </template>
        <el-tag size="small">
          {{ row.webServerRedirectUri? row.webServerRedirectUri: '无' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          权限值
        </template>
        <el-tag size="small">
          {{ row.authorities? row.authorities : '无' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          权限范围
        </template>
        <el-tag size="small">
          {{ row.scope? row.scope : '无' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          Token有效期/秒
        </template>
        <el-tag size="small">
          {{ row.accessTokenValidity? row.accessTokenValidity : '无' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          RefreshToken有效期/秒
        </template>
        <el-tag size="small">
          {{ row.refreshTokenValidity? row.refreshTokenValidity : '无' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          预选属性/必须为JSON
        </template>
        <el-tag size="small">
          {{ row.additionalInformation? row.additionalInformation : '无' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          自动授权
        </template>
        <el-tag size="small">
          {{ row.autoApprove? row.autoApprove : '无' }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>


  </card>
</template>
<script>
export default {
  props: {
    row: Object
  }
};
</script>
