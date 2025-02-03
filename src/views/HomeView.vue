<script setup>
import SubmissionForm from '@/components/SubmissionForm.vue'
import SubmissionList from '@/components/SubmissionList.vue'
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 投递表单组件，用于添加新的记录 -->
    <SubmissionForm />
    <!-- 投递记录列表组件，显示所有记录并支持编辑和删除 -->
    <SubmissionList />
  </div>
</template>

