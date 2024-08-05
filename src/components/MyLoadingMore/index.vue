<template>
  <uni-load-more
    :status="props.loading ? 'loading' : !props.hasMore ? 'noMore' : 'more'"
    :content-text="{
      contentdown: '上拉显示更多',
      contentrefresh: '努力加载中...',
      contentnomore: props.page === 1 ? '没有更多数据了' : '--我是有底线的--',
    }"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    loading?: boolean
    hasMore?: boolean
    page?: number
  }>(),
  {
    loading: false,
    hasMore: false,
  },
)
</script>
