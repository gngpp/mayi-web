import request from '@/utils/request'

export function findByPage(data) {
  return request({
    url: '/oauth2/security/clients/page',
    method: 'post',
    data
  })
}

export function saveClient(data) {
  return request({
    url: '/oauth2/security/clients/save',
    method: 'post',
    data
  })
}

export function updateClient(data) {
  return request({
    url: '/oauth2/security/clients/update',
    method: 'put',
    data
  })
}

export function deleteClient(clientId) {
  return request({
    url: '/oauth2/security/clients//delete/client_id/' + clientId,
    method: 'delete'
  })
}

export function deleteBatchClient(data) {
  return request({
    url: '/oauth2/security/clients/del/batch',
    method: 'delete',
    data
  })
}

export function loadTokenSignatureAlgorithm() {
  return request({
    url: '/oauth2/security/clients/alg',
    method: 'get',
  })
}

export function loadAuthorizationGrantTypes() {
  return request({
    url: '/oauth2/security/clients/grants',
    method: 'get',
  })
}

export function loadClientAuthenticationMethods() {
  return request({
    url: '/oauth2/security/clients/authentication_methods',
    method: 'get',
  })
}

export function selectPermissionPage(data) {
  return request({
    url: '/api/security/permissions/page',
    method: 'post',
    data
  })
}

export function savePermission(data) {
  return request({
    url: '/api/security/permissions/add',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/api/security/permissions/edit',
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
    url: '/api/security/permissions/del?id=' + id,
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
    url: '/api/security/permissions/del/batch',
    method: 'delete',
    data
  })
}

export function selectResourceLinkBindingList() {
  return request({
    url: '/api/security/permissions/binding/resource/list',
    method: 'post'
  })
}

export function selectRoleBindingList() {
  return request({
    url: '/api/security/permissions/binding/role/list',
    method: 'post'
  })
}

export function bindingResource(id, data) {
  return request({
    url: '/api/security/permissions/binding/resource?' +'id=' + id,
    method: 'post',
    data
  })
}

export function bindingRole(id, data) {
  return request({
    url: '/api/security/permissions/binding/role?' +'id=' + id,
    method: 'post',
    data
  })
}

export function unbindingResource(id, data) {
  return request({
    url: '/api/security/permissions/unbinding/resource?' +'id=' + id,
    method: 'put',
    data
  })
}

export function unbindingRole(id, data) {
  return request({
    url: '/api/security/permissions/unbinding/role?' +'id=' + id,
    method: 'put',
    data
  })
}
