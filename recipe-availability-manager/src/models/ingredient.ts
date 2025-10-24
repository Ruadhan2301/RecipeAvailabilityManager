export interface Ingredient {
    id: string;
    display_name: string;
    description: string;
    is_collective: boolean;
}

export interface MetaIngredient{
    ingredient_id: string;
    quantity: number;
}
