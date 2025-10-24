<script setup lang="ts">
import type { MetaIngredient } from '@/models/ingredient';
import ContentBox from '../components/ContentBox.vue'
import { useRecipeStore } from '@/stores/recipe-store';
import { onMounted, watch } from 'vue';
import CounterCheckBox from '@/components/CounterCheckBox.vue';
import Button from 'primevue/button';

const {
  recipes,
  sortedRecipes,
  sortedIngredients,
  ingredients,
  selectedIDs,
  toggleIngredientSelected,
  AddIngredientSelected,
  SetIngredientSelectedQuantity,
  RemoveIngredientSelected,
  ingredientSearchTerm,
  LoadFromJson
} = useRecipeStore();

const recipeStore = useRecipeStore();

onMounted(() => {
  const url = new URL('../assets/recipes_veg.json', import.meta.url).href;
  recipeStore.LoadFromJson();
});

function isRecipeFulfilled(recipe: { ingredients: MetaIngredient[] }) {
  // Check if all ingredients in the recipe are present in selectedIDs, this does not consider quantity
  return recipe.ingredients.every(ingredient => recipeStore.selectedIDs.findIndex(item => item.ingredient_id == ingredient.ingredient_id) != -1);
}

watch(
  () => recipeStore.recipes,
  (newVal) => {
    console.log('recipes changed:', newVal);
  },
  { deep: true }
);

watch(
  () => recipeStore.ingredients,
  (newVal) => {
    console.log('ingredients changed:', newVal);
  },
  { deep: true }
);

watch(
  () => recipeStore.selectedIDs.values,
  (newVal) => {
    console.log('selectedIDs changed:', newVal);
  },
  { deep: true }
);
watch(
  () => recipeStore.selectedIDs.values,
  (newVal) => console.log('selectedIDs changed:', newVal)
);


</script>

<template>
  <div class="w-100 h-100 px-5" style="display: flex; gap: 1rem;">
    <ContentBox>
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Ingredients</h1>
      </template>
      <template #body>
        <!--search box to filter the list of ingredients-->
        <div class="d-flex mb-4 gap-2">
          <input
            type="text"
            v-model="recipeStore.ingredientSearchTerm"
            placeholder="Search ingredients..."
            class="p-2 w-100"
            style="border:1px solid #aaa;"
          />
          <!--Add a clear button-->
          <Button
            class="ml-2 p-2"
            @click="recipeStore.ingredientSearchTerm = ''"
            variant="outlined"
            label="Clear"
          />
        </div>
        <!--Clear List-->
        <Button
          class="mb-4 p-2 w-100"
          @click="recipeStore.selectedIDs = []"
          variant="outlined"
          label="Deselect All"
        />  

        <!--List of ingredients-->
        <p>This is an aggregate list of ingredients for recipes you have</p>
        <div class="overflow-y-auto" style="max-height: 60vh;">
        <div v-for="ingredient in recipeStore.sortedIngredients" :key="ingredient.id">
          <div
            class="p-2 w-100 flex"
            style="border:1px solid #aaa; cursor: pointer;"
          >
          <div>
            {{ ingredient.display_name }}
            </div>
            <!--create an input checkbox-->
            <!--<input type="checkbox" :checked="recipeStore.selectedIDs.findIndex(item => item.ingredient_id == ingredient.id) != -1" style="
              float: right;
              width: 20px;
              height: 20px;
              color:green;
              pointer-events: none;
            " />-->
            
                <CounterCheckBox 
                  :model-value="recipeStore.selectedIDs.find(item => item.ingredient_id == ingredient.id)?.quantity" 
                  :max="ingredient.is_collective ? 1 : 999"
                  @update:increment="recipeStore.AddIngredientSelected(ingredient.id,1)"
                  @update:decrement="recipeStore.RemoveIngredientSelected(ingredient.id,1)" 
                  @update:toggle="recipeStore.toggleIngredientSelected(ingredient.id)"
                  @update:modelValue="(value: number) => {
                    console.log('New value for ingredient', ingredient.id, ':', value);
                    if (value > 0) {
                      recipeStore.AddIngredientSelected(ingredient.id, value);
                    } else {
                      recipeStore.RemoveIngredientSelected(ingredient.id, ingredient.is_collective ? 1 : 999);
                    }
                  }"
                  style="margin-left:auto;"              
                />
          </div>
        </div>
        </div>
      </template>
    </ContentBox>
    <ContentBox class="w-100">
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Recipes</h1>
      </template>
      <template #body>
        <p>List of recipes sorted and filtered by available ingredients</p>
        <div v-for="recipe in recipeStore.sortedRecipes" :key="recipe.id">
          <div class="d-flex p-2 w-100" :class="isRecipeFulfilled(recipe) ? 'completed-recipe' : ''" style="border: 1px solid grey; margin-bottom: 0.5rem;">
            <div class="w-50">
            <h2 class="font-bold">{{ recipe.display_name }}</h2>
            <p>{{ recipe.description }}</p>
            </div>
            <div class="w-50">
              <p >Ingredients:</p>
              <ul>
                <li v-for="ingData in recipe.ingredients" :key="ingData.ingredient_id" class="d-flex my-1 px-2" style="cursor: pointer;" 
                :class="recipeStore.selectedIDs.findIndex(item => item.ingredient_id == ingData.ingredient_id && item.quantity >= ingData.quantity) != -1 ? 'completed' : ''">
                  <div style="width:auto;">{{ recipeStore.ingredients.find(ing => ing.id === ingData.ingredient_id)?.display_name || 'Unknown Ingredient' + ingData.ingredient_id }} <span v-if="ingData.quantity > 0">x{{ ingData.quantity }}</span></div>
                  
                  <CounterCheckBox 
                    :model-value="recipeStore.selectedIDs.find(item => item.ingredient_id == ingData.ingredient_id)?.quantity || 0" 
                    :max="ingData.quantity"
                    @update:increment="recipeStore.AddIngredientSelected(ingData.ingredient_id,1)"
                    @update:decrement="recipeStore.RemoveIngredientSelected(ingData.ingredient_id,1)" 
                    @update:model-value="(value: number) => {
                      console.log('New value for ingredient', ingData.ingredient_id, ':', value);
                      recipeStore.SetIngredientSelectedQuantity(ingData.ingredient_id, value);
                    }"
                    class="ml-auto"
                    style="margin-left:auto;"              
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </ContentBox>
  </div>
</template>

<style>
  .completed {
    background-color: #d4edda;
    border: 1px solid #28a745;
  }
  .completed-recipe {
    background-color: #eef7f0;
    border: 2px solid #155724 !important;
  }
</style>
