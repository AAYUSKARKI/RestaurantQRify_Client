export interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    email: string;
    password: string;
    role: Roles
    isActive: boolean;
    forgotPasswordToken: string | null;
    forgotPasswordTokenExpiresAt: Date | null;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export const Roles = {
  ADMIN: "ADMIN",
  CASHIER: "CASHIER",
  WAITER: "WAITER",
  KITCHEN: "KITCHEN",
} as const;

export type Roles = typeof Roles[keyof typeof Roles];