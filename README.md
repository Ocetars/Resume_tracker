# 简历投递记录追踪系统

![Vue](https://img.shields.io/badge/Vue-3.4.21-brightgreen)
![Pinia](https://img.shields.io/badge/Pinia-2.1.7-orange)

一个用于跟踪简历投递状态的单页面应用，帮助求职者清晰管理求职进度。

[在线演示](https://your-vercel-app-url.vercel.app) | [项目文档](docs/README.md)

## 🛠️ 技术栈

| 技术               | 用途                          | 文档链接                     |
|--------------------|-----------------------------|---------------------------|
| Vue 3              | 前端框架                      | https://vuejs.org/        |
| Pinia              | 状态管理                      | https://pinia.vuejs.org/  |
| Vue Router         | 路由管理                      | https://router.vuejs.org/ |
| Pinia持久化插件      | 状态持久化                    | https://prazdevs.github.io/pinia-plugin-persistedstate/ |
| date-fns           | 日期处理                      | https://date-fns.org/     |
| Vercel             | 项目部署                      | https://vercel.com/       |

## 📦 项目结构

```bash
src/
├─ assets/           # 静态资源
├─ components/       # 公共组件
│   └─ StatusBadge.vue # 状态标签组件
├─ stores/           # Pinia状态管理
│   └─ useJobStore.js # 核心数据逻辑
├─ router/           # 路由配置
├─ views/            # 页面组件
│   ├─ HomeView.vue   # 首页
│   ├─ AddJobView.vue # 添加记录
│   └─ JobDetailView.vue # 详情页面
├─ App.vue           # 根组件
└─ main.js           # 入口文件
