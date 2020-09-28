import request from '@/utils/request'

export function getList(data) {
  return request({
    mock: true,
    url: '/table/list',
    method: 'get',
    data
  })
}
