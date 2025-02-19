<script setup>
import { ref, computed } from 'vue'
import SubmissionForm from '@/components/SubmissionForm.vue'
import SubmissionList from '@/components/SubmissionList.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import { useSubmissionStore } from '../stores/submissionStore'

const store = useSubmissionStore()
const showForm = ref(false)
const filteredSubmissions = ref(store.submissions)

// 使用原始数据 store.submissions 计算各个状态的数量
const appliedCount = computed(() =>
  store.submissions.length
)
const interviewCount = computed(() =>
  store.submissions.filter(item => item.status === '待面试').length
)
const testCount = computed(() =>
  store.submissions.filter(item => item.status === '待笔试').length
)
const totalCount = computed(() =>
  interviewCount.value + testCount.value
)
const offerCount = computed(() =>
  store.submissions.filter(item => item.status === '已拿offer').length
)
</script>

<template>
  <div class="container mx-auto p-4 max-w-5xl">
    <!-- 控制区域或表单（二选一显示） -->
    <transition name="slide-fade" mode="out-in">
      <div v-if="!showForm" key="controls" class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <!-- 控制区域 -->
        <div class="flex flex-col md:flex-row items-center gap-4">
          <!-- 投递按钮 -->
          <button 
            @click="showForm = true"
            class="cursor-pointer w-full md:w-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="font-semibold">新增投递记录</span>
          </button>

          <!-- 修改后的岗位状态统计信息 -->
          <div class="flex-1 text-center flex justify-around">
            <div>
              <div class="text-gray-600 dark:text-gray-300 text-base font-medium">已投递</div>
              <div class="text-blue-600 dark:text-blue-400 text-xl font-semibold">{{ appliedCount }}</div>
            </div>
            <div>
              <div class="text-gray-600 dark:text-gray-300 text-base font-medium">待面/笔试</div>
              <div class="text-blue-600 dark:text-blue-400 text-xl font-semibold">{{ totalCount }}</div>
            </div>
            <div>
              <div class="text-gray-600 dark:text-gray-300 text-base font-medium">offer</div>
              <div class="text-blue-600 dark:text-blue-400 text-xl font-semibold">{{ offerCount }}</div>
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="w-full md:w-56">
            <SearchFilter :submissions="store.submissions" @update:filtered="filteredSubmissions = $event"/>
          </div>
        </div>
      </div>

      <!-- 表单展开时 -->
      <div v-else key="form">
        <SubmissionForm @close-form="showForm = false" @submitted="showForm = false" />
      </div>
    </transition>

    <!-- 投递记录列表 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <SubmissionList :submissions="filteredSubmissions" />
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
