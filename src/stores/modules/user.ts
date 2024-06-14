import { defineStore } from 'pinia'
import { ref } from 'vue'
import { persistOptions } from '../index'

export interface UserInfo {
  userId: number
  userName: string
  avatar?: string | null
  phone?: number | null
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const userInfo = ref<UserInfo | null>(null)

    // 保存用户信息，登录时使用
    const setUserInfo = (val: UserInfo) => {
      userInfo.value = val
    }

    // 清理用户信息，退出时使用
    const clearUserInfo = () => {
      userInfo.value = null
    }

    // 记得 return
    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
    }
  },
  {
    // 配置持久化
    persist: persistOptions,
  },
)
