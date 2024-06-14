import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import fs from 'fs'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  // mode: 区分生产环境还是开发环境
  // console.log('command, mode -> ', command, mode)
  // dev 和 build 命令可以分别使用 .env.development 和 .env.production 的环境变量

  /**
   * 获取 Node.js 进程的当前工作目录的绝对路径
   */
  const appDirectory = fs.realpathSync(process.cwd())

  /**
   * 返回相对于当前工作目录的绝对路径
   * @param {String} relativePath  需要返回的目录
   * @returns
   */
  const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

  // const env = loadEnv(mode, path.resolve(process.cwd(), "env"));
  // const {
  //   VITE_APP_PORT,
  //   VITE_SERVER_BASEURL,
  //   VITE_DELETE_CONSOLE,
  //   VITE_SHOW_SOURCEMAP,
  //   VITE_APP_PROXY,
  //   VITE_APP_PROXY_PREFIX,
  // } = env;
  // console.log("环境变量 env -> ", env);

  return defineConfig({
    // envDir: "./env", // 自定义env目录
    plugins: [
      uni({
        vueOptions: {
          script: {
            defineModel: true, // 暂时有BUG，使用v-model会报错
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': resolveApp('src'),
      },
    },
    build: {
      sourcemap: process.env.NODE_ENV === 'development',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // 发布时删除console.log, 最后打包发版前再改为true
        },
      },
    },
  })
}
