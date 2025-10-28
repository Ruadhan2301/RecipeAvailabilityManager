import type { MetaIngredient } from './ingredient';
export interface Recipe {
    id: string;
    display_name: string;
    description: string;
    tags:string[];
    ingredients: MetaIngredient[];
}
