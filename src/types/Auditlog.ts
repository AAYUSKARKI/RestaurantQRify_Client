export interface AuditLog {
    id: string;
    createdAt: string;
    userId: string | null;
    action: string;
    resourceType: string | null;
    resourceId: string | null;
    payload: any | null; // Detailed JSON data about the change
    ip: string | null;
    userAgent: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export interface AuditLogState {
    logs: AuditLog[];
    selectedLog: AuditLog | null;
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface AuditLogResponse {
    success: boolean;
    data: AuditLog | AuditLog[];
    meta?: {
        total: number;
        page: number;
        limit: number;
    };
}