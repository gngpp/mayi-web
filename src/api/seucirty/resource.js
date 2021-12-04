import request from '@/utils/request'

export function selectResourcePage(data) {
  return request({
    url: '/api/security/resources/page',
    method: 'post',
    data
  })
}

export function setEnableStatus(id, enabled) {
  return request({
    url: '/api/security/resources/update/enabled/' + id + "?enabled=" + enabled,
    method: 'patch'
  })
}

export function setAllowStatus(id, allow) {
  return request({
    url: '/api/security/resources/update/allow/' + id + "?allow=" + allow,
    method: 'patch'
  })
}
