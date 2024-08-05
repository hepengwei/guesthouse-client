<template>
  <view class="container">
    <uni-forms :model="formData" :rules="rules" ref="formRef">
      <uni-forms-item name="userName">
        <uni-easyinput trim v-model="formData.userName" :maxlength="20" placeholder="用户名" />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput
          type="password"
          v-model="formData.password"
          trim
          :maxlength="30"
          placeholder="密码"
        />
      </uni-forms-item>
    </uni-forms>
    <button class="myBtn btn" @click="onSubmit">登录</button>
    <view class="registBtnBox">
      <button class="registBtn primaryColor" :plain="true" size="mini" @click="goRegist">
        去注册&gt;
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { login } from '@/api/user'

const { setUserInfo } = useUserStore()
const formRef = ref(null)
const formData = ref({ userName: '', password: '' })
const rules = ref({
  userName: {
    rules: [{ required: true, errorMessage: '请填写用户名' }],
  },
  password: {
    rules: [{ required: true, errorMessage: '请填写密码' }],
  },
})

const goRegist = () => {
  uni.redirectTo({ url: '/pages/regist/index' })
}

const onSubmit = async () => {
  if (formRef.value) {
    formRef.value
      .validate()
      .then(async (values) => {
        const res = await login(values)
        const { id, userName, avatar, phone, token } = res.data
        setUserInfo({
          userId: id,
          userName,
          avatar,
          phone,
        })
        uni.setStorageSync('token', token)
        uni.showToast({
          icon: 'success',
          title: '登录成功',
        })
        setTimeout(() => {
          uni.navigateBack({
            fail: () => {
              uni.switchTab({ url: '/pages/home/index' })
            },
          })
        }, 500)
      })
      .catch((err) => {})
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 750rpx;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;

  $inputHeight: 84rpx;
  :deep(.uni-forms) {
    width: 100%;
    padding-top: 50rpx;
    .uni-forms-item {
      box-sizing: border-box;
      width: 94%;
      height: $inputHeight;
      margin: 0 auto 48rpx;

      .uni-forms-item__label {
        width: 0 !important;
      }
      .uni-forms-item__content {
        width: 100%;
        height: 100%;
        uni-easyinput {
          width: 100%;

          .uni-easyinput__content {
            border: 1px solid #aaa;
            border-radius: 8rpx;
            input {
              box-sizing: border-box;
              height: $inputHeight !important;
            }
          }
        }
      }
    }
  }

  .btn {
    width: 94%;
    height: 84rpx;
    margin: 40rpx auto 20rpx;
  }

  .registBtnBox {
    width: 100%;
    position: relative;
    .registBtn {
      position: absolute;
      top: 0;
      right: 0;
      border: none;
      font-size: 14px;
    }
  }
}
</style>
