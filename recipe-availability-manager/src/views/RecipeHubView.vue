<script setup lang="ts">
import type { MetaIngredient } from '@/models/ingredient';
import type { Recipe } from '@/models/recipes';
import ContentBox from '../components/ContentBox.vue'
import { useRecipeStore } from '@/stores/recipe-store';
import { ref,computed, onMounted } from 'vue';
import CounterCheckBox from '@/components/CounterCheckBox.vue';
import Button from 'primevue/button';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TagDisplay from '@/components/TagDisplay.vue';
import TagSelector from '@/components/TagSelector.vue';

const selectedTags = ref<string[]>();
const deselectedTags = ref<string[]>();
onMounted(() => {
  
    const tagData = localStorage.getItem("selectedTags");
    if(tagData){
      selectedTags.value = JSON.parse(tagData);
    }
    const deselectedTagData = localStorage.getItem("deselectedTags");
    if(deselectedTagData){
      deselectedTags.value = JSON.parse(deselectedTagData);
    }
    console.log(selectedTags.value, deselectedTags.value);
});

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
  LoadFromJson,
  ingredientMatchRecipePercentage
} = useRecipeStore();

const recipeStore = useRecipeStore();

const mobileTab = ref('0');



  function updateTagsInLocalStorage(){
    const jsonSelectedTags = JSON.stringify(selectedTags.value);
    localStorage.setItem("selectedTags",jsonSelectedTags);
    const jsonDeselectedTags = JSON.stringify(deselectedTags.value);
    localStorage.setItem("deselectedTags",jsonDeselectedTags);
  }

//For each recipe, get all the Tags, remove duplicates, and add to a list which we then return.
const aggregateTags = computed(() => {
  // prefer using recipeStore to avoid destructure-reactivity issues
  /*const source = Array.isArray((recipeStore.recipes as any)?.value)
    ? (recipeStore.recipes as any).value
    : (Array.isArray(recipes as any) ? (recipes as any) : (recipes as any)?.value ?? []);
*/
const source = recipeStore.recipes;
  const set = new Set<string>();
  for (const r of source) {
    const tags = r?.tags ?? [];
    for (const t of tags) {
      if (t && typeof t === 'string') set.add(t.trim());
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

function isRecipeFulfilled(recipe: { ingredients: MetaIngredient[] }) {
  // Check if all ingredients in the recipe are present in selectedIDs, this does not consider quantity
  return recipe.ingredients.every(ing => {
    const selected = recipeStore.selectedIDs.find(s => s.ingredient_id === ing.ingredient_id);
    const required = typeof ing.quantity === 'number' ? ing.quantity : 0;
    return !!selected && selected.quantity >= required;
  });
  //return recipe.ingredients.every(ingredient => recipeStore.selectedIDs.findIndex(item => item.ingredient_id == ingredient.ingredient_id) != -1);
}

function recipeFulfillmentPercent(recipe: { ingredients: MetaIngredient[] }) {
  const totalRequired = recipe.ingredients.reduce((sum, ing) => sum + (ing.quantity ?? 0), 0);
  if (totalRequired === 0) return 100;
  const matched = recipe.ingredients.reduce((sum, ing) => {
    const selected = recipeStore.selectedIDs.find(s => s.ingredient_id === ing.ingredient_id);
    return sum + Math.min(selected?.quantity ?? 0, ing.quantity ?? 0);
  }, 0);
  return Math.round((matched / totalRequired) * 100);
}

function recipeIngredientFulfillmentPercent(ingredient:MetaIngredient) {
  const selectedQuant = recipeStore.selectedIDs.find(s => s.ingredient_id === ingredient.ingredient_id)?.quantity ?? 0;
  const totalRequired = ingredient.quantity ?? 1;
  return Math.round((Math.min(selectedQuant, totalRequired) / totalRequired) * 100)
}

/*watch(
  () => recipeStore.selectedIDs.values,
  (newVal) => console.log('selectedIDs changed:', newVal)
);*/

function updateIngredientSelectedCount(id:string, value:number){
  recipeStore.SetIngredientSelectedQuantity(id, value);
}
function recipeHasAnyTag(recipe:Recipe){
  const recipeTags = recipe.tags ?? [];
  const sel = selectedTags.value;
  // If no tags selected, show all recipes
  if (!sel || sel.length === 0) return true;

  const selSet = new Set(sel.map(t => (t ?? '').trim().toLowerCase()));
  return recipeTags.some(t => selSet.has((t ?? '').trim().toLowerCase()));
}

function recipeHasNoDeselectedTags(recipe:Recipe){
  const recipeTags = recipe.tags ?? [];
  const desel = deselectedTags.value;
  // If no tags deselected, show all recipes
  if (!desel || desel.length === 0) return true;

  const deselSet = new Set(desel.map(t => (t ?? '').trim().toLowerCase()));
  return !recipeTags.some(t => deselSet.has((t ?? '').trim().toLowerCase()));
}

function IsRecipePermitted(recipe:Recipe){
  // Check if recipe is permitted based on some criteria
  // For now, we assume all recipes are permitted
  return true;
}

</script>

<template>
  <div>
  <Tabs v-model:value="mobileTab" class="d-local-none">
    <TabList>
        <Tab value="0">Ingredients</Tab>
        <Tab value="1">Recipes</Tab>
    </TabList>
</Tabs>
  <div class="w-100 h-100 md:px-5 d-flex gap-2" style="flex-wrap: wrap;">    
    <ContentBox class="w-100 w-split-33" :class="mobileTab != '0' ? 'd-local-block' : ''">
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
                  @update:modelValue="(value: number) => updateIngredientSelectedCount(ingredient.id,value)"
                  style="margin-left:auto;"              
                />
          </div>
        </div>
        </div>
      </template>
    </ContentBox>
    <ContentBox class="w-100 w-split-66" :class="mobileTab != '1' ? 'd-local-block' : ''">
      <template #header>
        <h1 class="text-2xl font-bold mb-4">Recipes</h1>
      </template>
      <template #body>
        <p>List of recipes sorted and filtered by available ingredients</p>
        <p style="font-size: x-small;">Tags allow you to whitelist or blacklist particular types of Recipe. Green are filtered to recipes that include this tag, Red are filtered to recipes that exclude the tag.</p>
        <div>
          <TagSelector :tags="aggregateTags" :selected="selectedTags" :deselected="deselectedTags"
          @update:selected="(value: string[]) => {
                      selectedTags = value;
                      updateTagsInLocalStorage();
                    }"
                    @update:deselected="(value: string[]) => {
                      deselectedTags = value;
                      updateTagsInLocalStorage();
                    }"
          ></TagSelector>
        </div>
        <div v-for="recipe in recipeStore.sortedRecipes.filter((r) => recipeHasAnyTag(r) && recipeHasNoDeselectedTags(r)) && IsRecipePermitted(r)" :key="recipe.id">
          <div class="p-2 w-100 relative" :class="isRecipeFulfilled(recipe) ? 'completed-recipe' : ''" style="border: 1px solid grey; margin-bottom: 0.5rem;">
            <div style="z-index:-1; background-color: #d4edda; position:absolute; left:0;bottom:0; height:0.35rem; border-top:1px solid lightgreen;" :style="{ right: (100 - ingredientMatchRecipePercentage(recipe)) + '%' }"></div>  
            <div class="w-flex">
            <div class="w-split">
              <h2 class="font-bold">{{ recipe.display_name }}</h2>
              <p>{{ recipe.description }}</p>
            </div>
            <div class="w-split">
              <p >Ingredients:</p>
              <ul>
                <li v-for="ingData in recipe.ingredients" :key="ingData.ingredient_id" class="d-flex my-1 px-2 relative" style="cursor: pointer;" 
                :class="recipeStore.selectedIDs.findIndex(item => item.ingredient_id == ingData.ingredient_id && item.quantity >= ingData.quantity) != -1 ? 'completed' : ''">
                <div style="z-index:-1; background-color: #d4edda; position:absolute; left:0;top:0;bottom:0;" :style="{ right: (100 - recipeIngredientFulfillmentPercent(ingData)) + '%' }"></div>  
                <div class="my-2" style="width:auto;">{{ recipeStore.ingredients.find(ing => ing.id === ingData.ingredient_id)?.display_name || 'Unknown Ingredient' + ingData.ingredient_id }} <span v-if="ingData.quantity > 0">x{{ ingData.quantity }}</span></div>
                  <CounterCheckBox 
                    :model-value="recipeStore.selectedIDs.find(item => item.ingredient_id == ingData.ingredient_id)?.quantity || 0" 
                    :max="ingData.quantity"
                    @update:increment="recipeStore.AddIngredientSelected(ingData.ingredient_id,1)"
                    @update:decrement="recipeStore.RemoveIngredientSelected(ingData.ingredient_id,1)" 
                    @update:model-value="(value: number) => {
                      recipeStore.SetIngredientSelectedQuantity(ingData.ingredient_id, value);
                    }"
                    class="ml-auto my-1"
                    style="margin-left:auto;"              
                  />
                  
                </li>
              </ul>
            </div>
            </div>
              <TagDisplay class="w-full" :tags="recipe.tags"></TagDisplay>
          </div>
        </div>
      </template>
    </ContentBox>
  </div>
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
  
  .w-split-33{
    max-width: 100%;
  }
  .w-split-66{
    max-width: 100%;
  }

  .w-split{
    width:100% !important;
  }
  .w-flex{
    display:block;
  }
  
    .d-local-none{
      display:block;
    }
    .d-local-block{
      display:none;
    }

  @media (min-width: 853px) {
    .d-local-none{
      display:none !important;
    }
    .d-local-block{
      display:block;
    }
    .w-split-33{
      max-width: 33%;
    }
    .w-split-66{
      max-width: 66%;
    }
  }

  @media (min-width: 1280px) {
        
    .w-flex{
      display:flex;
    }
    .w-split {
      width: 50% !important;
    }
  }
</style>
