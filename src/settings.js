module.exports = {
  /**
   * @description 网站标题
   */
  title: 'Ant',
  /**
   * @description 是否显示 tagsView
   */
  tagsView: true,
  /**
   * @description 固定头部
   */
  fixedHeader: true,
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天s
   */
  passCookieExpires: 1,
  /**
   * @description 是否只保持一个子菜单的展开
   */
  uniqueOpened: true,
  /**
   * @description token key
   */
  TokenKey: 'ANT-ADMIN-TOKEN',
  /**
   * @description remember key
   */
  isRememberMeKey: 'REMEMBER-KEY',
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,
  /**
   * @description 是否显示logo
   */
  sidebarLogo: true,
  /**
   * 是否显示设置的底部信息
   */
  showFooter: true,
  /**
   * 签名模式
   */
  signatureModel: 'SECRET',
  /**
   * app key
   */
  appKey: 1234567,
  /**
   * secret key
   */
  secretKey: 'abcdefg',
  /**
   * 底部文字，支持html语法
   */
  footerTxt: '@ Ant',
  /**
   * 备案号
   */
  caseNumber: '2020'
}
