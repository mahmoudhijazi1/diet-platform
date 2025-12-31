import * as React from "react"
import {
  Building2,
  Calendar,
  Database,
  FileClock,
  LayoutDashboard,
  Users,
  Utensils,
  PieChart,
  type LucideIcon,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { useAuth, UserRole } from "@/context/auth-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const location = useLocation()

  const superAdminItems = [
    {
      title: "Clinics",
      url: "/clinics",
      icon: Building2,
    },
    {
      title: "System Logs",
      url: "/logs",
      icon: FileClock,
    },
    {
      title: "Global Food DB",
      url: "/food-db",
      icon: Database,
    },
  ]

  const dietitianItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: Users,
    },
    {
      title: "Meal Plans",
      url: "/meal-plans",
      icon: Utensils,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: Calendar,
    },
  ]

  const patientItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Meal Plan",
      url: "/my-plan",
      icon: Utensils,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: Calendar,
    },
  ]

  interface SidebarItem {
    title: string;
    url: string;
    icon: LucideIcon;
  }

  let items: SidebarItem[] = []
  let label = "Menu"

  if (user?.role === UserRole.SUPER_ADMIN) {
    items = superAdminItems
    label = "Platform Administration"
  } else if (user?.role === UserRole.DIETITIAN || user?.role === UserRole.ADMIN) {
    items = dietitianItems
    label = "Clinic Management"
  } else if (user?.role === UserRole.PATIENT) {
    items = patientItems
    label = "My Health"
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <PieChart className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Diet Platform</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
