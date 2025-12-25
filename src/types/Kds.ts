import type { OrderStatus, Order } from "./Order";

export interface KdsEvent {
    id: string;
    createdAt: string;
    orderId: string;
    status: OrderStatus;
    timestamp: string;
    minutesSpent: number | null;
    actorId: string | null;
    notes: string | null;
}

export interface KdsPerformance {
    averagePrepTime: number;
    totalCompleted: number;
    longestPrepTime: number;
    efficiencyByActor: {
        actorId: string;
        avgMinutes: number;
        count: number;
    }[];
}

export interface KdsState {
    queue: Order[]; 
    orderTimeline: KdsEvent[]; 
    performance: KdsPerformance | null;
    loading: boolean;
    error: string | null;
}

export interface CreateKdsEventRequest {
    orderId: string;
    status: OrderStatus;
    notes?: string | null;
    actorId?: string | null;
    minutesSpent?: number | null;
}