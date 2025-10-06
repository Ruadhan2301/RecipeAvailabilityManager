<script setup lang="ts">
import ContentBox from '../components/ContentBox.vue'
</script>

<template>
  <div class="w-full h-full items-center justify-center" style="display: flex; gap: 1rem;">
    <ContentBox>
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Recipe Creator</h1>
      </template>
      <template #body>
        <p>This is where you can create and manage your recipes.</p>
      </template>
    </ContentBox>
    <ContentBox class="w-full">
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Recipe Creator</h1>
      </template>
      <template #body>
        <p>This is where you can create and manage your recipes.</p>
      </template>
    </ContentBox>
    <ContentBox>
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Recipe Creator</h1>
      </template>
      <template #body>
        <p>This is where you can create and manage your recipes.</p>
      </template>
    </ContentBox>

  </div>
</template>

<style>
</style>
