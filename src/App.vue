<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/* 全局公共样式 */
view {
  box-sizing: border-box;
}

page {
  height: 100%;
}

.primaryColor {
  color: $uni-color-primary;
}

// 两行省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.myBtn {
  width: 100%;
  height: 80rpx;
  line-height: 70rpx;
  background-color: $uni-color-primary;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.myTextarea {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4rpx;
  margin-bottom: 20rpx;
  padding: 8rpx;
  height: 220rpx;
}
</style>
