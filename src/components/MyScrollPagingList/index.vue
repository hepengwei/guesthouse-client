<template>
  <scroll-view
    :scroll-y="true"
    :enable-flex="true"
    :show-scrollbar="false"
    class="scrollY"
    :lower-threshold="props.lowerThreshold"
    @scrolltolower="onScrollToLower"
  >
    <slot></slot>
    <view v-if="loading" class="loadingBox">Loading</view>
    <view v-if="!loading && !hasMore" class="noMore">--我是有底线的--</view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, unref, toRefs, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    height: string
    page: number
    pageSize?: number
    total: number
    loading?: boolean
    lowerThreshold?: number // 滚动条距离底部多远时，触发requestnextpagedata事件，默认为50
  }>(),
  {
    height: '100%',
    page: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    lowerThreshold: 50,
  },
)
const emit = defineEmits(['equestnextpagedata'])
const loading = ref<boolean>(props.loading)
const hasMore = ref<boolean>(props.page * props.pageSize < props.total)

const onScrollToLower = () => {
  if (hasMore.value) {
    emit('equestnextpagedata')
  }
}

watch(
  () => [props.page, props.pageSize, props.total],
  () => {
    const { page, pageSize, total } = props

    if (page * pageSize >= total) {
      hasMore.value = false
    } else {
      hasMore.value = true
    }
  },
)

watch(
  () => props.loading,
  () => {
    loading.value = props.loading
  },
)
</script>

<style lang="scss">
.scrollY {
  display: flex;
  flex: 1;
  flex-direction: column;
  .loadingBox {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .noMore {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
}
</style>
