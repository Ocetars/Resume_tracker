<script setup>
// 导入新增投递和投递列表组件
import SubmissionForm from './components/SubmissionForm.vue'
import SubmissionList from './components/SubmissionList.vue'
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 应用标题 -->
    <h1 class="text-2xl font-bold mb-4">简历投递记录</h1>
    <!-- 投递表单组件，用于添加新的记录 -->
    <SubmissionForm />
    <!-- 投递记录列表组件，显示所有记录并支持编辑和删除 -->
    <SubmissionList />
  </div>
</template>

<style scoped>
/* 可根据需要添加样式 */
</style>
