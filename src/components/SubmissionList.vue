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
    <TransitionGroup 
      name="list" 
      tag="div"
    >
      <div 
        v-for="(submission, index) in submissions" 
        :key="submission.company + submission.date"
        class="group relative flex items-center p-3 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 overflow-visible"
      >
        <div class="w-3/12 pl-2">{{ submission.company }}</div>
        <div class="w-5/12">
          <div 
            class="relative cursor-pointer hover:bg-gray-100 transition-colors rounded p-1"
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
              class="status-menu-container absolute z-50 bg-white border border-gray-100 rounded-xl shadow-xl flex mt-2 mb-2"
              :class="[
                'transition-all duration-200',
                activeSubmission === submission ? 'scale-100 opacity-100' : 'scale-95 opacity-0 translate-y-2',
                'origin-bottom'
              ]"
              style="left: 0;"
            >
              <!-- 状态选项列表 -->
              <ul class="p-2 space-y-0.5 min-w-[140px]">
                <li 
                  v-for="option in statusOptions" 
                  :key="option" 
                  class="cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
                  :class="{
                    'bg-blue-50 text-blue-800': option === selectedStatus && option === '待回复',
                    'bg-yellow-50 text-yellow-800': option === selectedStatus && option === '待面试',
                    'bg-purple-50 text-purple-800': option === selectedStatus && option === '待笔试',
                    'bg-green-50 text-green-800': option === selectedStatus && option === '已拿offer',
                    'bg-red-50 text-red-800': option === selectedStatus && option === '已拒绝',
                    'hover:bg-gray-50': option !== selectedStatus
                  }"
                  @click.stop="selectStatus(option, submission)"
                >
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="{
                      'bg-blue-500': option === '待回复',
                      'bg-yellow-500': option === '待面试',
                      'bg-purple-500': option === '待笔试',
                      'bg-green-500': option === '已拿offer',
                      'bg-red-500': option === '已拒绝'
                    }"
                  ></span>
                  {{ option }}
                </li>
              </ul>

              <!-- 面试/笔试附加信息 -->
              <div v-if="showInterviewForm" 
                class="w-[200px] p-2 space-y-2 border-l border-gray-100"
              >
                <select
                  v-model="interviewType"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  required
                  @click.stop
                >
                  <option disabled value="">选择形式</option>
                  <option value="线上">线上</option>
                  <option value="线下">线下</option>
                  <option value="形式待定">形式待定</option>
                </select>
                <input
                  v-model="interviewTime"
                  type="datetime-local"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  required
                  @click.stop
                >
                <button
                  @click.stop="saveInterviewInfo"
                  class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow hover:shadow-md transition-all duration-200"
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
    </TransitionGroup>
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
    
    nextTick(() => {
      const menu = document.querySelector('.status-menu-container')
      const trigger = event.currentTarget
      if (menu && trigger) {
        // 获取当前行的索引
        const currentIndex = props.submissions.indexOf(submission)
        const showBelow = currentIndex < 4 // 前4行向下弹出
        
        const menuWidth = menu.offsetWidth
        const viewportWidth = window.innerWidth
        const triggerRect = trigger.getBoundingClientRect()
        
        // 根据索引设置弹出方向
        if (showBelow) {
          menu.style.top = '100%'
          menu.style.bottom = 'auto'
          menu.classList.remove('origin-bottom')
          menu.classList.add('origin-top')
        } else {
          menu.style.bottom = '100%'
          menu.style.top = 'auto'
          menu.classList.remove('origin-top')
          menu.classList.add('origin-bottom')
        }
        
        // 检查右侧边界
        if (triggerRect.left + menuWidth > viewportWidth - 16) {
          menu.style.left = `${-(menuWidth - triggerRect.width)}px`
        }
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
async function saveChanges(submission) {
  const fullIndex = store.submissions.findIndex(item => item === submission)
  if (fullIndex === -1) return
  const isoTime = interviewTime.value ? new Date(interviewTime.value).toISOString() : ''
  await store.updateSubmission(fullIndex, {
    status: selectedStatus.value,
    interviewType: interviewType.value,
    appointmentDate: isoTime
  })
  activeSubmission.value = null
}

// 删除记录时的处理
async function deleteSubmission(submission) {
  const fullIndex = store.submissions.findIndex(item => item === submission)
  if (fullIndex !== -1) {
    await store.removeSubmission(fullIndex)
  }
}
</script>

<style scoped>
/* 菜单动画 */
.status-menu-container {
  animation: menu-pop 0.2s ease-out;
}

@keyframes menu-pop {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 向上弹出的动画 */
.origin-bottom {
  transform-origin: bottom center;
}

/* 向下弹出的动画 */
.origin-top {
  transform-origin: top center;
}

/* 列表项进入和离开的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 列表项移动时的过渡 */
.list-move {
  transition: transform 0.5s ease;
}

/* 确保离开的项目不影响布局 */
.list-leave-active {
  position: absolute;
}
</style>