import request from '@/utils/request'

export function del(keys) {
  return request({
    url: 'api/online/delete',
    method: 'delete',
    data: keys
  })
}

export function select() {
  return request({
    url: 'api/online',
    method: 'post'
  })
}
