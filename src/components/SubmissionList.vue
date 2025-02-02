<template>
  <div class="space-y-2 relative">
    <!-- 表头 -->
    <div class="flex font-bold bg-gray-100 p-2 rounded">
      <div class="w-4/12">企业名称</div>
      <div class="w-4/12">状态信息</div>
      <div class="w-3/12">工作地点</div>
      <div class="w-3/12">投递时间</div>
    </div>
    
    <!-- 数据行 -->
    <div 
      v-for="(submission, index) in submissions" 
      :key="index"
      class="group relative flex items-center p-2 border rounded hover:bg-gray-50 transition-colors"
    >
      <div class="w-4/12">{{ submission.company }}</div>
      <div class="w-4/12 relative">
        <div 
          class="cursor-pointer hover:bg-gray-100 transition-colors rounded p-1"
          @click.stop="openStatusMenu(index)"
        >
          <span v-html="displayStatus(submission)"></span>
          <div 
            v-if="activeIndex === index"
            class="status-menu-container absolute z-10 top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-4 min-w-[200px] transition-all duration-200 origin-top"
            :class="activeIndex === index ? 'scale-100' : 'scale-95 opacity-0'"
          >
            <!-- 状态选择菜单 -->
            <select 
              v-model="selectedStatus"
              class="w-full mb-3 p-2 border rounded"
              @change="handleStatusChange(submission)"
              @click.stop
            >
              <option value="待回复">待回复</option>
              <option value="待面试">待面试</option>
              <option value="待笔试">待笔试</option>
              <option value="已拒绝">已拒绝</option>
              <option value="已拿offer">已拿offer</option>
            </select>

            <!-- 面试/笔试附加信息 -->
            <div v-if="showInterviewForm" class="space-y-3">
              <select
                v-model="interviewType"
                class="w-full p-2 border rounded"
                required
                @click.stop
              >
                <option disabled value="">线上/线下</option>
                <option value="线上">线上</option>
                <option value="线下">线下</option>
                <option value="形式待定">形式待定</option>
              </select>
              <input
                v-model="interviewTime"
                type="datetime-local"
                class="w-full p-2 border rounded"
                required
                @click.stop
              >
              <button
                @click.stop="saveInterviewInfo"
                class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="w-3/12">{{ submission.location }}</div>
      <div class="w-3/12">{{ formatDate(submission.date) }}</div>

      <!-- 扩大悬停区域（透明容器），使得按钮的悬停范围往右延伸 -->
      <div class="absolute inset-y-0 -right-12 w-12" aria-hidden="true"></div>

      <!-- 删除按钮 -->
      <button
        @click="store.removeSubmission(index)"
        class="absolute -right-8 top-1/2 -translate-y-1/2 bg-red-100 text-red-600 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
        title="删除"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { useSubmissionStore } from '../stores/submissionStore'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const store = useSubmissionStore()
const { submissions } = storeToRefs(store)

const activeIndex = ref(-1)
const selectedStatus = ref('')
const interviewType = ref('')
const interviewTime = ref('')

const showInterviewForm = computed(() => {
  return ['待面试', '待笔试'].includes(selectedStatus.value)
})

function formatDate(isoString) {
  const date = new Date(isoString)
  return `${date.getMonth()+1}月${date.getDate()}日`
}

function formatDateTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  // 处理Safari兼容性问题
  const validDate = isNaN(date) ? new Date(isoString.replace(' ', 'T')) : date
  return `${validDate.getMonth()+1}月${validDate.getDate()}日 ${String(validDate.getHours()).padStart(2,'0')}:${String(validDate.getMinutes()).padStart(2,'0')}`
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})

function closeMenu(event) {
  // 检查点击目标是否在菜单容器内
  const menu = document.querySelector('.status-menu-container')
  if (!menu || !menu.contains(event.target)) {
    activeIndex.value = -1
  }
}

function openStatusMenu(index) {
  activeIndex.value = activeIndex.value === index ? -1 : index
  if (activeIndex.value !== -1) {
    selectedStatus.value = submissions.value[index].status
    interviewType.value = submissions.value[index].interviewType || ''
    interviewTime.value = submissions.value[index].appointmentDate || ''
  }
}

function displayStatus(submission) {
  let status = submission.status
  if (['待面试', '待笔试'].includes(submission.status)) {
    // 只有存在面试形式才显示
    if (submission.interviewType) {
      status += `-${submission.interviewType}`
    }
    // 只有存在预约时间时才显示，蓝色字体显示
    if (submission.appointmentDate) {
      status += `<span class="text-blue-500">（${formatDateTime(submission.appointmentDate)}）</span>`
    }
  }
  return status
}

function handleStatusChange(submission) {
  if (!['待面试', '待笔试'].includes(selectedStatus.value)) {
    // 清空相关字段
    interviewType.value = ''
    interviewTime.value = ''
    submission.interviewType = ''
    submission.appointmentDate = ''
  }
  // 即时保存非面试/笔试的状态变更
  if (!showInterviewForm.value) {
    saveChanges(submission)
  }
}

async function saveInterviewInfo() {
  const submission = submissions.value[activeIndex.value]
  saveChanges(submission)
}

function saveChanges(submission) {
  // 转换时间格式为ISO（允许为空）
  const isoTime = interviewTime.value ? new Date(interviewTime.value).toISOString() : ''
  
  store.$patch((state) => {
    state.submissions[activeIndex.value] = {
      ...submission,
      status: selectedStatus.value,
      interviewType: interviewType.value,
      appointmentDate: isoTime
    }
  })
  activeIndex.value = -1 // 确保关闭菜单
}
</script>