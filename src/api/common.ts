import request from '@/utils/request'
import type { ResponseData } from '@/utils/request'

enum Api {
  GetCityList = '/common/getCitys',
}

// 获取城市数据
export const getCityList = async (): Promise<ResponseData<any>> => {
  return request({ url: Api.GetCityList })
}
