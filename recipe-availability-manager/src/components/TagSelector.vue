<template>
  <div class="d-flex flex-wrap gap-2 d-flex my-3">
    <div class="display-pill cursor-pointer" :class="isSelected(tag) ? 'selected' : ''" v-for="tag in props.tags" :key="tag" @click="toggleTagSelected(tag)">{{ tag }}</div>
    <Button style="height:2rem" @click="clearSelectedTags()" rounded variant="outlined" severity="warn" v-show="val.length > 0">Deselect All</Button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch,computed } from 'vue'
import { defineProps } from 'vue'
import Button from 'primevue/button';


interface IProps {
  tags?: string[],
  selected?: string[];
}

const props = defineProps<IProps>();

const val = ref<string[]>([]);

const emit = defineEmits<{
  (e: 'update:selected', value: any): void;
}>();

const toggleTagSelected = (id:string) => {  
  val.value = props.selected ?? [];
  if(val.value?.findIndex((i) => i == id) != -1){
    val.value = val.value?.filter((i) => i != id);
  }else{
    val.value = [...val.value, id];
  }
  emit('update:selected', val.value);
}
const clearSelectedTags = () => {
  val.value = [];
  emit('update:selected', val.value);
}
const isSelected = (id:string)=> {
return val.value?.findIndex((i) => i == id) != -1;
};
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
  .display-pill.selected{
    background-color: var(--p-button-primary-background);
    color:white;
  }
</style>
