<script setup lang="ts">
import ContentWrapper from '../components/ContentWrapper.vue'
</script>

<template>  
  <ContentWrapper>
    <template #header>
      <h1 class="text-2xl font-bold mb-4">About Page</h1>
    </template>
    <template #body>
      <p>This web-app is intended to calculate what recipes can be produced with the ingredients you have available.</p>
      <p>Ideally, users should go down the Ingredients list setting the number of items they have</p>
      <p>As the user selects items, the Recipe list will reorder and reflect the ingredients as you go.</p>
      <p>The top-most item is your nearest to complete</p>
    </template>
  </ContentWrapper>
</template>

<style>
</style>
