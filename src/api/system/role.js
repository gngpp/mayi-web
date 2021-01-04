import request from '@/utils/request'

// 获取所有的Role
export function getAll() {
  return request({
    url: 'api/roles/all',
    method: 'get'
  })
}

export function setRoleStatus(id, enabled) {
  return request({
    url: 'api/roles/status?id=' + id + '&enabled=' + enabled,
    method: 'patch'
  })
}

export function add(data) {
  return request({
    url: 'api/roles/save',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: 'api/roles/' + id,
    method: 'post'
  })
}

export function getLevel() {
  return request({
    url: 'api/roles/level',
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: 'api/roles/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/roles/update',
    method: 'put',
    data
  })
}

export default {add, edit, del, get, getLevel, setRoleStatus}
