import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Loader2, Mail, Briefcase, Clock, MoreVertical, UserX, Trash2, Pencil } from "lucide-react"
import { CreateDietitianDto, type User } from "@diet/shared-types"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface DietitiansListDrawerProps {
  tenantId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DietitianUser extends User {
  dietitianProfile?: {
    specialization: string;
    yearsOfExperience: number;
    bio?: string;
  }
}

const API_URL = "http://localhost:3000"

export function DietitiansListDrawer({ tenantId, open, onOpenChange }: DietitiansListDrawerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [dietitianToDelete, setDietitianToDelete] = useState<DietitianUser | null>(null)
  const queryClient = useQueryClient()

  // Form State
  const [formData, setFormData] = useState<CreateDietitianDto>({
    name: "",
    email: "",
    username: "",
    password: "",
    profile: {
      specialization: "",
      yearsOfExperience: 0,
      bio: "",
    },
  })

  const { data: dietitians, isLoading } = useQuery<DietitianUser[]>({
    queryKey: ["dietitians", tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/tenants/${tenantId}/dietitians`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const result = await response.json()
      return result.data
    },
    enabled: !!tenantId && open,
  })

  const createDietitianMutation = useMutation({
    mutationFn: async (newDietitian: CreateDietitianDto) => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/tenants/${tenantId}/dietitians`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDietitian),
      })
      
      if (!response.ok) {
        throw new Error("Failed to create dietitian")
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dietitians", tenantId] })
      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        profile: { specialization: "", yearsOfExperience: 0, bio: "" },
      })
    },
  })

  const deleteDietitianMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/tenants/${tenantId}/dietitians/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete dietitian")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dietitians", tenantId] })
      setDietitianToDelete(null)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createDietitianMutation.mutate(formData)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col h-full">
        <SheetHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="text-xl">Manage Dietitians</SheetTitle>
              <SheetDescription>
                View and manage dietitians for this clinic.
              </SheetDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 shrink-0">
                  <Plus className="h-4 w-4" /> Add Dietitian
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Dietitian</DialogTitle>
                  <DialogDescription>
                    Create a new dietitian account. They will receive an email with login details.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
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
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Professional Profile
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="e.g. Sports Nutrition"
                        value={formData.profile.specialization}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          profile: { ...formData.profile, specialization: e.target.value } 
                        })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="experience">Years of Exp.</Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        value={formData.profile.yearsOfExperience}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          profile: { ...formData.profile, yearsOfExperience: parseInt(e.target.value) || 0 } 
                        })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createDietitianMutation.isPending}>
                      {createDietitianMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="py-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading dietitians...</p>
              </div>
            ) : dietitians?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center border-2 border-dashed rounded-lg bg-muted/50">
                <div className="p-4 rounded-full bg-background">
                  <UserX className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">No dietitians found</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    This clinic hasn't added any dietitians yet. Click the button above to add one.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {dietitians?.map((dietitian) => (
                  <Card key={dietitian.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                          <AvatarImage src={dietitian.profilePicture} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {dietitian.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold leading-none">{dietitian.name}</h4>
                            {dietitian.dietitianProfile?.specialization && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                {dietitian.dietitianProfile.specialization}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5" />
                              <span>{dietitian.email}</span>
                            </div>
                            {dietitian.dietitianProfile && (
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5" />
                                  <span>{dietitian.dietitianProfile.yearsOfExperience} years exp.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDietitianToDelete(dietitian)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <AlertDialog open={!!dietitianToDelete} onOpenChange={(open) => !open && setDietitianToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Dietitian Access?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove <span className="font-semibold">{dietitianToDelete?.name}</span>? 
                This action cannot be undone and they will lose access to the platform immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => dietitianToDelete && deleteDietitianMutation.mutate(dietitianToDelete.id)}
              >
                {deleteDietitianMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Remove Access"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  )
}
