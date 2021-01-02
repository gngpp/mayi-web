import request from '@/utils/request'

export function getAllJob(data) {
  return request({
    url: 'api/jobs/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/jobs/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/jobs/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/jobs/update',
    method: 'put',
    data
  })
}

export default { add, edit, del, getAllJob: getAllJob }
