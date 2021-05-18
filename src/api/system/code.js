import request from '@/utils/request'

export function resetEmail(data) {
  return request({
    url: 'api/users/email/reset?email=' + data,
    method: 'get'
  })
}

export function updatePass(pass) {
  return request({
    url: 'api/users/update/pass/' + pass,
    method: 'get'
  })
}
