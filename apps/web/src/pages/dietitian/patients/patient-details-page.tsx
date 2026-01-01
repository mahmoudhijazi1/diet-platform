import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Ruler, 
  Weight, 
  Target, 
  Activity,
  Utensils,
  FileText,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotFound } from "@/components/common/not-found"

const API_URL = "http://localhost:3000"

export default function PatientDetailsPage() {
  const { id: idOrUsername } = useParams()
  const navigate = useNavigate()

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ["patient", idOrUsername],
    queryFn: async () => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/patients/${idOrUsername}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch patient details")
      const result = await response.json()
      return result.data
    },
    enabled: !!idOrUsername,
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !patient) {
    return (
      <NotFound 
        title="Patient Not Found"
        message="The patient you are looking for does not exist or you do not have permission to view them."
        backLink="/patients"
        backText="Back to Patients List"
      />
    )
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const calculateBMI = (weight: number, height: number) => {
    // height in cm, weight in kg
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Patient Details</h2>
          <p className="text-muted-foreground">View and manage patient information.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Assign Meal Plan</Button>
          <Button>New Consultation</Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={patient.user.profilePicture} />
              <AvatarFallback className="text-xl">{getInitials(patient.user.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{patient.user.name}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {patient.user.email}
                  </div>
                  {patient.user.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {patient.user.phoneNumber}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(patient.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{patient.gender}</Badge>
                <Badge variant="outline">{calculateAge(patient.dateOfBirth)} years old</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 md:w-64">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Current Weight</p>
                <p className="text-xl font-bold">{patient.weight} kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">BMI</p>
                <p className="text-xl font-bold">{calculateBMI(patient.weight, patient.height)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="text-xl font-bold">{patient.height} cm</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Goal Weight</p>
                <p className="text-xl font-bold">{patient.goalWeight || "--"} kg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Health Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Health Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Medical Conditions</h4>
              <div className="rounded-md bg-muted p-3 text-sm">
                {patient.medicalConditions || "No medical conditions listed."}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Dietary Preferences</h4>
              <div className="rounded-md bg-muted p-3 text-sm">
                {patient.dietaryPreferences || "No specific preferences listed."}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Activity Level</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{patient.activityLevel || "Not specified"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Notes (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes & Activity
            </CardTitle>
            <CardDescription>Recent interactions and progress notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">No recent activity recorded.</p>
            </div>
          </CardContent>
        </Card>

        {/* Meal Plans (Placeholder) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Assigned Meal Plans
            </CardTitle>
            <CardDescription>Manage meal plans for this patient.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex h-[150px] flex-col items-center justify-center gap-2 rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">No meal plans assigned yet.</p>
              <Button variant="secondary" size="sm">Assign Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
