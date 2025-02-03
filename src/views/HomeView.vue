<script setup>
import { ref } from 'vue'
import SubmissionForm from '@/components/SubmissionForm.vue'
import SubmissionList from '@/components/SubmissionList.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import { useSubmissionStore } from '../stores/submissionStore'

const store = useSubmissionStore()
const showForm = ref(false)
const filteredSubmissions = ref(store.submissions)
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 未展开新增表单时 -->
    <div v-if="!showForm">
      <div class="flex items-center mb-6 gap-4">
        <!-- 搜索框 -->
        <div class="mr-10">
          <SearchFilter :submissions="store.submissions" @update:filtered="filteredSubmissions = $event"/>
        </div>
        <!-- 投递按钮 -->
        <div class="flex items-center gap-3">
          <span class="text-2xl font-semibold text-gray-700 tracking-tight">新投递</span>
          <button @click="showForm = true"
            class="bg-blue-100 text-white w-10 h-10 flex items-center justify-center hover:bg-blue-200 transition-colors rounded-full">
            ➕
          </button>
        </div>
      </div>
    </div>
    <!-- 表单展开时 -->
    <div v-else>
      <SubmissionForm @close-form="showForm = false" @submitted="showForm = false" />
    </div>
    <!-- 始终显示投递记录列表 -->
    <SubmissionList :submissions="filteredSubmissions" />
  </div>
</template>
