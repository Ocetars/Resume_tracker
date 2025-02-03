<template>
  <div class="flex items-center justify-center h-[66vh]">
    <div class="w-full max-w-md bg-white border border-gray-200 p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold mb-6 text-center text-gray-800">欢迎登录</h1>
      <button 
        @click="handleLogin" 
        class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
      >
        确认登录
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleLogin() {
      // 简单跳转到主页，后续可以添加登录逻辑
      this.$router.push('/home')
    }
  }
}
</script> 