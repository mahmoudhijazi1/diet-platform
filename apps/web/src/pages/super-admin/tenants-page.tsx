import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  AlertCircle, 
  Plus, 
  RefreshCw, 
  Eye, 
  Users, 
  Edit, 
  Ban,
  CheckCircle2,
  ArrowUpDown
} from "lucide-react"
import { TenantStatus, SubscriptionType } from "@diet/shared-types"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AppDrawer } from "@/components/common/app-drawer"
import { DataTable } from "@/components/common/data-table"
import { DietitiansListDrawer } from "@/components/super-admin/dietitians-list-drawer"

interface Tenant {
  id: string;
  name: string;
  status: TenantStatus;
  subscriptionType: SubscriptionType;
  createdAt: string;
}

const API_URL = "http://localhost:3000";

export default function TenantsPage() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [isDietitiansDrawerOpen, setIsDietitiansDrawerOpen] = useState(false)
  
  // Form State
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [tenantToSuspend, setTenantToSuspend] = useState<Tenant | null>(null)
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  
  const [newClinicName, setNewClinicName] = useState("")
  const [newClinicStatus, setNewClinicStatus] = useState<TenantStatus>(TenantStatus.ACTIVE)
  const [newClinicSubscription, setNewClinicSubscription] = useState<SubscriptionType>(SubscriptionType.FREE)

  const queryClient = useQueryClient()

  const { data: tenants, isLoading, isError, error, refetch } = useQuery<Tenant[]>({
    queryKey: ["tenants"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/tenants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tenants")
      }

      const res = await response.json()
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  const createTenantMutation = useMutation({
    mutationFn: async (newTenant: { name: string; status: TenantStatus; subscriptionType: SubscriptionType }) => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTenant),
      })

      if (!response.ok) {
        throw new Error("Failed to create tenant")
      }

      const res = await response.json()
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] })
      closeSheet()
    },
  })

  const updateTenantMutation = useMutation({
    mutationFn: async (data: { id: string; tenant: Partial<Tenant> }) => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/tenants/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data.tenant),
      })

      if (!response.ok) {
        throw new Error("Failed to update tenant")
      }

      const res = await response.json()
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] })
      closeSheet()
      setIsSuspendDialogOpen(false)
      setTenantToSuspend(null)
    },
  })

  const closeSheet = () => {
    setIsAddSheetOpen(false)
    setEditingTenant(null)
    setNewClinicName("")
    setNewClinicStatus(TenantStatus.ACTIVE)
    setNewClinicSubscription(SubscriptionType.FREE)
  }

  const openEditSheet = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setNewClinicName(tenant.name)
    setNewClinicStatus(tenant.status)
    setNewClinicSubscription(tenant.subscriptionType)
    setIsAddSheetOpen(true)
  }

  const openSuspendDialog = (tenant: Tenant) => {
    setTenantToSuspend(tenant)
    setIsSuspendDialogOpen(true)
  }

  const openDietitiansDrawer = (tenantId: string) => {
    setSelectedTenantId(tenantId)
    setIsDietitiansDrawerOpen(true)
  }

  const handleSaveTenant = () => {
    if (!newClinicName.trim()) return

    if (editingTenant) {
      updateTenantMutation.mutate({
        id: editingTenant.id,
        tenant: {
          name: newClinicName,
          status: newClinicStatus,
          subscriptionType: newClinicSubscription,
        }
      })
    } else {
      createTenantMutation.mutate({
        name: newClinicName,
        status: newClinicStatus,
        subscriptionType: newClinicSubscription,
      })
    }
  }

  const handleSuspendTenant = () => {
    if (!tenantToSuspend) return
    
    // Toggle status: if active -> inactive, else -> active
    const newStatus = tenantToSuspend.status === TenantStatus.ACTIVE ? 'INACTIVE' : TenantStatus.ACTIVE
    
    updateTenantMutation.mutate({
      id: tenantToSuspend.id,
      tenant: { status: newStatus as TenantStatus }
    })
  }

  const columns: ColumnDef<Tenant>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Clinic Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.getValue("name")}</span>
          <span className="text-xs text-muted-foreground">ID: {row.original.id.substring(0, 8)}...</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as TenantStatus
        return (
          <Badge 
            variant={status === TenantStatus.ACTIVE ? "default" : "secondary"}
            className={status === TenantStatus.ACTIVE ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {status === TenantStatus.ACTIVE && <CheckCircle2 className="mr-1 h-3 w-3" />}
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "subscriptionType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Subscription
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <Badge variant="outline">{row.getValue("subscriptionType")}</Badge>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tenant = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDietitiansDrawer(tenant.id)}>
                  <Users className="mr-2 h-4 w-4" /> Manage Dietitians
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openEditSheet(tenant)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Clinic
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => openSuspendDialog(tenant)}
                >
                  <Ban className="mr-2 h-4 w-4" /> 
                  {tenant.status === TenantStatus.ACTIVE ? "Suspend Tenant" : "Activate Tenant"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error).message || "Failed to load tenants. Please try again."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your clinics, subscriptions, and tenant statuses.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => setIsAddSheetOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Clinic
          </Button>

          <AppDrawer
            open={isAddSheetOpen}
            onOpenChange={(open) => {
              if (!open) closeSheet()
              else setIsAddSheetOpen(true)
            }}
            title={editingTenant ? "Edit Clinic" : "Add New Clinic"}
            description={editingTenant 
              ? "Update the clinic details below." 
              : "Enter the details below to create a new clinic workspace."}
            footer={
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 w-full">
                <Button variant="outline" onClick={closeSheet}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveTenant} 
                  disabled={createTenantMutation.isPending || updateTenantMutation.isPending}
                >
                  {createTenantMutation.isPending || updateTenantMutation.isPending 
                    ? "Saving..." 
                    : (editingTenant ? "Save Changes" : "Create Clinic")}
                </Button>
              </div>
            }
          >
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">Clinic Name</Label>
              <Input
                id="name"
                value={newClinicName}
                onChange={(e) => setNewClinicName(e.target.value)}
                placeholder="e.g. Healthy Life Clinic"
                className="h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select 
                value={newClinicStatus} 
                onValueChange={(value) => setNewClinicStatus(value as TenantStatus)}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TenantStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subscription" className="text-sm font-medium">Subscription Plan</Label>
              <Select 
                value={newClinicSubscription} 
                onValueChange={(value) => setNewClinicSubscription(value as SubscriptionType)}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SubscriptionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AppDrawer>
        </div>
      </div>

      <AlertDialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tenantToSuspend?.status === TenantStatus.ACTIVE ? "Suspend Tenant" : "Activate Tenant"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {tenantToSuspend?.status === TenantStatus.ACTIVE ? "suspend" : "activate"} 
              <span className="font-semibold"> {tenantToSuspend?.name}</span>?
              {tenantToSuspend?.status === TenantStatus.ACTIVE 
                ? " This will prevent users from accessing the clinic workspace."
                : " This will restore access to the clinic workspace."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSuspendTenant}
              className={tenantToSuspend?.status === TenantStatus.ACTIVE ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {tenantToSuspend?.status === TenantStatus.ACTIVE ? "Suspend" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>Clinics Directory</CardTitle>
          <CardDescription>
            A list of all registered clinics and their current subscription status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tenants || []} searchKey="name" placeholder="Search clinics..." />
        </CardContent>
      </Card>

      <DietitiansListDrawer 
        tenantId={selectedTenantId}
        open={isDietitiansDrawerOpen}
        onOpenChange={setIsDietitiansDrawerOpen}
      />
    </div>
  )
}
