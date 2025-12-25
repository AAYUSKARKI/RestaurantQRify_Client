import type { MenuItem } from "./MenuItem";

export interface Category {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    imageUrl: string | null;
    items?: MenuItem[];
}

export interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

export interface CategoryResponse {
    success: boolean;
    message: string;
    data: Category | Category[];
}