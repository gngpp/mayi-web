import request from '@/utils/request'

export function getMenusTree(pid) {
  return request({
    url: 'api/menu/lazy?pid=' + pid,
    method: 'get'
  })
}

export function getMenus(params) {
  return request({
    url: 'api/menus/page',
    method: 'post',
    data: params
  })
}

export function getMenuVertex(id) {
  return request({
    url: 'api/menus/vertex/' + id,
    method: 'post'
  })
}

export function buildMenus() {
  return request({
    url: 'api/menus/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/menus/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/menus/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/menus/update',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree, getMenuVertex, getMenus }
