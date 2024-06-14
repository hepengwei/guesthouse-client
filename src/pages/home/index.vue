<template>
  <view class="container">
    <Header />
    <scroll-view :scroll-y="true" :show-scrollbar="false" class="scrollY">
      <Search @search="requestGuesthouseList" />
      <Hot :data="hotList" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
import Search from './components/Search.vue'
import Hot from './components/Hot.vue'

const hotList = ref<any[]>([])

const requestGuesthouseList = (cityCode: string, dateRange: string[]) => {
  uni.navigateTo({
    url: `/pages/searchList/index?cityCode=${cityCode}&startDate=${dateRange[0]}&endDate=${dateRange[1]}`,
  })
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
  .scrollY {
    height: calc(100% - 70rpx);
    background-color: #f5f5f5;
  }
}
</style>
