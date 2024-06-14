import { useUserStore } from '@/stores'

const baseURL = 'http://127.0.0.1:7001/api'

// 添加拦截器
const requestInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 非http或https开头需拼接地址
    if (!options.url.startsWith('http') || !options.url.startsWith('https')) {
      options.url = `${baseURL}${options.url}`
    }
    // 请求超时
    options.timeout = 30000
    // 添加token
    const token = uni.getStorageSync('token')
    if (token) {
      if (options.header) {
        options.header.Authorization = token
      } else {
        options.header = { Authorization: token }
      }
    }
  },
}

uni.addInterceptor('request', requestInterceptor)
uni.addInterceptor('uploadFile', requestInterceptor)

export interface ResponseData<T> {
  code: number
  data: T
  msg: string
}

const request = <T>(options: UniApp.RequestOptions) => {
  return new Promise<ResponseData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const { code } = res.data as ResponseData<T>
          if (code >= 200 && code < 300) {
            resolve(res.data as ResponseData<T>)
          } else if (code === 401) {
            const userStore = useUserStore()
            userStore.clearUserInfo()
            uni.clearStorageSync()
            uni.navigateTo({ url: '/pages/login/index' })
            reject(res)
          } else {
            uni.showToast({
              icon: 'none',
              title: (res.data as ResponseData<T>).msg || '请求错误',
            })
            reject(res)
          }
        } else {
          uni.showToast({
            icon: 'none',
            title: '请求错误',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '请求错误',
        })
        reject(err)
      },
    })
  })
}

export default request
