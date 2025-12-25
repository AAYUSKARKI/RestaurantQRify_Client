import * as React from "react";
import { 
  Activity, Database, Cpu, MemoryStick, RefreshCw, 
  CheckCircle2, AlertTriangle, Clock, HardDrive 
} from "lucide-react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { startHealthPolling } from "@/store/slices/healthSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HealthDashboard() {
  const dispatch = useAppDispatch();
  const { status,error, loading, lastChecked } = useAppSelector(
    (state) => state.health
  );

  React.useEffect(() => {
    dispatch(startHealthPolling());
  }, [dispatch]);

  const metrics = React.useMemo(() => {
    if (!status) return null;
    const used = status.system.memoryUsage.heapUsed / (1024 * 1024);
    const total = status.system.memoryUsage.heapTotal / (1024 * 1024);
    return {
      memUsed: used.toFixed(2),
      memTotal: total.toFixed(2),
      memPercentage: Math.min((used / total) * 100, 100),
      uptime: (status.uptime / 3600).toFixed(2),
      rss: (status.system.memoryUsage.rss / (1024 * 1024)).toFixed(2)
    };
  }, [status]);

  if (loading && !status) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
        <p className="animate-pulse text-sm text-muted-foreground">Initializing System Monitor...</p>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Health</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last Updated: {lastChecked ? format(lastChecked, "HH:mm:ss") : "Never"}</span>
            {error && <Badge variant="destructive" className="ml-2 animate-pulse">Sync Failed</Badge>}
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => dispatch(startHealthPolling())} 
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          Force Sync
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Database Status */}
        <StatCard 
          title="Database" 
          value="PostgreSQL" 
          icon={<Database className="h-4 w-4" />}
          subtext={`Latency: ${status.checks.database.responseTime}`}
          badge={status.checks.database.status.toUpperCase()}
          status={status.checks.database.status === 'up' ? 'success' : 'danger'}
        />

        {/* Uptime */}
        <StatCard 
          title="Uptime" 
          value={`${metrics?.uptime} hrs`} 
          icon={<Activity className="h-4 w-4" />}
          subtext="Current session duration"
        />

        {/* CPU Load */}
        <StatCard 
          title="CPU Usage" 
          value={`${status.system.cpuUsage.user.toFixed(1)}%`} 
          icon={<Cpu className="h-4 w-4" />}
          badge={status.system.cpuStatus}
          status={status.system.cpuStatus === 'stable' ? 'success' : 'warning'}
        />

        {/* Memory Usage */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Memory</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{metrics?.memPercentage.toFixed(1)}%</span>
              <Badge variant="outline" className="capitalize">{status.system.memoryStatus}</Badge>
            </div>
            <Progress value={metrics?.memPercentage} className="mt-3 h-1.5" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" /> Memory Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailRow label="Heap Used" value={`${metrics?.memUsed} MB`} />
            <DetailRow label="Heap Total" value={`${metrics?.memTotal} MB`} />
            <DetailRow label="RSS (Physical)" value={`${metrics?.rss} MB`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overall Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            {status.checks.database.status === "up" ? (
              <div className="space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold">Systems Operational</h3>
                <p className="text-sm text-muted-foreground max-w-70">
                  Infrastructure is running smoothly. No issues detected in backend or database.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-600">Connectivity Issue</h3>
                <p className="text-sm text-muted-foreground">
                  {status.checks.database.error || "Failed to communicate with the database."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Reusable Sub-components ---

function StatCard({ title, value, icon, subtext, badge, status }: any) {
  const statusColors = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    default: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold uppercase text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {badge && (
            <Badge variant="outline" className={cn("text-[10px]", statusColors[status as keyof typeof statusColors] || statusColors.default)}>
              {badge}
            </Badge>
          )}
        </div>
        {subtext && <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-medium">{value}</span>
    </div>
  );
}