<template>
  <view class="container">
    <view class="tab">
      <view
        v-for="item in tabs"
        :key="item"
        :class="{ tabItem: true, actived: activedTab === item }"
        @click="onChangeTab(item)"
        >{{ item }}</view
      >
    </view>

    <scroll-view
      :scroll-y="true"
      :enable-flex="true"
      :show-scrollbar="false"
      class="scrollY"
      :lower-threshold="50"
      @scrolltolower="getDataList(page + 1)"
    >
      <view class="item" v-for="record in dataList" :key="record.id">
        <image class="img" :src="record.guesthouseInfo.imgs[0]?.url" mode="aspectFill" />
        <view class="middle">
          <text class="name">{{ record.guesthouseInfo.name }}</text>
          <text class="price">￥{{ record.guesthouseInfo.price }}</text>
        </view>
        <button
          v-if="!record.isPayed"
          class="myBtn"
          style="width: 80px"
          @click="onPayOrder(record.id)"
        >
          去支付
        </button>
      </view>
      <MyLoadingMore :loading="loading" :hasMore="hasMore" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'
import { getOrderList, payOrder } from '@/api/orders'

const tabs = ['未支付', '已支付']
const pageSize = 5

const userStore = useUserStore()
const activedTab = ref(tabs[0])
const page = ref<number>(1)
const total = ref<number>(0)
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const dataList = ref<any[]>([])

const onChangeTab = (tab: string) => {
  activedTab.value = tab
  dataList.value = []
  getDataList(1, true)
}

const getDataList = async (newPage = 1, isSearch = false) => {
  if (loading.value) return
  if (!hasMore.value && !isSearch) return
  loading.value = true
  const res = await getOrderList({
    pageSize,
    pageNum: newPage,
    isPayed: activedTab.value === '已支付' ? 1 : 0,
  })
  loading.value = false
  if (res.code === 200) {
    if (newPage === 1) {
      dataList.value = res.data.list
    } else {
      dataList.value.push(...(res.data.list || []))
    }
    page.value = newPage
    total.value = res.data.total
    if (newPage * pageSize >= total.value) {
      hasMore.value = false
    } else {
      hasMore.value = true
    }
  }
}

const onPayOrder = async (orderId: number) => {
  const res = await payOrder(orderId)
  if (res.code === 200) {
    uni.showToast({
      icon: 'success',
      title: '支付成功',
    })
    getDataList(1, true)
  }
}

const init = () => {
  if (!userStore.userInfo?.userName) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  getDataList(1, true)
}

onMounted(init)
onShow(init)
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;

  $tabHeight: 90rpx;
  .tab {
    width: 100%;
    height: $tabHeight;
    min-height: $tabHeight;
    display: flex;
    background-color: #eee;
    .tabItem {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
    }
    .actived {
      border-bottom: 2px solid $uni-color-primary;
      color: $uni-color-primary;
    }
  }

  // :deep(.uni-list) {
  //   width: 100%;
  //   background-color: transparent;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   padding: 16rpx 0;
  //   overflow: auto;

  //   uni-list-item {
  //     width: 96%;
  //     margin-bottom: 20rpx;
  //     .uni-list-item__container {
  //       padding: 0;
  //     }
  //   }
  // }

  .scrollY {
    width: 100%;
    height: calc(100% - 90rpx);

    .item {
      width: 96%;
      height: 200rpx;
      background-color: #fff;
      border-radius: 8rpx;
      padding: 16rpx !important;
      margin: 20rpx auto;

      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;

      .img {
        width: 260rpx;
        height: 100%;
      }
      .middle {
        display: flex;
        flex: 1;
        height: 100%;
        flex-direction: column;
        margin-left: 20rpx;
        .name {
          margin-top: 8rpx;
          font-size: 20px;
        }
        .price {
          margin-top: 30rpx;
          font-size: 16px;
          color: $uni-color-error;
        }
      }
    }
  }
}
</style>
