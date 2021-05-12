import request from '@/utils/request'

export function selectClientPage(data) {
  return request({
    url: '/oauth/security/client/page',
    method: 'post',
    data
  })
}

export function deleteClient(clientId) {
  return request({
    url: '/oauth/security/client?clientId=' + clientId,
    method: 'delete'
  })
}

export function selectResourcePage(data) {
  return request({
    url: '/oauth/security/resource/page',
    method: 'post',
    data
  })
}

export function selectPermissionPage(data) {
  return request({
    url: '/oauth/security/permission/page',
    method: 'post',
    data
  })
}

export function savePermission(data) {
  return request({
    url: '/oauth/security/permission',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/oauth/security/permission',
    method: 'put',
    data
  })
}

export function deletePermission(id) {
  return request({
    url: 'oauth/security/permission?id=' + id,
    method: 'delete'
  })
}

