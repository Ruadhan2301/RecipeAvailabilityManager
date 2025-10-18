<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/recipe-hub">Recipes</RouterLink>
        <RouterLink to="/recipe-creator">New Recipe</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

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
  justify-content: right;
  margin-right:1rem;
}
</style>
