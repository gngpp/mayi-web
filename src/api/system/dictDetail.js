import request from '@/utils/request'

export function get(dictName) {
  const params = {
    query: { dictName },
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/dictionaries/details/page',
    method: 'post',
    data: params
  })
}

export function getDictMap(data) {
  return request({
    url: 'api/dictionaries/details/map',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: 'api/dictionaries/details/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dictionaries/details/delete/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/dict/detail/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
