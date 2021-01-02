import request from '@/utils/request'

export function getDicts() {
  return request({
    url: 'api/dictionaries/all',
    method: 'get'
  })
}
export function getDict(data) {
  return request({
    url: 'api/dictionaries/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/dictionaries/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/dictionaries/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dictionaries/update',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDict }
