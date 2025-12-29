export interface SurplusMark {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    menuItemId: string;
    markedBy: string;
    surplusAt: string;
    surplusUntil: string;
    discountPct: number;
    note: string | null;
    menuItem: {
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
    };
}

export interface DailySpecial {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    menuItem: {
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
    };
    menuItemId: string;
    markedBy: string;
    surplusAt: Date;
    surplusUntil: Date;
    discountPct: number;
    note: string | null;
}

export interface SurplusState {
    marks: SurplusMark[];
    dailySpecials: DailySpecial[];
    loading: boolean;
    error: string | null;
}

export interface CreateSurplusRequest {
    menuItemId: string;
    surplusAt: string;
    surplusUntil: string;
    discountPct: number;
    note?: string | null;
}

export interface UpdateSurplusRequest {
    discountPct?: number;
    note?: string | null;
}