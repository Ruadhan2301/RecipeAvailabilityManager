import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import type { Recipe } from '@/models/recipes';
import type { Ingredient, MetaIngredient } from '@/models/ingredient';

  export interface SelectedIngredient{
    ingredient_id: string;
    quantity: number;
  }

  export class RecipeData {
    ingredients: Ingredient[];
    recipes: Recipe[];
    constructor(ingredients: Ingredient[], recipes: Recipe[]) {
      this.ingredients = ingredients;
      this.recipes = recipes;
    }
  }
export const useRecipeStore = defineStore('recipes', () => {


onMounted(() => {
  getSelectedIDsFromStorage();
  
  LoadFromJson('../assets/recipes_starcitizen.json?v_20251127');
});

const ingredients = ref<Ingredient[]>([]);
  
  const recipes = ref<Recipe[]>([]);

  const selectedIDs = ref<SelectedIngredient[]>([]);
  const ingredientSearchTerm = ref<string>('');

  function updateLocalStorage(){
    const jsonSelectedIDs = JSON.stringify(selectedIDs.value);
    localStorage.setItem("selectedIDs",jsonSelectedIDs);
  }

  function getSelectedIDsFromStorage(){
    const raw = localStorage.getItem("selectedIDs");
    if (!raw) {
      selectedIDs.value = [];
      return;
    }

    try {
      const parsed = JSON.parse(raw) as SelectedIngredient[];
      // ensure it's an array and normalize entries to SelectedIngredient
      selectedIDs.value = [];
      parsed.forEach(element => {
        selectedIDs.value = [...selectedIDs.value, {ingredient_id: element.ingredient_id, quantity: element.quantity}];
      });
    } catch (err) {
      console.error('Error parsing selectedIDs from localStorage:', err);
      selectedIDs.value = [];
    }
  }

  function AddIngredientSelected(id: string, quantity: number) {
    if(selectedIDs.value === null) {
      selectedIDs.value = [];
    }
    const existing = selectedIDs.value.find(i => i.ingredient_id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      selectedIDs.value = [...selectedIDs.value, {ingredient_id: id, quantity: quantity}];
    }
    updateLocalStorage();
  };
  
  function RemoveIngredientSelected(id: string, quantity: number) {
    const existing = selectedIDs.value.find(i => i.ingredient_id === id);
    if (existing) {
      existing.quantity -= quantity;
      if (existing.quantity <= 0) {
        selectedIDs.value = selectedIDs.value.filter(i => i.ingredient_id !== id);
      }
    }
    updateLocalStorage();
  }

  function toggleIngredientSelected(id: string) {
    const existing = selectedIDs.value.find(i => i.ingredient_id === id);
    if (existing) {
      RemoveIngredientSelected(id, 1);
    } else {
      AddIngredientSelected(id, 1);
    }
  }
  function SetIngredientSelectedQuantity(id: string, quantity: number) {
    const existing = selectedIDs.value.find(i => i.ingredient_id === id);
    if (existing) {
      if (quantity <= 0) {
        selectedIDs.value = selectedIDs.value.filter(i => i.ingredient_id !== id);
      } else {
        existing.quantity = quantity;
      }
    } else {
      if (quantity > 0) {
        selectedIDs.value = [...selectedIDs.value, {ingredient_id: id, quantity: quantity}];
      }
    }
    updateLocalStorage();
  }

  function ingredientMatchPercentage(recipe: Recipe): number {
    if(selectedIDs.value.length === 0) return 0;
    let matchCount = 0;
    recipe.ingredients.forEach(ingData => {
      const selected = selectedIDs.value.find(i => i.ingredient_id === ingData.ingredient_id);
      if (selected && selected.quantity >= ingData.quantity) {
        matchCount++;
      }
    });
    return (matchCount / recipe.ingredients.length) * 100;
  }

  async function LoadFromJson(path:string){
    //placeholder
    await fetch(new URL(path, import.meta.url).href)    
      .then(response => response.json())
      .then((data: RecipeData) => {
        //Filter ingredients to only those used in recipes
        ingredients.value = [...data.ingredients].filter(ing => 
          data.recipes.some(recipe => 
            recipe.ingredients.some(recipeIng => recipeIng.ingredient_id === ing.id)
          )
        );
        recipes.value = [...data.recipes];
        
        getSelectedIDsFromStorage();
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
  
  return { recipes, sortedRecipes,ingredients, sortedIngredients, selectedIDs, AddIngredientSelected, RemoveIngredientSelected,SetIngredientSelectedQuantity, toggleIngredientSelected,ingredientSearchTerm,LoadFromJson }
})
