<script setup lang="ts">
import type { MetaIngredient } from '@/models/ingredient';
import ContentBox from '../components/ContentBox.vue'
import { useRecipeStore } from '@/stores/recipe-store';
import { onMounted, watch } from 'vue';

const {
  recipes,
  sortedRecipes,
  sortedIngredients,
  ingredients,
  selectedIDs,
  toggleIngredientSelected,
  ingredientSearchTerm,
  LoadFromJson
} = useRecipeStore();

const recipeStore = useRecipeStore();

onMounted(() => {
  const url = new URL('../assets/recipes_veg.json', import.meta.url).href;
  recipeStore.LoadFromJson();
});

function isRecipeFulfilled(recipe: { ingredients: MetaIngredient[] }) {
  return recipe.ingredients.every(id => recipeStore.selectedIDs.includes(id.ingredient_id));
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
  <div class="w-100 h-100 items-center justify-center px-5" style="display: flex; gap: 1rem;">
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
          <button
            class="ml-2 p-2"
            @click="recipeStore.ingredientSearchTerm = ''"
          >Clear</button>
        </div>
        <!--Clear List-->
        <button
          class="mb-4 p-2 w-100"
          @click="recipeStore.selectedIDs = []"
        >Clear All</button>  

        <!--List of ingredients-->
        <p>This is an aggregate list of ingredients for recipes you have</p>
        <div v-for="ingredient in recipeStore.sortedIngredients" :key="ingredient.id">
          <div
            class="p-2 w-100"
            style="border:1px solid #aaa; cursor: pointer;"
            @click="toggleIngredientSelected(ingredient.id)"
          >
            {{ ingredient.display_name }}
            <!--create an input checkbox-->
            <input type="checkbox" :checked="recipeStore.selectedIDs.includes(ingredient.id)" style="
              float: right;
              width: 20px;
              height: 20px;
              color:green;
              pointer-events: none;
            " />
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
          <div class="d-flex p-2 w-100" :class="isRecipeFulfilled(recipe) ? 'completed' : ''" style="border: 1px solid grey; margin-bottom: 0.5rem;">
            <div class="w-50">
            <h2 class="font-bold">{{ recipe.display_name }}</h2>
            <p>{{ recipe.description }}</p>
            </div>
            <div class="w-50">
            <p>Ingredients:</p>
            <ul>
              <li v-for="ingData in recipe.ingredients" :key="ingData.ingredient_id" style="cursor: pointer;"
                @click="toggleIngredientSelected(ingData.ingredient_id)">
                
                {{ recipeStore.ingredients.find(ing => ing.id === ingData.ingredient_id)?.display_name || 'Unknown Ingredient' }} <span v-if="ingData.quantity > 0">x{{ ingData.quantity }}</span>
                <!-- if the ingID is on the selectedIDs list, add a green checkbox using an input component-->
                <span v-if="recipeStore.selectedIDs.includes(ingData.ingredient_id)" style="color: green;">&#10003;</span>
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
</style>
