import request from '@/utils/request'
import {encrypt} from '@/utils/rsaEncrypt'

export function add(data) {
  return request({
    url: 'api/users/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/users/delete',
    method: 'delete',
    data: ids
  })
}

export function getUserRoleIds(id) {
  return request({
    url: 'api/users/role/' + id,
    method: 'post'
  })
}

export function getUserJobIds(id) {
  return request({
    url: 'api/users/position/' + id,
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'api/users/update',
    method: 'put',
    data
  })
}

export function editUser(data) {
  return request({
    url: 'api/users/update/info',
    method: 'patch',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'api/users/update/password/',
    method: 'patch',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'api/users/update/email/' + form.code,
    method: 'patch',
    data
  })
}

export default { add, edit, del, getUserJobIds, getUserRoleIds }

