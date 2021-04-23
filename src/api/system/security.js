import request from '@/utils/request'

export function clientPage(page, size) {
  return request({
    url: '/oauth/security/client/page?page=' + page + "&size=" + size,
    method: 'post'
  })
}

export function deleteClient(clientId) {
  return request({
    url: '/oauth/security/client?clientId=' + clientId,
    method: 'delete'
  })
}

