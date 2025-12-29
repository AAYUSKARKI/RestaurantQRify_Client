export interface MenuItem {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
    isVeg: boolean;
    categoryId: string;
    category?: any;
    surplusMarks?: {
        discountPct: number;
    }[],
    allergens? : {
        allergen: {
            id: string;
            name: string;
        }
    }[];
}

export interface MenuItemState {
    items: MenuItem[];
    selectedItem: MenuItem | null;
    loading: boolean;
    error: string | null;
}

export interface MenuItemResponse {
    success: boolean;
    message: string;
    data: MenuItem | MenuItem[];
}

export interface newMenuItem {
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
    isVeg: boolean;
    categoryId: string;
    menuImage : File | null
}