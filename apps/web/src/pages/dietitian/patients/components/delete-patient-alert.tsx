import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
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

const API_URL = "http://localhost:3000"

interface DeletePatientAlertProps {
  patientId: string | null
  onClose: () => void
}

export function DeletePatientAlert({ patientId, onClose }: DeletePatientAlertProps) {
  const queryClient = useQueryClient()

  const deletePatientMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to delete patient")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      onClose()
    },
  })

  return (
    <AlertDialog open={!!patientId} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the patient account and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => patientId && deletePatientMutation.mutate(patientId)}
          >
            {deletePatientMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
