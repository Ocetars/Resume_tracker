<template>
  <div class="login-container">
    <h1>欢迎登录</h1>
    <button @click="handleLogin" class="login-button">确认登录</button>
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

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-button {
  padding: 12px 24px;
  font-size: 18px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #33a06f;
}
</style> 