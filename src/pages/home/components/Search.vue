<template>
  <view class="container">
    <view class="formItem">
      <view class="label">可选城市</view>
      <view class="right">
        <picker
          style="width: 100%"
          mode="selector"
          @change="onCityChange"
          :range="cityArr"
          :value="selectedCityIndex"
        >
          {{ selectedCityIndex >= 0 ? cityArr[selectedCityIndex] : '' }}
        </picker>
      </view>
    </view>
    <view class="formItem">
      <view class="label">出租时间</view>
      <view class="right">
        <uni-datetime-picker v-model="dateRange" type="daterange" />
      </view>
    </view>
    <button class="myBtn" @click="handleSearch">搜索民宿</button>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCityList } from '@/api/common'
import dayjs from 'dayjs'

let cityList = []

const cityArr = ref([])
const selectedCityIndex = ref<number>(-1)
const today = dayjs().format('YYYY-MM-DD')
const dateRange = ref<string[]>([today, today])
const emit = defineEmits(['search'])

const requestCityList = async () => {
  const res = await getCityList()
  if (res.code === 200) {
    cityList = res.data
    selectedCityIndex.value = 0
    cityArr.value = res.data.map((item) => item.label)
  }
}

const onCityChange = (e) => {
  selectedCityIndex.value = e.detail.value
}

const handleSearch = () => {
  const selectedCityCode =
    selectedCityIndex.value >= 0 ? cityList[selectedCityIndex.value].value : ''
  emit('search', selectedCityCode, dateRange.value)
}

onMounted(() => {
  requestCityList()
})
</script>

<style scoped lang="scss">
.container {
  width: 710rpx;
  margin: 0 auto;
  background-color: #fff;
  .formItem {
    width: 100%;
    height: 74rpx;
    display: flex;
    align-items: center;
    .label {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 180rpx;
      height: 74rpx;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding-right: 8px;
      border-right: 1px solid #d3d3d3;
    }
    .right {
      display: flex;
      flex: 1;
      align-items: center;
      height: 74rpx;
      padding: 0 20rpx;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #d3d3d3;
    }
  }
}
</style>
