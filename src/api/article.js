import request from '@/utils/request'

export function fetchList(query) {
  return request({
    mock: true,
    url: '/article/list',
    method: 'get',
    data: query
  })
}

export function fetchArticle(id) {
  return request({
    mock: true,
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    mock: true,
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    mock: true,
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    mock: true,
    url: '/article/update',
    method: 'post',
    data
  })
}
