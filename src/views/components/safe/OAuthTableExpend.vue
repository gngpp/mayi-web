
<template>
  <card>
    <p slot="title">
      <Icon type="ios-albums-outline" />
      详情
    </p>
    <List size="small" :split=false>
      <ListItem>
        资源ID:&nbsp
        <tag>
          {{ row.resourceIds? row.resourceIds : '未知' }}
        </tag>
      </ListItem>
      <ListItem label="">
        认证方式:&nbsp
        <tag>
          {{ row.authorizedGrantTypes? row.authorizedGrantTypes:'未知' }}
        </tag>
      </ListItem>
      <ListItem>
        重定向:&nbsp
        <tag>
          {{ row.webServerRedirectUri? row.webServerRedirectUri: '未知' }}
        </tag>
      </ListItem>
      <ListItem>
        权限值:&nbsp
        <tag>{{ row.authorities? row.authorities : '未知' }}</tag>
      </ListItem>
      <ListItem>
        Token有效期/秒:&nbsp
        <tag>{{ row.accessTokenValidity? row.accessTokenValidity : '未知' }}</tag>
      </ListItem>
      <ListItem>
        RefreshToken有效期/秒:&nbsp
        <tag>{{ row.refreshTokenValidity? row.refreshTokenValidity : '未知' }}</tag>
      </ListItem>
      <ListItem>
        预选属性/必须为JSON:&nbsp
        <tag>{{ row.additionalInformation? row.additionalInformation : '未知' }}</tag>
      </ListItem>
      <ListItem>
        自动批准:&nbsp
        <tag>{{ row.autoApprove? row.autoApprove : '未知' }}</tag>
      </ListItem>
    </List>
  </card>
</template>
<script>
export default {
  props: {
    row: Object
  }
};
</script>
