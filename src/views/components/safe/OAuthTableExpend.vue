
<template>
  <card style="width:570px">
    <p slot="title">
      <Icon type="ios-albums-outline" />
      详情
    </p>
    <List size="small" :split=false>
      <ListItem>
        资源ID:&nbsp
        <tag color="geekblue">
          {{ row.resourceIds? row.resourceIds : '未知' }}
        </tag>
      </ListItem>
      <ListItem label="">
        认证方式:&nbsp
        <tag color="geekblue">
          {{ row.authorizedGrantTypes? row.authorizedGrantTypes:'未知' }}
        </tag>
      </ListItem>
      <ListItem>
        重定向:&nbsp
        <tag color="geekblue">
          {{ row.webServerRedirectUri? row.webServerRedirectUri: '未知' }}
        </tag>
      </ListItem>
      <ListItem>
        权限值:&nbsp
        <tag color="geekblue">{{ row.authorities? row.authorities : '未知' }}</tag>
      </ListItem>
      <ListItem>
        权限范围:&nbsp
        <tag color="geekblue">{{ row.scope? row.scope : '未知' }}</tag>
      </ListItem>
      <ListItem>
        Token有效期/秒:&nbsp
        <tag color="geekblue">{{ row.accessTokenValidity? row.accessTokenValidity : '未知' }}</tag>
      </ListItem>
      <ListItem>
        RefreshToken有效期/秒:&nbsp
        <tag color="geekblue">{{ row.refreshTokenValidity? row.refreshTokenValidity : '未知' }}</tag>
      </ListItem>
      <ListItem>
        预选属性/必须为JSON:&nbsp
        <tag color="geekblue">{{ row.additionalInformation? row.additionalInformation : '未知' }}</tag>
      </ListItem>
      <ListItem>
        自动批准:&nbsp
        <tag color="geekblue">{{ row.autoApprove? row.autoApprove : '未知' }}</tag>
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
