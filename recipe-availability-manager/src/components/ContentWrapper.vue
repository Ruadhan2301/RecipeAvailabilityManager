<template>
  <div class="body-wrapper">
    <div class="body-header">
      <slot name="header" />
    </div>    
    <div class="body-content">
      <slot name="body" />
    </div>
  </div>
</template>

<style scoped>
.body-wrapper {
  max-width: 50rem;
  min-height: 30rem;
  margin-left: auto;
  margin-right: auto;
  overflow:hidden;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.body-header{
  padding: 0.25rem 1rem;
  border-bottom: 1px solid #ccc;
  background-color: #f9f9f9;
}
.body-content {
  padding: 1rem;
}
</style>
