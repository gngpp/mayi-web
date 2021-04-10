import request from '@/utils/request'

export function clientPage(page, size) {
  return request({
    url: '/security/client/page?page=' + page + "&size=" + size,
    method: 'post'
  })
}
