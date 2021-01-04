import request from '@/utils/request'

export function getAllPosition(data) {
  return request({
    url: 'api/positions/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/positions/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/positions/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/positions/update',
    method: 'put',
    data
  })
}

export default {add, edit, del, getAllJob: getAllPosition}
