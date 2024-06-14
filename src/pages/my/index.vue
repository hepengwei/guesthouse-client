<template>
  <view class="container">
    <view class="userInfoBox">
      <image
        :src="
          userStore?.userInfo?.userName && userStore.userInfo?.avatar
            ? userStore.userInfo.avatar
            : '/static/images/flower.jpg'
        "
        mode="aspectFill"
        class="img"
      />
      <view class="phone" v-if="userStore.userInfo?.userName">{{
        userStore.userInfo?.phone || '未设置'
      }}</view>
      <text class="userName">{{ userStore.userInfo?.userName || '未登录' }}</text>
      <uni-icons
        type="gear-filled"
        size="24"
        color="#fff"
        class="settingBtn"
        @click="onClickSetting"
      ></uni-icons>
    </view>
    <view class="list">
      <view class="item">
        <text>用户协议</text>
        <uni-icons type="right" size="22" color="#bbb"></uni-icons>
      </view>
      <view class="item">
        <text>常见问题</text>
        <uni-icons type="right" size="22" color="#bbb"></uni-icons>
      </view>
      <view class="item">
        <text>联系客服</text>
        <uni-icons type="right" size="22" color="#bbb"></uni-icons>
      </view>
    </view>
    <button v-if="!!userStore.userInfo" class="myBtn logoutBtn" @click="onLogout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
import { logout } from '@/api/user'

const userStore = useUserStore()

const onClickSetting = () => {
  if (!userStore.userInfo?.userName) {
    uni.navigateTo({ url: '/pages/login/index' })
  } else {
    uni.navigateTo({ url: '/pages/setting/index' })
  }
}

const onLogout = async () => {
  const res = await logout()
  if (res.code === 200) {
    userStore.clearUserInfo()
    uni.clearStorageSync()
    uni.reLaunch({ url: '/pages/login/index' })
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
  .userInfoBox {
    width: 100%;
    min-height: 200rpx;
    background-color: $uni-color-primary;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    position: relative;
    .img {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      margin: 20rpx auto 10rpx;
      border: 1px solid #ccc;
    }
    .phone {
      padding: 4rpx 16rpx;
      background-color: #ddd;
      color: #999;
      font-size: 12px;
      margin: 10rpx auto;
      border-radius: 8rpx;
    }
    .userName {
      color: #fff;
      font-size: 14px;
      margin: 10rpx auto 20rpx;
    }
    .settingBtn {
      position: absolute;
      top: 20rpx;
      right: 30rpx;
    }
  }

  .list {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 40rpx;
    .item {
      display: flex;
      justify-content: space-between;
      padding: 18rpx 20rpx;
      background-color: #fff;

      &:not(:last-child) {
        border-bottom: 1px solid #ddd;
      }
    }
  }

  .logoutBtn {
    width: 96%;
    margin: 50rpx auto 0;
  }
}
</style>
