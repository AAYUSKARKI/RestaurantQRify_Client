export type AuditAction = 
  | "CREATE" | "UPDATE" | "DELETE" 
  | "LOGIN" | "LOGOUT" 
  | "PAYMENT_SUCCESS" | "ORDER_STATUS_CHANGE";

export type ResourceType = "ORDER" | "BILL" | "USER" | "TABLE" | "RESERVATION";

export interface AuditLog {
  id: string;
  createdAt: Date;
  userId: string | null;
  action: AuditAction;
  resourceType: ResourceType | null;
  resourceId: string | null;
  payload: Record<string, any> | null;
  ip: string | null;
  userAgent: string | null;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}