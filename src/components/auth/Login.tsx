import type React from "react"
import { useState } from "react"
import { loginUser } from "@/store/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RootState } from "@/store"
import { ChefHat } from "lucide-react"

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const loading = false
    const { error: reduxError } = useAppSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await dispatch(loginUser({ email, password })).unwrap();
        navigate("/dashboard");
    }

    const demoAccounts = [
        { email: "wongalish@gmail.com", password: "password", role: "Admin" },
        { email: "cashier@restaurant.com", password: "cashier123", role: "Cashier" },
        { email: "waiter@restaurant.com", password: "waiter123", role: "Waiter" },
        { email: "kitchen@restaurant.com", password: "kitchen123", role: "Kitchen" },
    ]

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <ChefHat className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">RestaurantQrify</CardTitle>
                    <CardDescription>Sign in to manage your restaurant</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading} // Disable during loading
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Display Redux error if it exists */}
                        {reduxError && (
                            <Alert variant="destructive">
                                <AlertDescription>{reduxError}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <p className="text-sm font-medium text-muted-foreground mb-3">Demo Accounts:</p>
                        <div className="space-y-2">
                            {demoAccounts.map((account) => (
                                <button
                                    key={account.email}
                                    onClick={() => {
                                        setEmail(account.email)
                                        setPassword(account.password)
                                    }}
                                    className="w-full cursor-pointer text-left px-3 py-2 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors"
                                >
                                    <span className="font-medium">{account.role}</span>
                                    <span className="text-muted-foreground ml-2">{account.email}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}