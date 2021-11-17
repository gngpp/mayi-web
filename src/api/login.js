import request from '@/utils/request'
import {encrypt} from '@/utils/rsaEncrypt'
import {md5Encrypt} from "../utils/md5Encrypt";

export function login(username, password,grant_type, code, uuid, client_id, client_secret) {
  let params = {
      username: username,
      password: password,
      grant_type: grant_type,
      code: code,
      uuid: uuid,
      client_id: client_id,
      client_secret: md5Encrypt(client_secret)
  }
  return request({
    url: '/oauth2/token',
    method: 'post',
    params: params
  })
}

export function getInfo() {
  return request({
    url: '/api/users/info',
    method: 'post'
  })
}

export function getCodeImg() {
  return request({
    url: '/oauth2/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/oauth2/logout',
    method: 'post'
  })
}
