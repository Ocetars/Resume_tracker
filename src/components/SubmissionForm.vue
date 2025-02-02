<template>
  <div class="mb-4 flex items-center space-x-2">
    <button 
      @click="showForm = !showForm" 
      class="bg-gray-200 text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
    >
      {{ showForm ? '✖️' : '➕' }}
    </button>
    <form v-if="showForm" @submit.prevent="addSubmission" class="flex space-x-2">
      <input v-model="newSubmission.company" placeholder="企业名称" required class="border p-2 rounded">
      <input v-model="newSubmission.location" placeholder="地点" required class="border p-2 rounded">
      <select v-model="newSubmission.status" class="border p-2 rounded">
        <option value="待回复">待回复</option>
        <option value="已回复">已回复</option>
        <option value="已面试">已面试</option>
        <option value="已录用">已录用</option>
        <option value="已拒绝">已拒绝</option>
      </select>
      <input v-model="newSubmission.date" type="date" required class="border p-2 rounded">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">提交</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useSubmissionStore } from '../stores/submissionStore'

const store = useSubmissionStore()
const showForm = ref(false)

function getInitialSubmission() {
  return {
    company: '',
    location: '',
    status: '待回复',
    date: new Date().toISOString().split('T')[0]
  }
}

const newSubmission = reactive(getInitialSubmission())

function addSubmission() {
  store.addSubmission({ ...newSubmission })
  showForm.value = false
  Object.assign(newSubmission, getInitialSubmission())
}
</script>