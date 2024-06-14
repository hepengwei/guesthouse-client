import request from '@/utils/request'
import type { ResponseData } from '@/utils/request'

enum Api {
  GetCityList = '/guesthouse/getHot',
  SearchGuesthouse = '/guesthouse/search',
  GetDetail = '/guesthouse/detail',
}

// 获取热门民宿
export const getHot = async (): Promise<ResponseData<any>> => {
  return request({ url: Api.GetCityList })
}

interface SearchGuesthouseParams {
  pageSize: number
  pageNum: number
  startDate: string
  endDate: string
  cityCode?: string
  name?: string
}

// 搜索民宿
export const searchGuesthouse = async (
  params: SearchGuesthouseParams,
): Promise<ResponseData<any>> => {
  return request({ url: Api.SearchGuesthouse, data: params, method: 'POST' })
}

// 获取民宿详情
export const getDetail = async (id: number): Promise<ResponseData<any>> => {
  return request({ url: `${Api.GetDetail}/${id}` })
}
