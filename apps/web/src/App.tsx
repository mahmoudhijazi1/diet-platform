import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/dashboard-layout'
import { AuthProvider, useAuth } from './context/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import LoginPage from './pages/login-page'
import ProtectedRoute from './components/protected-route'
import TenantsPage from './pages/super-admin/tenants-page'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Welcome back, {user?.name}!</CardTitle>
          <CardDescription>
            You are currently logged in as a <span className="font-bold">{user?.role}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is your dashboard overview.
          </p>
        </CardContent>
      </Card>
      
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
    </div>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
        <h2 className="text-2xl font-bold text-muted-foreground">{title} Content</h2>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Super Admin Routes */}
              <Route path="clinics" element={<TenantsPage />} />
              <Route path="logs" element={<PlaceholderPage title="System Logs" />} />
              <Route path="food-db" element={<PlaceholderPage title="Global Food Database" />} />
              
              {/* Dietitian Routes */}
              <Route path="patients" element={<PlaceholderPage title="Patient Management" />} />
              <Route path="meal-plans" element={<PlaceholderPage title="Meal Plans" />} />
              <Route path="appointments" element={<PlaceholderPage title="Appointments" />} />
              
              {/* Patient Routes */}
              <Route path="my-plan" element={<PlaceholderPage title="My Meal Plan" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

