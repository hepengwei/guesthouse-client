import request from '@/utils/request'
import type { ResponseData } from '@/utils/request'

enum Api {
  HasOrder = '/orders/hasOrder',
  CreateOrder = '/orders/create',
  DeleteOrder = '/orders/delete',
  GetOrderList = '/orders/list',
  PayOrder = '/orders/payOrder',
}

// 检查是否被预定
export const hasOrder = async (guesthouseId: number): Promise<ResponseData<any>> => {
  return request({ url: Api.HasOrder, data: { guesthouseId }, method: 'POST' })
}

// 预定
export const createOrder = async (guesthouseId: number): Promise<ResponseData<any>> => {
  return request({ url: Api.CreateOrder, data: { guesthouseId }, method: 'POST' })
}

// 取消预定
export const deleteOrder = async (guesthouseId: number): Promise<ResponseData<any>> => {
  return request({ url: Api.DeleteOrder, data: { guesthouseId }, method: 'POST' })
}

interface GetOrderListParams {
  pageSize: number
  pageNum: number
  isPayed: 0 | 1
}

// 获取订单列表
export const getOrderList = async (params: GetOrderListParams): Promise<ResponseData<any>> => {
  return request({ url: Api.GetOrderList, data: params, method: 'POST' })
}

// 支付订单
export const payOrder = async (orderId: number): Promise<ResponseData<any>> => {
  return request({ url: Api.PayOrder, data: { orderId }, method: 'POST' })
}
