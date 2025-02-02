<template>
    <div>
      <table class="w-full border-collapse border">
        <thead>
          <tr>
            <th class="border p-2">企业名称</th>
            <th class="border p-2">地点</th>
            <th class="border p-2">当前状态</th>
            <th class="border p-2">投递时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(submission, index) in submissions" :key="index" class="border">
            <td class="border p-2">{{ submission.company }}</td>
            <td class="border p-2">{{ submission.location }}</td>
            <td class="border p-2">{{ submission.status }}</td>
            <td class="border p-2">{{ submission.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { useSubmissionStore } from '../stores/submissionStore'
  import { storeToRefs } from 'pinia'
  
  const store = useSubmissionStore()
  const { submissions } = storeToRefs(store)
  </script>