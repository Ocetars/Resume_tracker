<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import SubmissionForm from './components/SubmissionForm.vue'
import SubmissionList from './components/SubmissionList.vue'
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">简历投递记录</h1>
    <SubmissionForm />
    <SubmissionList />
  </div>
</template>

<style scoped>
</style>
