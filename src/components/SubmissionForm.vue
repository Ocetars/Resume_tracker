<template>
  <!-- 只渲染表单容器 -->
  <div class="my-4 relative border border-blue-100 rounded-xl p-6 bg-white shadow-lg">
    <!-- 关闭按钮 -->
    <button
      @click="closeForm"
      class="absolute right-6 top-2 bg-gray-100 text-gray-500 w-8 h-6 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-200 cursor-pointer"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <form @submit.prevent="addSubmission" class="flex flex-wrap gap-3 items-end">
      <!-- 企业名称 -->
      <div class="flex-1 min-w-[240px]">
        <label class="text-sm text-gray-500 block mb-1 ml-2">企业名称</label>
        <input
          v-model="newSubmission.company"
          placeholder="XX公司"
          required
          class="w-full border p-2 rounded"
        >
      </div>

      <!-- 工作地点 -->
      <div class="flex-1 min-w-[120px]">
        <label class="text-sm text-gray-500 block mb-1 ml-2">工作地点</label>
        <input
          v-model="newSubmission.location"
          placeholder="城市"
          required
          class="w-full border p-2 rounded"
        >
      </div>

      <!-- 当前状态 -->
      <div class="flex-1 min-w-[100px]">
        <label class="text-sm text-gray-500 block mb-1 ml-2">当前状态</label>
        <select
          v-model="newSubmission.status"
          class="w-full border p-2 rounded h-[42px]"
        >
          <option value="待回复">待回复</option>
          <option value="待面试">待面试</option>
          <option value="待笔试">待笔试</option>
          <option value="已拒绝">已拒绝</option>
          <option value="已拿offer">已拿offer</option>
        </select>
      </div>

      <!-- 投递时间 -->
      <div class="flex-1 min-w-[150px]">
        <label class="text-sm text-gray-500 block mb-1 ml-2">初次投递日期</label>
        <input
          v-model="newSubmission.date"
          type="date"
          required
          class="w-full border p-2 rounded"
        >
      </div>

      <!-- 提交按钮 -->
      <div class="flex-1 min-w-[100px]">
        <button 
          type="submit" 
          class="w-full bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          提交
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useSubmissionStore } from '../stores/submissionStore'

const emit = defineEmits(['close-form', 'submitted'])

// 定义初始投递数据
function getInitialSubmission() {
  return {
    company: '',
    location: '',
    status: '待回复',
    date: new Date().toISOString().split('T')[0],
    appointmentDate: ''
  }
}

const store = useSubmissionStore()
const newSubmission = reactive(getInitialSubmission())

// 添加投递并重置表单，同时通知父组件关闭表单
function addSubmission() {
  store.addSubmission({ ...newSubmission })
  Object.assign(newSubmission, getInitialSubmission())
  emit('submitted')
}

// 关闭表单并重置数据，同时通知父组件关闭表单
function closeForm() {
  Object.assign(newSubmission, getInitialSubmission())
  emit('close-form')
}
</script>