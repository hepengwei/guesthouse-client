<template>
  <view class="container">
    <text class="title">最热民宿</text>
    <view class="list" v-if="dataList?.length > 0">
      <view class="listItem" v-for="item in dataList" :key="item.id" @click="onClickItem(item.id)">
        <image class="img" :src="item.imgs?.length > 0 ? item.imgs[0].url : ''" mode="aspectFill" />
        <text class="name">{{ item.name }}</text>
        <text class="des ellipsis">{{ item.des }}</text>
        <text class="price">￥{{ item.price }}</text>
      </view>
    </view>
    <MyNoData v-else-if="!loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHot } from '@/api/guesthouse'

const dataList = ref<any[]>([])
const loading = ref(false)

const requestHotGuesthouseList = async () => {
  loading.value = true
  const res = await getHot()
  loading.value = false
  if (res.code === 200) {
    dataList.value = res.data
  }
}

const onClickItem = (id: string) => {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}

onMounted(() => {
  requestHotGuesthouseList()
})
</script>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  margin-top: 20rpx;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #111;
  }
  .list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 12rpx;
    .listItem {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 49%;
      padding: 20rpx 26rpx;
      border-radius: 24rpx;
      margin-bottom: 18rpx;
      background-color: #fff;
      .img {
        width: 100%;
        height: 180rpx;
        border-radius: 10rpx;
      }
      .name {
        margin-top: 8rpx;
        font-size: 14px;
      }
      .des {
        margin-top: 20rpx;
        font-size: 13px;
        color: #999;
      }
      .price {
        margin-top: 20rpx;
        font-size: 13px;
        color: $uni-color-error;
      }
    }
  }
}
</style>
