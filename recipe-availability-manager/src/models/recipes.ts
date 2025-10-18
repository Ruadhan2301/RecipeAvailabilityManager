import type { MetaIngredient } from './ingredient';
export interface Recipe {
    id: string;
    display_name: string;
    description: string;
    ingredients: MetaIngredient[];
}
