import type { Table } from "./Table";

export type ReservationStatus = "ACTIVE" | "NO_SHOW" | "CANCELLED" | "COMPLETED";

export interface Reservation {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    tableId: string;
    guestName: string;
    guestPhone: string | null;
    guests: number;
    status: ReservationStatus;
    reservedAt: string;
    reservedUntil: string;
    durationMin: number;
    cancelledAt: string | null;
    completedAt: string | null;
    table?: Table
}

export interface ReservationState {
    reservations: Reservation[];
    loading: boolean;
    error: string | null;
}

export interface ReservationResponse {
    success: boolean;
    message: string;
    data: Reservation | Reservation[];
}