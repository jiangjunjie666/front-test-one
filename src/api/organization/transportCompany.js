import request from '@/utils/request'

export function reqGetFirmList(query) {
  return request({
    url: '/biz/transportCompany/list',
    method: 'get',
    params: query
  })
}

//获取企业编码
export function reqGetFirmCode() {
  return request({
    url: '/biz/transportCompany/nextCode',
    method: 'post'
  })
}

//查询初始化密码
export function reqGetInitPwd() {
  return request({
    url: '/system/config/configKey/sys.user.initPassword',
    method: 'get'
  })
}

//新增运输公司
export function reqAddFirm(data) {
  return request({
    url: '/biz/transportCompany',
    method: 'post',
    data
  })
}
