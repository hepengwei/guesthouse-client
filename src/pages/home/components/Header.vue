<template>
  <view class="header">
    <text class="left">民宿</text>
    <view v-if="!userStore?.userInfo?.userName" class="right">
      <text class="primaryColor btn" @click="onLogoin">登录</text>
      <text>|</text>
      <text class="primaryColor btn" @click="onRegist">注册</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
const userStore = useUserStore()

const onLogoin = () => {
  uni.navigateTo({ url: '/pages/login/index' })
}

const onRegist = () => {
  uni.navigateTo({ url: '/pages/regist/index' })
}
</script>

<style scoped lang="scss">
.header {
  width: 750rpx;
  height: 70rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;

  .left {
    color: #444;
    font-size: 16px;
    font-weight: 600;
    margin-left: 16rpx;
  }
  .right {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-right: 8rpx;
    .btn {
      margin: 0 12rpx;
    }
  }
}
</style>
