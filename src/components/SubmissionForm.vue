<template>
  <div class="my-4">
    <!-- 添加的标题和按钮容器 -->
    <div 
      v-if="!showForm"
      class="flex items-center justify-center space-x-2"
    >
      <span class="text-gray-600">新增投递</span>
      <button 
         @click="showForm = true"
         class="bg-gray-200 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer"
      >
        ➕
      </button>
    </div>

    <!-- 修改后的表单容器 -->
    <div v-else class="relative border rounded-lg p-4 bg-white shadow-lg">
      <!-- 关闭按钮 -->
      <button
        @click="closeForm"
        class="absolute -right-3 -top-3 bg-gray-200 text-gray-600 w-7 h-7 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
      >
        ✖️
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
            @change="handleStatusChange"
            class="w-full border p-2 rounded h-[42px]"
          >
            <option value="待回复">待回复</option>
            <option value="待面试">待面试</option>
            <option value="待笔试">待笔试</option>
            <option value="已拒绝">已拒绝</option>
            <option value="已拿offer">已拿offer</option>
          </select>
        </div>

        <!-- 预约时间 -->
        <div v-if="showAppointmentDate" class="flex-1 min-w-[180px]">
          <label class="text-sm text-gray-500 block mb-1 ml-2">面/笔试时间</label>
          <input
            v-model="newSubmission.appointmentDate"
            type="datetime-local"
            required
            class="w-full border p-2 rounded"
          >
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
            class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            提交
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useSubmissionStore } from '../stores/submissionStore'

const store = useSubmissionStore()
const showForm = ref(false)

const showAppointmentDate = computed(() => {
  return ['待面试', '待笔试'].includes(newSubmission.status)
})

function getInitialSubmission() {
  return {
    company: '',
    location: '',
    status: '待回复',
    date: new Date().toISOString().split('T')[0],
    appointmentDate: ''
  }
}

const newSubmission = reactive(getInitialSubmission())

function addSubmission() {
  store.addSubmission({ ...newSubmission })
  showForm.value = false
  Object.assign(newSubmission, getInitialSubmission())
}

function handleStatusChange() {
  if (!showAppointmentDate.value) {
    newSubmission.appointmentDate = ''
  }
}

function closeForm() {
  showForm.value = false
  Object.assign(newSubmission, getInitialSubmission())
}
</script>