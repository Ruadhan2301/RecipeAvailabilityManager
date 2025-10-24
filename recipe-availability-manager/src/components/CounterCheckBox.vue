<script lang="ts" setup>
import { ref, watch } from 'vue'
import { defineProps } from 'vue'
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

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
    <Checkbox 
      v-if="props.max == undefined || props.max == 1" 
      binary
      v-model="valBool"
      class="py-1"
      style="float: right;"
      @change="updateValBool()"
    />
    <div v-else class="d-flex align-items-center" style="float: right;">
      <Button 
        :disabled="props.disabled || (props.modelValue <= 0)"
        label="-"
        type="button"
        variant="outlined"
        @click="$emit('update:decrement')"
        style="width: 30px; height: 30px;"
      />
      <span style="margin: 0 10px;">{{ props.modelValue || 0 }}</span>
      <Button 
        :disabled="props.disabled || (props.max != undefined && props.modelValue >= props.max)"
        label="+"
        type="button"
        variant="outlined"
        @click="$emit('update:increment')"
        style="width: 30px; height: 30px;"
      />
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
