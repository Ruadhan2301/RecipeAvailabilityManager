<template>
  <div class="d-flex flex-wrap gap-2 d-flex my-3">
    <div class="display-pill cursor-pointer" :class="selectionState(tag)" v-for="tag in props.tags" :key="tag" @click="toggleTagSelected(tag)">{{ tag }}</div>
    <Button style="height:2rem" @click="clearSelectedTags()" rounded variant="outlined" severity="warn" v-show="val.length > 0 || deselectedVal.length > 0">Deselect All</Button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { defineProps } from 'vue'
import Button from 'primevue/button';


interface IProps {
  tags?: string[],
  selected?: string[];
  deselected?: string[];
}

const props = defineProps<IProps>();

watch(() => props.selected, (newVal) => {
  val.value = newVal ?? [];
});
watch(() => props.deselected, (newVal) => {
  deselectedVal.value = newVal ?? [];
});


const val = ref<string[]>([]);
const deselectedVal = ref<string[]>([]);

const emit = defineEmits<{
  (e: 'update:selected', value: any): void;
  (e: 'update:deselected', value: any): void;
}>();

const toggleTagSelected = (id:string) => {  
  val.value = props.selected ?? [];
  deselectedVal.value = props.deselected ?? [];
  if(val.value?.findIndex((i) => i == id) != -1){ // item selected
    val.value = val.value?.filter((i) => i != id); // deleselect it
    deselectedVal.value = [...deselectedVal.value, id]; // add to deselected list
  }else if(deselectedVal.value?.findIndex((i) => i == id) != -1){ // item deselected
    deselectedVal.value = deselectedVal.value?.filter((i) => i != id); // remove from deselected list
    val.value = val.value?.filter((i) => i != id); // deleselect it
  }else{
    val.value = [...val.value, id];
  }
  /*if(val.value?.findIndex((i) => i == id) != -1){
    val.value = val.value?.filter((i) => i != id);
  }else{
    val.value = [...val.value, id];
  }*/
  emit('update:selected', val.value);
  emit('update:deselected', deselectedVal.value);
}
const clearSelectedTags = () => {
  val.value = [];
  deselectedVal.value = [];
  emit('update:selected', val.value);
  emit('update:deselected', deselectedVal.value);
}
const isSelected = (id:string)=> {
return val.value?.findIndex((i) => i == id) != -1;
};

const selectionState = (id:string) => {
  if(val.value?.findIndex((i) => i == id) != -1){
    return 'selected';
  }else if(deselectedVal.value?.findIndex((i) => i == id) != -1){
    return 'deselected';
  }else{
    return '';
  }
}
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
  .display-pill.deselected{
    background-color: #f8d7da;
    border-color: #f5c2c7;
    color:#842029;
  }
</style>
