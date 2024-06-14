import request from '@/utils/request'
import type { ResponseData } from '@/utils/request'

enum Api {
  Login = '/user/login',
  Regist = '/user/regist',
  Logout = '/user/logout',
  UpdateUserInfo = '/user/updateUserInfo',
}

interface LoginParams {
  userName: string
  password: string
}

// 登陆
export const login = async (params: LoginParams): Promise<ResponseData<any>> => {
  return request({ url: Api.Login, data: params, method: 'POST' })
}

// 注册
export const regist = async (params: LoginParams): Promise<ResponseData<any>> => {
  return request({ url: Api.Regist, data: params, method: 'POST' })
}

// 退出登陆
export const logout = async (): Promise<ResponseData<any>> => {
  return request({ url: Api.Logout })
}

interface UpdateUserInfoParams {
  avatar?: string
  phone?: string
}

// 修改用户信息
export const updateUserInfo = async (params: UpdateUserInfoParams): Promise<ResponseData<any>> => {
  return request({ url: Api.UpdateUserInfo, data: params, method: 'POST' })
}
