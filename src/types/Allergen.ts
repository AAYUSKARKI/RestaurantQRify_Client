export interface Allergen {
    id: string;
    name: string;
}

export interface AllergenState {
    allergens: Allergen[];
    loading: boolean;
    error: string | null;
}

export interface AllergenResponse {
    success: boolean;
    message: string;
    data: Allergen | Allergen[];
}