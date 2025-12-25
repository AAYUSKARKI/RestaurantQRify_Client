export interface MemoryUsage {
    heapUsed: number;
    heapTotal: number;
    rss: number;
}

export interface CpuUsage {
    user: number;
    system: number;
}

export interface HealthData {
    uptime: number;
    message: string;
    timestamp: number;
    system: {
        memoryStatus: "stable" | "high" | "critical";
        cpuStatus: "stable" | "high" | "critical";
        memoryUsage: MemoryUsage;
        cpuUsage: CpuUsage;
    };
    checks: {
        database: {
            status: "up" | "down";
            responseTime: string;
            error: string | null;
        };
    };
}

export interface HealthState {
    status: HealthData | null;
    loading: boolean;
    error: string | null;
    lastChecked: number | null;
}

export interface HealthResponse {
    success: boolean;
    message: string;
    data: HealthData;
    statusCode: number;
}