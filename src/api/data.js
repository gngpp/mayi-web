import request from '@/utils/request'
// import qs from 'qs'

export function initData(url, params) {
  return request({
    // url: url + '?' + qs.stringify(params, { indices: false }),
    url: url,
    data: params,
    type: 'application/json',
    method: 'post'
  })
}

export function download(url, params) {
  return request({
    // url: url + '?' + qs.stringify(params, { indices: false }),
    url: url,
    data: params,
    method: 'post',
    responseType: 'blob'
  })
}
