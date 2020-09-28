import request from '@/utils/request'

export function login(data) {
  return request({
    mock: true,
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    mock: true,
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    mock: true,
    url: '/user/logout',
    method: 'post'
  })
}
