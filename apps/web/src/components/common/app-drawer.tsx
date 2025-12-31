import { type ReactNode } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AppDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function AppDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className
}: AppDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn("w-[400px] sm:w-[540px] flex flex-col gap-0 p-0", className)}>
        <SheetHeader className="px-6 py-4">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <Separator />
        
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            {children}
          </div>
        </div>

        {footer && (
          <>
            <Separator />
            <SheetFooter className="px-6 py-4 sm:justify-end">
              {footer}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
