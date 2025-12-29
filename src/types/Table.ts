import type { User } from "./Auth";

export type TableStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED" | "NEEDS_CLEANING"

export interface Table {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    seats: number;
    status: TableStatus;
    qrCodeUrl: string | null;
    assignedTo: string | null;
    assignedWaiter?: User;
}

export interface TableState {
    tables: Table[];
    table: Table | null;
    loading: boolean;
    error: string | null;
}

export interface TableResponse {
    success: boolean;
    message: string;
    data: Table | Table[];
}