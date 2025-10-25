<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper flex w-100">
      <h3 style="margin-left: 1rem; margin-right:auto;">
        Recipe Availability Manager
      </h3>
      <div class="">
        <nav>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/recipe-hub">Recipes</RouterLink>
        </nav>
      </div>
    </div>
  </header>

  <RouterView />

  <footer>
    Ruadhan2300 (2025)
  </footer>

</template>

<style scoped>
header{
  background-color: #42b983;
  padding: 1rem 0;
  color: white;
  margin-bottom: 2rem;
}
footer {  
  background-color: #42b983;
  padding: 0.25rem 1rem;
  color: white;
}
nav{
  display: flex;
  gap: 1rem;
  justify-content: right;
  margin-right:1rem;
}
</style>
