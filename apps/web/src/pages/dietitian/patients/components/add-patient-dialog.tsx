import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Loader2 } from "lucide-react"
import type { CreatePatientDto } from "@diet/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_URL = "http://localhost:3000"

export function AddPatientDialog() {
  const [open, setOpen] = useState(false)
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
      setOpen(false)
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
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createPatientMutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Create a new patient profile. They will receive login credentials via email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
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
                onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, height: parseFloat(e.target.value) } })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, weight: parseFloat(e.target.value) } })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goalWeight">Goal (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, goalWeight: parseFloat(e.target.value) } })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createPatientMutation.isPending}>
              {createPatientMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
