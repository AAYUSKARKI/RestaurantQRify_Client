export interface Bill {
  id: string;
  orderId: string;
  generatedAt: Date | string;
  generatedBy: string;
  subTotal: number;
  discountValue: number;
  discountType: "PERCENTAGE" | "FIXED";
  serviceCharge: number;
  taxPct: number;
  taxAmount: number;
  grandTotal: number;
  paymentMode: "CASH" | "CARD" | "OTHER";
  isPaid: boolean;
  paidAt: Date | null;
}