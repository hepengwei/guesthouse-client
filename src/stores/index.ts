import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
const pinia = createPinia()
// 使用持久化存储插件
pinia.use(persist)

// 默认导出，给 main.ts 使用
export default pinia

// 公共的persist配置
export const persistOptions = {
  // 调整为兼容多端的API
  storage: {
    setItem(key, value) {
      uni.setStorageSync(key, value)
    },
    getItem(key) {
      return uni.getStorageSync(key)
    },
  },
}

// 模块统一导出
export * from './modules/user'
