<template>
  <div class="space-y-2">
    <!-- 表头 -->
    <div class="flex font-bold bg-gray-100 p-2 rounded">
      <div class="w-3/12">企业名称</div>
      <div class="w-3/12">地点</div>
      <div class="w-3/12">当前状态</div>
      <div class="w-3/12">投递时间</div>
    </div>
    
    <!-- 数据行 -->
    <div 
      v-for="(submission, index) in submissions" 
      :key="index"
      class="flex items-center p-2 border rounded hover:bg-gray-50 transition-colors"
    >
      <div class="w-3/12">{{ submission.company }}</div>
      <div class="w-3/12">{{ submission.location }}</div>
      <div class="w-3/12">{{ submission.status }}</div>
      <div class="w-3/12 flex items-center justify-between">
        {{ submission.date }}
        <button
          @click="store.removeSubmission(index)"
          class="ml-4 bg-red-50 text-red-600 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
          title="删除"
        >
          x
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSubmissionStore } from '../stores/submissionStore'
import { storeToRefs } from 'pinia'

const store = useSubmissionStore()
const { submissions } = storeToRefs(store)
</script>