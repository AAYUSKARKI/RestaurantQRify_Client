import { useEffect, useState } from "react"
import { Sidebar } from "../Sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockOrders, mockTables, mockMenuItems } from "@/lib/mock-data"
import { Clock, CheckCircle2, ChefHat, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"
import type { Order, OrderStatus } from "@/types/Order"

export default function KitchenPage() {
    const [orders, setOrders] = useState<Order[]>(mockOrders as Order[])
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)))

        const order = orders.find((o) => o.id === orderId)
        const table = mockTables.find((t) => t.id === order?.tableId)

        if (status === "PREPARING") {
            toast.success(`Order started for ${table?.name}`)
        } else if (status === "READY") {
            toast.success(`Order ready for ${table?.name}`)
        } else if (status === "CANCELLED") {
            toast.error(`Order cancelled for ${table?.name}`)
        } else if (status === "SERVED") {
            toast.success(`Order served for ${table?.name}`)
        }
    }

    const getTimeElapsed = (orderTime: Date) => {
        const diff = Math.floor((currentTime.getTime() - orderTime.getTime()) / 1000 / 60)
        return diff
    }

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "PENDING":
                return "bg-chart-3 text-chart-3-foreground"
            case "PREPARING":
                return "bg-chart-1 text-chart-1-foreground"
            case "READY":
                return "bg-chart-2 text-chart-2-foreground"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const activeOrders = orders.filter((o) => o.status !== "SERVED" && o.status !== "CANCELLED")
    const pendingOrders = activeOrders.filter((o) => o.status === "PENDING")
    const preparingOrders = activeOrders.filter((o) => o.status === "PREPARING")
    const readyOrders = activeOrders.filter((o) => o.status === "READY")

    const OrderCard = ({ order }: { order: (typeof orders)[0] }) => {
        const table = mockTables.find((t) => t.id === order.tableId)
        const timeElapsed = getTimeElapsed(order.createdAt)
        const isUrgent = timeElapsed > 15

        return (
            <Card className={`${isUrgent ? "border-destructive border-2" : ""}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg">
                                {table?.name.split(" ")[1]}
                            </div>
                            <div>
                                <p className="font-bold text-foreground">{table?.name}</p>
                                <p className="text-sm text-muted-foreground">{order.placedBy}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`flex items-center gap-1 ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold">{timeElapsed}m</span>
                            </div>
                            {isUrgent && (
                                <Badge variant="destructive" className="mt-1">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Urgent
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {order.notes && (
                        <div className="p-2 rounded-md bg-chart-3/10 border border-chart-3/20">
                            <p className="text-sm font-medium text-chart-3">Note: {order.notes}</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        {order.items.map((item) => {
                            const menuItem = mockMenuItems.find((m) => m.id === item.menuItemId)
                            return (
                                <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                                            {item.quantity}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{menuItem?.name}</p>
                                            {item.notes && <p className="text-xs text-muted-foreground italic">{item.notes}</p>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex gap-2 pt-2">
                        {order.status === "PENDING" && (
                            <Button onClick={() => updateOrderStatus(order.id, "PREPARING")} className="flex-1" size="sm">
                                Start Preparing
                            </Button>
                        )}
                        {order.status === "PREPARING" && (
                            <>
                                <Button
                                    onClick={() => updateOrderStatus(order.id, "READY")}
                                    className="flex-1 bg-chart-2 hover:bg-chart-2/90"
                                    size="sm"
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Mark Ready
                                </Button>
                                <Button
                                    onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                                    variant="outline"
                                    className="flex-1"
                                    size="sm"
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                        {order.status === "READY" && (
                            <Button
                                onClick={() => updateOrderStatus(order.id, "SERVED")}
                                variant="outline"
                                className="flex-1"
                                size="sm"
                            >
                                Mark Served
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <ChefHat className="h-8 w-8" />
                                Kitchen Display System
                            </h1>
                            <p className="text-muted-foreground mt-1">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-foreground">{activeOrders.length}</p>
                                <p className="text-sm text-muted-foreground">Active Orders</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-chart-3">{pendingOrders.length}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {pendingOrders.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className={getStatusColor("PENDING")}>PENDING</Badge>
                                    <span className="text-sm text-muted-foreground">{pendingOrders.length} orders</span>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {pendingOrders.map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {preparingOrders.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className={getStatusColor("PREPARING")}>PREPARING</Badge>
                                    <span className="text-sm text-muted-foreground">{preparingOrders.length} orders</span>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {preparingOrders.map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {readyOrders.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className={getStatusColor("READY")}>READY</Badge>
                                    <span className="text-sm text-muted-foreground">{readyOrders.length} orders</span>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {readyOrders.map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeOrders.length === 0 && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <ChefHat className="h-16 w-16 text-muted-foreground/40 mb-4" />
                                    <p className="text-xl font-semibold text-foreground mb-2">No active orders</p>
                                    <p className="text-muted-foreground">New orders will appear here</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}