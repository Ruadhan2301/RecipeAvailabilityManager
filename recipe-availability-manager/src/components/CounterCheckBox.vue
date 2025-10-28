<script lang="ts" setup>
import { ref, watch } from 'vue'
import { defineProps } from 'vue'
import InputNumber from 'primevue/inputnumber';

  //This component is a checkbox that shows if an ingredient is selected or not, but also allows for a quantity to be shown and incremented or decremented

interface IProps {
  modelValue?: any
  max?: number
  disabled?: boolean
  placeholder?: string
  label?: string
}

const props = defineProps<IProps>();
const isChecked = ref(false);

const val = ref<number>(0);
const valBool = ref<boolean>(false);

watch(
  () => props.modelValue,
  (newValue) => {
    val.value = newValue || 0;
    valBool.value = val.value >= 1;
    isChecked.value = val.value >= 1;
  },
  {
    immediate: true,
  },
)

watch(
  ()=> val.value,
  (newValue, oldValue) => {
    if(newValue != oldValue){
      emit('update:modelValue', newValue);
    }
  },
)


const updateValBool = () => {
  if (valBool.value && val.value < 1) {
    val.value = 1;
  } else {
    val.value = 0;
  }
  emit('update:modelValue', val.value);
};

const onIncrement = () => {
  emit('update:increment');
};
const onDecrement = () => {
    emit('update:decrement');
  
};

const emit = defineEmits<{
  (e: 'update:increment'): void;
  (e: 'update:decrement'): void;
  (e: 'update:toggle'): void;
  (e: 'update:modelValue', value: any): void;
}>();

</script>

<template>
  <div style="height:30px;">
    <div class="d-flex align-items-center" style="float: right;">
      <InputNumber class="mx-1" style="width:7.75rem; height:2rem; text-align:center;" 
      v-model="val" inputId="horizontal-buttons" 
      showButtons buttonLayout="horizontal" :min="0" :max="99" :step="1" fluid>
        <template #incrementicon>
            <span class="pi pi-plus" />
        </template>
        <template #decrementicon>
            <span class="pi pi-minus" />
        </template>
    </InputNumber>
      </div>
  </div>
  
</template>



<style scoped>
  .input-checkbox {
    width: 30px;
    height: 30px;
    color: green;
  }
</style>
