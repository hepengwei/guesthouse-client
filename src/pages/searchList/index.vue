<template>
  <view class="container">
    <view class="searchBox">
      <input
        v-show="showInput"
        @confirm="getDataList(1, true)"
        :maxlength="20"
        v-model="searchValue"
        placeholder=""
        ref="inputRef"
      />
      <button v-show="showInput" class="cancelBtn" @click="handleCancel">取消</button>
      <button v-show="!showInput" class="searchBtn" @click="handleSearch">搜索民宿</button>
    </view>
    <scroll-view
      :scroll-y="true"
      :enable-flex="true"
      :show-scrollbar="false"
      class="scrollY"
      :lower-threshold="50"
      @scrolltolower="getDataList(page + 1)"
    >
      <template v-if="dataList?.length > 0">
        <view
          class="item"
          v-for="record in dataList"
          :key="record.id"
          @click="onClickItem(record.id)"
        >
          <image
            class="img"
            :src="record.imgs?.length > 0 ? record.imgs[0].url : ''"
            mode="aspectFill"
          />
          <view class="right">
            <text class="name">{{ record.name }}</text>
            <text class="price">￥{{ record.price }}</text>
          </view>
        </view>
        <MyLoadingMore :loading="loading" :hasMore="hasMore" />
      </template>
      <MyNoData v-else-if="!loading" />
    </scroll-view>
    <!-- <MyScrollPagingList
      style="width: 100%"
      height="calc(100% - 94rpx)"
      :page="page"
      :dataList="dataList"
      :pageSize="5"
      :total="total"
      :loading="loading"
      @equestnextpagedata="getDataList"
    >
      <template v-slot="{ record }">
        <view class="item" @click="onClickItem(record.id)">
          <image class="img" :src="record.image" mode="aspectFill" />
          <view class="right">
            <text class="name">{{ record.name }}</text>
            <text class="price">￥{{ record.price }}</text>
          </view>
        </view>
      </template>
    </MyScrollPagingList> -->
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchGuesthouse } from '@/api/guesthouse'

const pageSize = 5

const props = defineProps<{ cityCode: string; startDate: string; endDate: string }>()
const searchValue = ref<string>('')
const showInput = ref<boolean>(false)
const inputRef = ref(null)
const page = ref<number>(1)
const total = ref<number>(0)
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const dataList = ref<any[]>([])

const getDataList = async (newPage = 1, isSearch = false) => {
  if (loading.value) return
  if (!hasMore.value && !isSearch) return
  const { cityCode, startDate, endDate } = props
  loading.value = true
  const res = await searchGuesthouse({
    pageSize,
    pageNum: newPage,
    cityCode,
    startDate,
    endDate,
    name: searchValue.value,
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

const handleSearch = () => {
  showInput.value = true
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const handleCancel = () => {
  searchValue.value = ''
  showInput.value = false
  getDataList(1, true)
}

const onClickItem = (id: string) => {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}

onMounted(() => {
  getDataList()
})
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

  $cancelBtnHeight: 70rpx;
  $searchMargin: 12rpx;

  .searchBox {
    width: 96%;
    height: $cancelBtnHeight;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px auto;
    input {
      box-sizing: border-box;
      width: 100%;
      height: $cancelBtnHeight;
      min-height: $cancelBtnHeight;
      line-height: $cancelBtnHeight;
      border: 1px solid #ddd;
      border-radius: 8rpx;
      padding: 4rpx 8rpx;
    }
    .cancelBtn {
      width: 140rpx;
      height: $cancelBtnHeight;
      line-height: $cancelBtnHeight;
      font-size: 18px;
      font-weight: 500;
      border: none;
      padding-left: 4px;
      padding-right: 4px;
      background-color: transparent;
      &::after {
        display: none;
      }
    }

    .searchBtn {
      width: 100%;
      height: $cancelBtnHeight;
      min-height: $cancelBtnHeight;
      line-height: $cancelBtnHeight;
      color: $uni-text-color-placeholder;
      font-size: 16px;
      font-weight: 500;
    }
  }
  // .searchBtn {
  //   width: 96%;
  //   height: $searchBtnHeight;
  //   min-height: 70rpx;
  //   line-height: 70rpx;
  //   background-color: #fff;
  //   color: $uni-text-color-placeholder;
  //   font-size: 16px;
  //   font-weight: 500;
  //   margin: $searchMargin 0;
  // }

  .scrollY {
    width: 100%;
    height: calc(100% - 94rpx);

    .item {
      width: 96%;
      height: 200rpx;
      background-color: #fff;
      border-radius: 8rpx;
      padding: 16rpx !important;
      margin: 0 auto 20rpx;
      display: flex;
      flex: 1;

      .img {
        width: 260rpx;
        height: 100%;
        border-radius: 8rpx;
      }
      .right {
        display: flex;
        flex: 1;
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
