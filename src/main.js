/*
 * 项目入口文件
 * 创建 Vue 应用，注入 Pinia 状态管理
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
