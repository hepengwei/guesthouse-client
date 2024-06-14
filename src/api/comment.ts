import request from '@/utils/request'
import type { ResponseData } from '@/utils/request'

enum Api {
  CreateComment = '/comment/create',
}

interface CreateCommentParams {
  guesthouseId: number
  msg: string
}

// 创建评论
export const createComment = async (params: CreateCommentParams): Promise<ResponseData<any>> => {
  return request({ url: Api.CreateComment, data: params, method: 'POST' })
}
