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
      <uni-forms-item name="confirmPassword">
        <uni-easyinput
          type="password"
          v-model="formData.confirmPassword"
          trim
          :maxlength="30"
          placeholder="确认密码"
        />
      </uni-forms-item>
    </uni-forms>
    <button class="myBtn btn" form-type="submit" @click="onSubmit">注册</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { regist } from '@/api/user'

const formRef = ref(null)
const formData = ref({ userName: '', password: '', confirmPassword: '' })
const rules = ref({
  userName: {
    rules: [
      { required: true, errorMessage: '请填写用户名' },
      {
        validateFunction: (_, value, data, callback) => {
          if (value.length < 2 || value.length > 20) {
            callback('用户名长度不得小于2或大于20')
          }
          return true
        },
      },
    ],
  },
  password: {
    rules: [
      { required: true, errorMessage: '请填写密码' },
      {
        validateFunction: (_, value, data, callback) => {
          if (value.length < 6 || value.length > 30) {
            callback('密码长度不得小于6或大于30')
          }
          return true
        },
      },
    ],
  },
  confirmPassword: {
    rules: [
      { required: true, errorMessage: '请填写确认密码' },
      {
        validateFunction: (_, value, data, callback) => {
          if (data.password && value !== data.password) {
            callback('两次输入的密码不一致')
          }
          return true
        },
      },
    ],
  },
})

const onSubmit = async () => {
  if (formRef.value) {
    const values = await formRef.value.validate()
    delete values.confirmPassword
    const res = await regist(values)
    if (res.code === 200) {
      uni.showToast({
        icon: 'success',
        title: '注册成功',
      })
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/login/index' })
      }, 500)
    }
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
    margin: 40rpx auto;
  }
}
</style>
