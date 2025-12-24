export interface Reservation {
    id: string;
    tableId: string;
    guestName: string;
    guestPhone: string;
    guests: number;
    status: ReservationStatus;
    reservedAt: Date;
    reservedUntil: Date;
    durationMin: number;
}

export type ReservationStatus = "ACTIVE" | "CANCELLED" | "NO_SHOW" | "COMPLETED"
