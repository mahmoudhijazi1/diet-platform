import { useNavigate } from "react-router-dom"
import { FileQuestion, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotFoundProps {
  title?: string
  message?: string
  backLink?: string
  backText?: string
}

export function NotFound({ 
  title = "Not Found", 
  message = "The page or resource you are looking for does not exist.", 
  backLink, 
  backText = "Go Back" 
}: NotFoundProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backLink) {
      navigate(backLink)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backText}
      </Button>
    </div>
  )
}
