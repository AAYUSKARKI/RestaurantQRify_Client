export interface MenuItem {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    description: string | null;
    price: number | string; 
    imageUrl: string | null;
    isAvailable: boolean;
    isVeg: boolean;
    categoryId: string;
    category?: any;
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