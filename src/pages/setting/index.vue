<template>
  <view class="container">
    <uni-forms :model="formData" :rules="rules" ref="formRef">
      <uni-forms-item name="avatar">
        <uni-file-picker
          v-model="formData.avatar"
          :auto-upload="false"
          file-mediatype="image"
          file-extname="png,jpg"
          :limit="1"
          return-type="object"
          :image-styles="{
            border: {
              color: '#ccc',
            },
          }"
          @select="onSelect"
          @delete="onDelete"
        ></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="phone">
        <uni-easyinput
          type="tel"
          v-model="formData.phone"
          trim
          :maxlength="30"
          placeholder="手机号"
        />
      </uni-forms-item>
    </uni-forms>
    <button class="myBtn btn" @click="onSubmit">修改</button>
    <!-- <form @submit="onSubmit" class="form">
      <uni-file-picker
        file-mediatype="image"
        file-extname="png,jpg"
        :limit="1"
        :image-styles="{
          border: {
            color: '#ccc',
          },
        }"
      ></uni-file-picker>
      <input
        class="input"
        name="phone"
        type="tel"
        confirm-type="done"
        maxlength="20"
        placeholder="手机号"
      />
      <button form-type="submit" class="myBtn btn">修改</button>
    </form> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { updateUserInfo } from '@/api/user'

const userStore = useUserStore()
const formRef = ref(null)
const formData = ref({
  avatar: userStore.userInfo?.avatar ? { url: userStore.userInfo.avatar } : null,
  phone: userStore.userInfo?.phone,
})
const avatarData = ref(userStore.userInfo?.avatar ? { url: userStore.userInfo.avatar } : null)
const rules = ref({
  phone: {
    rules: [
      {
        validateFunction: (_, value, data, callback) => {
          const telReg = /^(?:\+86|0)?(?:[1-9]\d{2,3}|\([2-9]\d{2,3}\))[-.\s]?\d{8}$/
          if (value && !telReg.test(value)) {
            callback('手机号格式不正确')
          }
          return true
        },
      },
    ],
  },
})

const onSelect = (e) => {
  console.log('选择文件：', e)
  avatarData.value = e.tempFiles[0]
}

const onDelete = () => {
  avatarData.value = null
}

const onSubmit = async () => {
  if (formRef.value) {
    const values = await formRef.value.validate()
    const params = {
      avatar: avatarData.value ? avatarData.value.url : '',
      phone: values.phone || '',
    }
    console.log('params:', params)
    const res = await updateUserInfo(params)
    if (res.code === 200) {
      uni.showToast({
        icon: 'success',
        title: '修改成功',
      })
      userStore.setUserInfo({
        ...userStore.userInfo,
        avatar: params.avatar,
        phone: params.phone,
      })
      setTimeout(() => {
        uni.navigateBack()
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

  // .form {
  //   width: 100%;
  //   padding-top: 50rpx;

  //   :deep(.uni-file-picker) {
  //     padding: 0 20rpx;
  //   }

  //   .input {
  //     box-sizing: border-box;
  //     width: 94%;
  //     height: 84rpx;
  //     border: 1px solid #aaa;
  //     border-radius: 8rpx;
  //     margin: 26rpx auto;
  //     padding: 8rpx 20rpx;
  //   }
  //   .btn {
  //     width: 94%;
  //     height: 84rpx;
  //     margin: 40rpx auto;
  //   }
  // }
}
</style>
