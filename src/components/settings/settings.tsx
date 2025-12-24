import { Sidebar } from "../Sidebar"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Settings as SettingsIcon, 
  Store, 
  Receipt, 
  Clock, 
  ShieldCheck,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">
          
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <SettingsIcon className="h-8 w-8 text-primary" />
                Settings
              </h1>
              <p className="text-slate-500 mt-1">Manage restaurant configuration and system preferences.</p>
            </div>
            <Button className="gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-white border border-slate-200 p-1 h-12 shadow-sm">
              <TabsTrigger value="general" className="gap-2 px-4"><Store className="h-4 w-4"/> General</TabsTrigger>
              <TabsTrigger value="billing" className="gap-2 px-4"><Receipt className="h-4 w-4"/> Billing & Tax</TabsTrigger>
              <TabsTrigger value="operations" className="gap-2 px-4"><Clock className="h-4 w-4"/> Operations</TabsTrigger>
              <TabsTrigger value="security" className="gap-2 px-4"><ShieldCheck className="h-4 w-4"/> Security</TabsTrigger>
            </TabsList>

            {/* GENERAL SETTINGS */}
            <TabsContent value="general">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Restaurant Identity</CardTitle>
                  <CardDescription>How your restaurant appears on invoices and the guest QR portal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="res-name">Restaurant Name</Label>
                      <Input id="res-name" placeholder="e.g. Gourmet Kitchen" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="res-email">Support Email</Label>
                      <Input id="res-email" type="email" placeholder="contact@restaurant.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="res-address">Physical Address</Label>
                    <Input id="res-address" placeholder="123 Culinary Ave, Food City" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* BILLING SETTINGS */}
            <TabsContent value="billing">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Financial Configuration</CardTitle>
                  <CardDescription>Configure taxes and charges applied to bills.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Tax Rate (%)</Label>
                      <Input type="number" defaultValue="13" />
                      <p className="text-[10px] text-slate-400">Current Prisma Default: 13%</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Charge (%)</Label>
                      <Input type="number" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency Symbol</Label>
                      <Input defaultValue="$" />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Enable Split Billing</p>
                      <p className="text-xs text-slate-500">Allow customers to pay for individual OrderItems.</p>
                    </div>
                    <input type="checkbox" className="h-5 w-5 accent-primary" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* OPERATIONS */}
            <TabsContent value="operations">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Reservation & Table Logic</CardTitle>
                  <CardDescription>Manage how bookings and sessions are handled.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Reservation Duration (Minutes)</Label>
                    <Input type="number" defaultValue="120" className="w-48" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="text-sm font-bold text-amber-900">Auto-clean Tables</p>
                        <p className="text-xs text-amber-700">Automatically set table status to "NEEDS_CLEANING" after bill payment.</p>
                      </div>
                    </div>
                    <input type="checkbox" className="h-5 w-5 accent-amber-600" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  )
}