export type  PaymentMode = "CASH" | "CARD" | "OTHER";
export type  DiscountType = "PERCENTAGE" | "FIXED";

export interface Bill {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    orderId: string;
    generatedAt: Date;
    generatedBy: string;
    subTotal: number;
    discountValue: number;
    discountType: DiscountType;
    serviceCharge: number;
    taxPct: number;
    taxAmount: number;
    grandTotal: number;
    paymentMode: PaymentMode;
    paidAt: string | null;
    isPaid: boolean;
    pdfUrl: string | null;
    invoiceSent: boolean;
    order?: any; // Nested OrderResponse
}

export interface CreateBill {
    orderId: string;
    discountValue: number;
    discountType: DiscountType;
    paymentMode: PaymentMode;
}

export interface BillState {
    bills: Bill[];
    selectedBill: Bill | null;
    dailyReport: any | null;
    loading: boolean;
    error: string | null;
}

export interface CreateBillRequest {
    orderId: string;
    discountValue: number;
    discountType: DiscountType;
    paymentMode: PaymentMode;
}