<template>
  <div class="relative flex-1">
    <!-- 搜索输入框 -->
    <input
      v-model="searchKeyword"
      type="text"
      placeholder="搜索公司/地点/状态..."
      class="w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >

    <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 接收外部传入所有投递记录
const props = defineProps({
  submissions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:filtered'])

const searchKeyword = ref('')

// 根据输入内容过滤投递记录（匹配企业名称、工作地点、当前状态，不区分大小写）
const filteredSubmissions = computed(() => {
  if (!searchKeyword.value) return props.submissions
  const keyword = searchKeyword.value.toLowerCase()
  return props.submissions.filter(sub => {
    return sub.company.toLowerCase().includes(keyword) ||
           sub.location.toLowerCase().includes(keyword) ||
           sub.status.toLowerCase().includes(keyword)
  })
})

// 每当过滤结果更新时，通过事件传给父组件
watch(filteredSubmissions, (newVal) => {
  emit('update:filtered', newVal)
}, { immediate: true })
</script> 