<template>
  <uni-load-more
    :status="props.loading ? 'loading' : !props.hasMore ? 'noMore' : 'more'"
    :content-text="{
      contentdown: '上拉显示更多',
      contentrefresh: '努力加载中...',
      contentnomore: '--我是有底线的--',
    }"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    loading?: boolean
    hasMore?: boolean
  }>(),
  {
    loading: false,
    hasMore: false,
  },
)
</script>
