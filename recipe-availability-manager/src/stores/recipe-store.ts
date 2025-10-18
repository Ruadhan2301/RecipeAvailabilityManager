import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import type { Recipe } from '@/models/recipes';
import type { Ingredient, MetaIngredient } from '@/models/ingredient';

  export class RecipeData {
    ingredients: Ingredient[];
    recipes: Recipe[];
    constructor(ingredients: Ingredient[], recipes: Recipe[]) {
      this.ingredients = ingredients;
      this.recipes = recipes;
    }
  }
export const useRecipeStore = defineStore('recipes', () => {

const ingredients = ref<Ingredient[]>([]);
  
  const recipes = ref<Recipe[]>([]);

  const selectedIDs = ref<string[]>([]);
  const ingredientSearchTerm = ref<string>('');

  function toggleIngredientSelected(id: string) {
    if(selectedIDs.value === null) {
      selectedIDs.value = [];
    }
    console.log("Toggling ingredient:", id);
    if (selectedIDs.value.includes(id)) {
    selectedIDs.value = selectedIDs.value.filter(i => i !== id);
  } else {
    selectedIDs.value = [...selectedIDs.value, id];
  }
    console.log("Selected IDs now:", selectedIDs.value);
  };  

  function ingredientMatchPercentage(recipe: Recipe): number {
    const total = recipe.ingredients?.length || 0;
    if (total === 0) return 0;
    const matched = recipe.ingredients.filter(id => selectedIDs.value.includes(id.ingredient_id)).length;
    return Math.round((matched / total) * 100);
  }

  async function LoadFromJson(){
    //placeholder
    await fetch(new URL('../assets/recipes_veg.json', import.meta.url).href)    
      .then(response => response.json())
      .then((data: RecipeData) => {
        console.log(data);
        ingredients.value = [...data.ingredients];
        recipes.value = [...data.recipes];
        selectedIDs.value = [];
      })
      .catch(error => {
        console.error('Error loading recipes from JSON:', error);
      });
  }

  const sortedRecipes = computed(() => {
    return recipes.value.sort((a, b) => {
      const aMatches = ingredientMatchPercentage(a);
      const bMatches = ingredientMatchPercentage(b);
      return bMatches - aMatches; // Descending order
    });
  });

  const sortedIngredients = computed(() => {
    return ingredients.value.filter(
      ing => ing.display_name.toLowerCase().includes(ingredientSearchTerm.value.toLowerCase())
    ).sort((a, b) => a.display_name.localeCompare(b.display_name));
  });
  
  return { recipes, sortedRecipes,ingredients, sortedIngredients, selectedIDs,toggleIngredientSelected,ingredientSearchTerm,LoadFromJson }
})
