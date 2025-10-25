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

const ingredients = ref<Ingredient[]>([]);
  
  const recipes = ref<Recipe[]>([]);

  const selectedIDs = ref<SelectedIngredient[]>([]);
  const ingredientSearchTerm = ref<string>('');

  function AddIngredientSelected(id: string, quantity: number) {
    if(selectedIDs.value === null) {
      selectedIDs.value = [];
    }
    console.log("Adding ingredient:", id, "Quantity:", quantity);
    const existing = selectedIDs.value.find(i => i.ingredient_id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      selectedIDs.value = [...selectedIDs.value, {ingredient_id: id, quantity: quantity}];
    }
    console.log("Selected IDs now:", selectedIDs.value);
  };
  
  function RemoveIngredientSelected(id: string, quantity: number) {
    console.log("Removing ingredient:", id, "Quantity:", quantity);
    const existing = selectedIDs.value.find(i => i.ingredient_id === id);
    if (existing) {
      existing.quantity -= quantity;
      if (existing.quantity <= 0) {
        selectedIDs.value = selectedIDs.value.filter(i => i.ingredient_id !== id);
      }
    }
    console.log("Selected IDs now:", selectedIDs.value);
  }

  function toggleIngredientSelected(id: string) {
    console.log("Toggling ingredient:", id);
    const existing = selectedIDs.value.find(i => i.ingredient_id === id);
    if (existing) {
      RemoveIngredientSelected(id, 1);
    } else {
      AddIngredientSelected(id, 1);
    }
  }
  function SetIngredientSelectedQuantity(id: string, quantity: number) {
    console.log("Setting ingredient quantity:", id, "Quantity:", quantity);
    const existing = selectedIDs.value.find(i => i.ingredient_id === id);
    console.log("Existing:", existing);
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
    console.log("Selected IDs now:", selectedIDs.value);
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
        console.log(data);
        //Filter ingredients to only those used in recipes
        ingredients.value = [...data.ingredients].filter(ing => 
          data.recipes.some(recipe => 
            recipe.ingredients.some(recipeIng => recipeIng.ingredient_id === ing.id)
          )
        );
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
  
  return { recipes, sortedRecipes,ingredients, sortedIngredients, selectedIDs, AddIngredientSelected, RemoveIngredientSelected,SetIngredientSelectedQuantity, toggleIngredientSelected,ingredientSearchTerm,LoadFromJson }
})
