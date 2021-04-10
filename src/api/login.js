import request from '@/utils/request'
import {encrypt} from '@/utils/rsaEncrypt'

export function login(username, password,grant_type, code, uuid, client_id, client_secret) {
  let params = {
      username: username,
      password: password,
      grant_type: grant_type,
      code: code,
      uuid: uuid,
      client_id: client_id,
      client_secret: encrypt(client_secret)
  }
  return request({
    url: 'oauth/token',
    method: 'post',
    params: params
  })
}

export function getInfo() {
  return request({
    url: 'oauth/info',
    method: 'post'
  })
}

export function getCodeImg() {
  return request({
    url: 'oauth/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'oauth/logout',
    method: 'post'
  })
}
