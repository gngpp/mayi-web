import request from '@/utils/request'

export function getDept(params) {
  return request({
    url: 'api/departments/page',
    method: 'post',
    data: params
  })
}

export function getDeptVertex(id) {
  return request({
    url: 'api/departments/vertex/' + id,
    method: 'post'
  })
}

export function add(data) {
  return request({
    url: 'api/departments/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/departments/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/departments/update',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts: getDept, getDeptVertex }
