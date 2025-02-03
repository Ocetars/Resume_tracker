<template>
  <div class="space-y-0 relative">
    <!-- 表头 -->
    <div class="flex font-semibold bg-blue-50 text-blue-800 p-3 border-b border-blue-100">
      <div class="w-3/12 pl-2">企业名称</div>
      <div class="w-5/12 pl-2">进展状态</div>
      <div class="w-2/12">工作地点</div>
      <div class="w-2/12">投递时间</div>
    </div>
    
    <!-- 数据行 -->
    <div 
      v-for="(submission, index) in submissions" 
      :key="index"
      class="group relative flex items-center p-3 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 overflow-visible"
    >
      <div class="w-3/12 pl-2">{{ submission.company }}</div>
      <div class="w-5/12 relative">
        <div 
          class="cursor-pointer hover:bg-gray-100 transition-colors rounded p-1"
          @click.stop="openStatusMenu(submission)"
        >
          <div class="px-5 py-1 rounded-full text-sm inline-flex items-center gap-1 flex-wrap" 
                :class="{
                  'bg-blue-100 text-blue-800': submission.status === '待回复',
                  'bg-yellow-100 text-yellow-800': submission.status === '待面试',
                  'bg-purple-100 text-purple-800': submission.status === '待笔试',
                  'bg-green-100 text-green-800': submission.status === '已拿offer',
                  'bg-red-100 text-red-800': submission.status === '已拒绝'
                }">
            {{ displayStatus(submission) }}
            <template v-if="['待面试', '待笔试'].includes(submission.status)">
              <template v-if="submission.interviewType">
                <span class="opacity-75">-</span>
                <span>{{ submission.interviewType }}</span>
              </template>
              <template v-if="submission.appointmentDate">
                <span class="text-blue-600">
                  （{{ formatDateTime(submission.appointmentDate) }}）
                </span>
              </template>
            </template>
          </div>
          <div 
            v-if="activeSubmission === submission"
            class="status-menu-container fixed z-50 top-auto left-auto mt-2 bg-white border rounded-lg shadow-lg p-4 min-w-[200px] transition-all duration-200 origin-top"
            :class="activeSubmission === submission ? 'scale-100' : 'scale-95 opacity-0'"
          >
            <!-- 修改后：状态选择菜单，使用自定义下拉列表 -->
            <ul class="mb-3">
              <li 
                v-for="option in statusOptions" 
                :key="option" 
                class="cursor-pointer hover:bg-blue-50 p-2 rounded"
                :class="{'bg-blue-100': option === selectedStatus && (option === '待面试' || option === '待笔试')}"
                @click.stop="selectStatus(option, submission)"
              >
                {{ option }}
              </li>
            </ul>

            <!-- 面试/笔试附加信息 -->
            <div v-if="showInterviewForm" class="space-y-3 mt-3">
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
      <div class="w-2/12 text-gray-500 text-sm">{{ submission.location }}</div>
      <div class="w-2/12 text-gray-500 text-sm">{{ formatDate(submission.date) }}</div>

      <!-- 删除按钮 -->
      <button
        @click="deleteSubmission(submission)"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-red-500 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors duration-200 shadow-sm hover:shadow-md border border-red-100 opacity-0 group-hover:opacity-100"
        title="删除"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
// 导入 Vue 的响应式 API 及生命周期钩子
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
// 导入状态管理 store 和 pinia 辅助函数
import { useSubmissionStore } from '../stores/submissionStore'

// ============================
// 初始化状态管理及数据引用
// ============================
const props = defineProps({
  submissions: {
    type: Array,
    required: true
  }
})

const store = useSubmissionStore()
const activeSubmission = ref(null)  // 当前激活的记录对象，null 表示无激活项

// ============================
// 定义局部响应式变量
// ============================
const selectedStatus = ref('')              // 当前选中的状态
const interviewType = ref('')               // 面试/笔试类型（例如：线上或线下）
const interviewTime = ref('')               // 面试/笔试时间

// 新增：状态选项列表
const statusOptions = ['待回复', '待面试', '待笔试', '已拒绝', '已拿offer']

// ============================
// 计算属性：控制是否显示附加信息表单（仅针对待面试与待笔试状态）
// ============================
const showInterviewForm = computed(() => {
  return ['待面试', '待笔试'].includes(selectedStatus.value)
})

// ============================
// 日期格式化辅助函数
// ============================
// 格式化日期为月日形式，例如 "3月15日"
function formatDate(isoString) {
  const date = new Date(isoString)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化日期和时间，例如 "3月15日 14:30"
function formatDateTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  // 处理兼容性问题
  const validDate = isNaN(date) ? new Date(isoString.replace(' ', 'T')) : date
  return `${validDate.getMonth() + 1}月${validDate.getDate()}日 ${String(validDate.getHours()).padStart(2, '0')}:${String(validDate.getMinutes()).padStart(2, '0')}`
}

// ============================
// 组件生命周期管理：添加和移除全局点击事件监听以关闭状态菜单
// ============================
onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})

// ============================
// 事件处理函数
// ============================
// 关闭状态菜单：当点击发生在菜单外部时关闭菜单
function closeMenu(event) {
  const menu = document.querySelector('.status-menu-container')
  if (!menu || !menu.contains(event.target)) {
    activeSubmission.value = null
  }
}

// 切换状态菜单的显示，并初始化当前选中数据
function openStatusMenu(submission) {
  if (activeSubmission.value === submission) {
    activeSubmission.value = null
  } else {
    activeSubmission.value = submission
    selectedStatus.value = submission.status
    interviewType.value = ''
    interviewTime.value = submission.appointmentDate || ''
    
    // 添加这段代码来处理菜单定位
    nextTick(() => {
      const menu = document.querySelector('.status-menu-container')
      const trigger = event.currentTarget
      if (menu && trigger) {
        const rect = trigger.getBoundingClientRect()
        menu.style.top = `${rect.bottom + window.scrollY}px`
        menu.style.left = `${rect.left}px`
      }
    })
  }
}

// 新增：点击状态选项的处理函数
function selectStatus(option, submission) {
  selectedStatus.value = option
  if (!['待面试', '待笔试'].includes(option)) {
    interviewType.value = ''
    interviewTime.value = ''
    submission.interviewType = ''
    submission.appointmentDate = ''
    saveChanges(submission)
  }
  // 如果选择了 "待面试" 或 "待笔试"，则下方的面试/笔试附加信息表单会自动显示
}

// 修改状态显示逻辑，将HTML标签改为使用模板
function displayStatus(submission) {
  return submission.status
}

// 保存面试/笔试附加信息，并更新当前记录
async function saveInterviewInfo() {
  if (!activeSubmission.value) return
  saveChanges(activeSubmission.value)
}

// 更新指定记录中的状态和附加信息，并关闭状态菜单
function saveChanges(submission) {
  const fullIndex = store.submissions.findIndex(item => item === submission)
  if (fullIndex === -1) return
  const isoTime = interviewTime.value ? new Date(interviewTime.value).toISOString() : ''
  store.$patch((state) => {
    state.submissions[fullIndex] = {
      ...submission,
      status: selectedStatus.value,
      interviewType: interviewType.value,
      appointmentDate: isoTime
    }
  })
  activeSubmission.value = null
}

// 新增：删除记录时根据传入记录查找实际索引再删除
function deleteSubmission(submission) {
  const fullIndex = store.submissions.findIndex(item => item === submission)
  if (fullIndex !== -1) {
    store.removeSubmission(fullIndex)
  }
}
</script>