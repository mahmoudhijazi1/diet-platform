import { MoreVertical, Trash2, Pencil } from "lucide-react"
import type { User } from "@diet/shared-types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface PatientWithUser extends User {
  patientProfile?: {
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    height: number;
    weight: number;
    goalWeight?: number;
  }
}

interface PatientCardProps {
  patient: any // Using any for now as the type structure from API might need adjustment
  onDelete: (id: string) => void
}

export function PatientCard({ patient, onDelete }: PatientCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={patient.user.profilePicture} />
            <AvatarFallback>{patient.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-medium">{patient.user.name}</CardTitle>
            <CardDescription className="text-xs">{patient.user.email}</CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onDelete(patient.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 py-4 text-center text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs uppercase">Weight</span>
            <span className="font-medium">{patient.weight} kg</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs uppercase">Height</span>
            <span className="font-medium">{patient.height} cm</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs uppercase">Goal</span>
            <span className="font-medium text-primary">{patient.goalWeight || "-"} kg</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <Badge variant="outline">{patient.gender}</Badge>
          <span>Joined {new Date(patient.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
