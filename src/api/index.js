import request from '@/utils/request'

export const uploadGetToken = data => request({ mock: true, url: '/upload/getToken', method: 'GET', data }) // 获取七牛文件上传token
