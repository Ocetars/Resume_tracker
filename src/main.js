/*
 * 项目入口文件
 * 创建 Vue 应用，注入 Pinia 状态管理
 * 如需启用路由，请取消注释并配置相关代码
 */
// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// import router from './router'

const app = createApp(App)

app.use(createPinia())
// 如果需要使用路由，取消下面注释
// app.use(router)

app.mount('#app')
