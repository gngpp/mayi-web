import request from '@/utils/request'

export function selectClientPage(data) {
  return request({
    url: '/oauth/security/client/page',
    method: 'post',
    data
  })
}

export function addClient(data) {
  return request({
    url: 'oauth/security/client/add',
    method: 'post',
    data
  })
}

export function editClient(data) {
  return request({
    url: 'oauth/security/client/edit',
    method: 'put',
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
    url: '/oauth/security/permission/add',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/oauth/security/permission/edit',
    method: 'put',
    data
  })
}

/**
 * 根据id删除
 *
 * @param id permission id
 * @returns {AxiosPromise}
 */
export function deletePermission(id) {
  return request({
    url: '/oauth/security/permission/del?id=' + id,
    method: 'delete'
  })
}

/**
 * 根据id数组删除
 *
 * @param data ids
 * @returns {AxiosPromise}
 */
export function deletePermissionByIds(data) {
  return request({
    url: '/oauth/security/permission/del/batch',
    method: 'delete',
    data
  })
}

