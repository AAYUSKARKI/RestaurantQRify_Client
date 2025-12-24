export interface Table {
  id: string;
  name: string;
  seats: number;
  status: TableStatus;
  assignedTo: string | null;
}

export type TableStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED" | "NEEDS_CLEANING"