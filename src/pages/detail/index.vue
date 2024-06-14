<template>
  <view class="container">
    <template v-if="!!detail">
      <swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000">
        <swiper-item v-for="(img, index) in detail?.imgs" :key="index">
          <image :src="img.url" mode="aspectFill" class="img" />
        </swiper-item>
      </swiper>
      <scroll-view :scroll-y="true" :show-scrollbar="false" class="scrollY">
        <view class="content">
          <text class="houseName">{{ detail?.name }}</text>
          <view class="fieldItem">
            <text class="label">简介:</text><text class="text">{{ detail?.des }}</text>
          </view>
          <view class="fieldItem">
            <text class="label">价格:</text><text class="text">{{ detail?.price }}</text>
          </view>
          <view class="fieldItem">
            <text class="label">发布时间:</text><text class="text">{{ detail?.createdAt }}</text>
          </view>
          <view class="fieldItem">
            <text class="label">开始出售:</text><text class="text">{{ detail?.startTime }}</text>
          </view>
          <view class="fieldItem">
            <text class="label">结束出售:</text><text class="text">{{ detail?.endTime }}</text>
          </view>
          <button
            class="myBtn"
            :disabled="houseHasPay || (houseHasOrder && !houseHasOrderBySelf)"
            @click="onReserve"
          >
            {{
              houseHasPay
                ? '已支付'
                : houseHasOrder
                  ? houseHasOrderBySelf
                    ? '取消预定'
                    : '已被预定'
                  : '预定'
            }}
          </button>
        </view>
        <text class="title">评论</text>
        <view class="list" v-if="detail?.comments?.length > 0">
          <view class="item" v-for="(comment, index) in detail?.comments" :key="index">
            <image class="img" :src="comment.userInfo.avatar" mode="aspectFill" />
            <view class="right">
              <view class="top">
                <text class="userName">{{ comment.userInfo.userName }}</text>
                <text class="time">{{ comment.createdAt }}</text>
              </view>
              <text class="text ellipsis">{{ comment.msg }}</text>
            </view>
          </view>
        </view>
        <MyNoData v-else />
      </scroll-view>
      <view class="openCommentBtn" @click="onClickComment">评论~</view>
      <uni-popup ref="popupRef" background-color="#fff">
        <view class="popupContainer">
          <textarea
            placeholder-style="color:#aaaaaa"
            placeholder="请输入"
            class="myTextarea"
            :maxlength="100"
            v-model="commentMsg"
          />
          <button class="myBtn" @click="onComment">评论</button>
        </view>
      </uni-popup>
    </template>
    <MyNoData v-else-if="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'
import { getDetail } from '@/api/guesthouse'
import { createComment } from '@/api/comment'
import { hasOrder, createOrder, deleteOrder } from '@/api/orders'

const userStore = useUserStore()
const props = defineProps<{ id: string }>()
const detail = ref<Record<string, any> | null>(null)
const loading = ref<boolean>(false)
const houseHasPay = ref<boolean>(false)
const houseHasOrder = ref<boolean>(true)
const houseHasOrderBySelf = ref<boolean>(false)
const popupRef = ref<any>(null)
const commentMsg = ref<string>('')

const requestGuesthouseDetail = async () => {
  const { id } = props
  loading.value = true
  const res = await getDetail(Number(id))
  loading.value = false
  if (res.code === 200) {
    detail.value = res.data
  }
}

const requestHasOrder = async () => {
  const { id } = props
  const res = await hasOrder(Number(id))
  if (res.code === 200) {
    houseHasPay.value = res.data.hasPay
    houseHasOrder.value = res.data.hasOrder
    houseHasOrderBySelf.value = res.data.hasOrderBySelf
  }
}

const onReserve = async () => {
  const { id } = props
  if (!houseHasOrder.value) {
    const res = await createOrder(Number(id))
    if (res.code === 200) {
      houseHasOrder.value = true
      houseHasOrderBySelf.value = true
      uni.showToast({
        icon: 'success',
        title: '预定成功',
      })
    }
  } else if (houseHasOrderBySelf.value) {
    const res = await deleteOrder(Number(id))
    if (res.code === 200) {
      houseHasOrder.value = false
      houseHasOrderBySelf.value = false
      uni.showToast({
        icon: 'success',
        title: '取消预定成功',
      })
    }
  }
}

const onClickComment = () => {
  popupRef.value?.open('bottom')
}

const onComment = async () => {
  if (!commentMsg.value || !commentMsg.value.trim()) {
    uni.showToast({
      icon: 'none',
      title: '请输入内容',
    })
    return
  }
  if (!detail.value?.id) {
    uni.showToast({
      icon: 'error',
      title: '缺少民宿ID',
    })
    return
  }
  const res = await createComment({ guesthouseId: detail.value.id, msg: commentMsg.value.trim() })
  if (res.code === 200) {
    requestGuesthouseDetail()
    popupRef.value?.close()
    commentMsg.value = ''
  }
}

const init = () => {
  if (!userStore.userInfo?.userName) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  requestGuesthouseDetail()
  requestHasOrder()
}

onMounted(init)
onShow(init)
</script>

<style scoped lang="scss">
.container {
  width: 750rpx;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .swiper {
    width: 100%;
    height: 380rpx;
    .img {
      width: 100%;
    }
  }

  .scrollY {
    width: 100%;
    height: calc(100% - 380rpx - 40rpx);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx;

    .content {
      display: flex;
      width: calc(100% - 32rpx);
      flex-direction: column;
      background-color: #fff;
      border-radius: 20rpx;
      padding: 24rpx;
      margin: 16rpx 0;

      .houseName {
        color: #444;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 8rpx;
      }

      .fieldItem {
        display: flex;
        font-size: 14px;
        margin: 8rpx 0;
        color: #666;
        .label {
          text-align: right;
        }
        .text {
          line-height: 18px;
          margin-left: 8rpx;
        }
      }
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-top: 16rpx;
    }

    .list {
      width: calc(100% - 32rpx);
      margin-top: 16rpx;
      .item {
        width: 100%;
        background-color: #fff;
        border-radius: 8rpx;
        padding: 16rpx !important;
        margin: 12rpx 0;
        display: flex;
        flex: 1;

        .img {
          width: 110rpx;
          height: 110rpx;
          border-radius: 50%;
        }
        .right {
          display: flex;
          flex: 1;
          flex-direction: column;
          margin-left: 30rpx;
          font-size: 16px;
          .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8rpx;
            .time {
              text-align: right;
            }
          }
          .text {
            margin-top: 13rpx;
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }

  .openCommentBtn {
    width: calc(100% - 32rpx);
    height: 70rpx;
    display: flex;
    align-items: center;
    background-color: #fff;
    border: 1px solid #aaa;
    color: #aaa;
    border-radius: 8rpx;
    margin: 0 auto;
    font-size: 13px;
    padding: 0 16rpx;
  }

  .popupContainer {
    padding: 24rpx;
    .textarea {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 4rpx;
      margin-bottom: 20rpx;
      padding: 8rpx;
    }
  }
}
</style>
