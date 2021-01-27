import request from '@/utils/request'

export function delLog(ids) {
  return request({
    url: 'api/logs/delete',
    method: 'delete',
    data: ids
  })
}

export function delAllError() {
  return request({
    url: 'api/logs/delete/error',
    method: 'delete'
  })
}

export function delAllInfo() {
  return request({
    url: 'api/logs/delete/info',
    method: 'delete'
  })
}
