<template>
  <div class="d-flex gap-2">
    <div class="display-pill" v-for="tag in props.tags" :key="tag">{{ tag }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { defineProps } from 'vue'


interface IProps {
  tags?: string[]
}

const props = defineProps<IProps>();
 
</script>

<style scoped>
  .display-pill{
    background-color: #eee;
    border:1px solid #ddd;
    color:#888;
    border-radius: 3rem;
    padding: 0.1rem 0.75rem 0.25rem 0.75rem;
    font-weight: bold;
    font-variant-caps: all-small-caps;
  }
</style>
