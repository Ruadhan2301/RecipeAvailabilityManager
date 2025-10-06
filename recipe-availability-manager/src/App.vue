<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <div class="body">
    <RouterView />
  </div>
</template>

<style scoped>
header{
  background-color: #42b983;
  padding: 1rem 0;
  color: white;
  margin-bottom: 2rem;
}
nav{
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
