<script setup lang="ts">
import ContentBox from '../components/ContentBox.vue'
</script>

<template>
  <div class="w-100 h-full items-center justify-center px-5" style="display: flex; gap: 1rem;">
    <ContentBox>
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Recipe Creator A</h1>
      </template>
      <template #body>
        <p>This is where you can create and manage your recipes.</p>
      </template>
    </ContentBox>
    <ContentBox class="w-100">
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Recipe Creator B</h1>
      </template>
      <template #body>
        <p>This is where you can create and manage your recipes.</p>
      </template>
    </ContentBox>
    <ContentBox>
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Recipe Creator C</h1>
      </template>
      <template #body>
        <p>This is where you can create and manage your recipes.</p>
      </template>
    </ContentBox>

  </div>
</template>

<style>
</style>
