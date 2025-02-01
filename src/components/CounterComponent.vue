<template>
  <div>
    <h1>计数器</h1>
    <p>当前计数：{{ counter.count }}</p>
    <p>双倍计数：{{ counter.doubleCount }}</p>
    <button @click="counter.increment">增加</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<style scoped>
button {
  padding: 8px 16px;
  cursor: pointer;
}
</style> 