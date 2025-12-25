export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "SERVED" | "CANCELLED"

export interface OrderItem {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    orderId: string;
    menuItemId: string;
    qty: number;
    unitPrice: number; // API sends Decimal as number or string
    subTotal: number;
    notes: string | null;
    payerName: string | null;
    discountAmount: number;
    // Relations
    menuItem?: {
        id: string;
        name: string;
        imageUrl: string | null;
        price: number;
    };
}

export interface Order {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    tableId: string;
    status: OrderStatus;
    placedBy: string | null;
    qrSession: string | null;
    notes: string | null;
    createdBy: string | null;
    isQrOrder: boolean;
    subTotal: number;
    items: OrderItem[];
}

// State interface for Redux
export interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

// Request types for Thunks
export interface CreateOrderRequest {
    tableId: string;
    placedBy?: string | null;
    qrSession?: string | null;
    notes?: string | null;
    createdBy?: string | null;
    isQrOrder: boolean;
    items: {
        menuItemId: string;
        qty: number;
        notes?: string | null;
        payerName?: string | null;
        unitPrice: number;
        subTotal: number;
        discountAmount?: number;
    }[];
}

export interface UpdateOrderRequest {
    status?: OrderStatus;
    notes?: string | null;
}