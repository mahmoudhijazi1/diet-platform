import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import type { CreatePatientDto } from "@diet/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppDrawer } from "@/components/common/app-drawer"

const API_URL = "http://localhost:3000"

interface PatientFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientToEdit?: any // Using any for now, should be a proper type
}

export function PatientFormDrawer({ open, onOpenChange, patientToEdit }: PatientFormDrawerProps) {
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<CreatePatientDto>({
    name: "",
    email: "",
    username: "",
    password: "",
    profile: {
      dateOfBirth: new Date(),
      gender: 'MALE',
      height: 0,
      weight: 0,
      goalWeight: 0,
      activityLevel: "SEDENTARY",
    }
  })

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.user.name,
        email: patientToEdit.user.email,
        username: patientToEdit.user.username,
        password: "", // Don't populate password on edit
        profile: {
          dateOfBirth: new Date(patientToEdit.dateOfBirth),
          gender: patientToEdit.gender,
          height: patientToEdit.height,
          weight: patientToEdit.weight,
          goalWeight: patientToEdit.goalWeight || 0,
          activityLevel: patientToEdit.activityLevel || "SEDENTARY",
        }
      })
    } else {
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        profile: {
          dateOfBirth: new Date(),
          gender: 'MALE',
          height: 0,
          weight: 0,
          goalWeight: 0,
          activityLevel: "SEDENTARY",
        }
      })
    }
  }, [patientToEdit, open])

  const createPatientMutation = useMutation({
    mutationFn: async (newPatient: CreatePatientDto) => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPatient),
      })
      if (!response.ok) throw new Error("Failed to create patient")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      onOpenChange(false)
    },
  })

  const updatePatientMutation = useMutation({
    mutationFn: async (data: { id: string; patient: Partial<CreatePatientDto> }) => {
        // Note: This endpoint might need to be adjusted based on backend implementation for updates
        // For now assuming we can patch the patient profile
        const token = localStorage.getItem("access_token")
        // We might need separate endpoints for user data vs profile data updates
        // But let's assume a unified update for now or just update profile
        const response = await fetch(`${API_URL}/patients/${data.id}`, {
            method: "PATCH", // or PUT
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data.patient),
        })
        if (!response.ok) throw new Error("Failed to update patient")
        return response.json()
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["patients"] })
        onOpenChange(false)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (patientToEdit) {
        // For edit, we might not want to send password if it's empty
        const { password, ...rest } = formData
        const dataToSend = password ? formData : rest
        // @ts-ignore
        updatePatientMutation.mutate({ id: patientToEdit.id, patient: dataToSend })
    } else {
        createPatientMutation.mutate(formData)
    }
  }

  const isPending = createPatientMutation.isPending || updatePatientMutation.isPending

  return (
    <AppDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={patientToEdit ? "Edit Patient" : "Add New Patient"}
      description={patientToEdit ? "Update patient details." : "Create a new patient profile. They will receive login credentials via email."}
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 w-full">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {patientToEdit ? "Save Changes" : "Create Patient"}
          </Button>
        </div>
      }
    >
      <form id="patient-form" onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        {!patientToEdit && (
            <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!patientToEdit}
            />
            </div>
        )}
        
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Health Profile
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Select 
              value={formData.profile.gender} 
              onValueChange={(val: any) => setFormData({ ...formData, profile: { ...formData.profile, gender: val } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.profile.dateOfBirth instanceof Date ? formData.profile.dateOfBirth.toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, dateOfBirth: new Date(e.target.value) } })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.profile.height}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, height: parseFloat(e.target.value) } })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.profile.weight}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, weight: parseFloat(e.target.value) } })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goalWeight">Goal (kg)</Label>
            <Input
              id="goalWeight"
              type="number"
              value={formData.profile.goalWeight}
              onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, goalWeight: parseFloat(e.target.value) } })}
            />
          </div>
        </div>
      </form>
    </AppDrawer>
  )
}
