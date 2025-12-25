import type { Allergen } from "./Allergen";

export interface MenuItemAllergen {
    id: string;
    menuItemId: string;
    allergenId: string;
    allergen?: Allergen; 
}

export interface MenuItemAllergenState {
    linkedAllergens: Allergen[]; 
    loading: boolean;
    error: string | null;
}

export interface LinkAllergensRequest {
    menuItemId: string;
    allergenIds: string[];
}