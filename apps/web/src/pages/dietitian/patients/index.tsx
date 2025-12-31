import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Pencil, 
  Trash2,
  Loader2,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable } from "@/components/common/data-table"
import { PatientFormDrawer } from "./components/patient-form-drawer"
import { DeletePatientAlert } from "./components/delete-patient-alert"

const API_URL = "http://localhost:3000"

export default function PatientsPage() {
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<any | null>(null)

  const { data: patients, isLoading } = useQuery<any[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch patients")
      const result = await response.json()
      return result.data
    },
  })

  const handleEdit = (patient: any) => {
    setEditingPatient(patient)
    setIsDrawerOpen(true)
  }

  const handleAdd = () => {
    setEditingPatient(null)
    setIsDrawerOpen(true)
  }

  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "user.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.original.user.name}</div>,
    },
    {
      accessorKey: "user.email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("gender")}</Badge>,
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(patient)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => setPatientToDelete(patient.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">
            Manage your patient records and profiles.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patients List</CardTitle>
          <CardDescription>
            A list of all your registered patients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable 
                columns={columns} 
                data={patients || []} 
                searchKey="name" 
                placeholder="Search patients..." 
            />
          )}
        </CardContent>
      </Card>

      <PatientFormDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        patientToEdit={editingPatient}
      />

      <DeletePatientAlert
        patientId={patientToDelete}
        onClose={() => setPatientToDelete(null)}
      />
    </div>
  )
}
