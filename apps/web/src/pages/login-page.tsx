import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PieChart, Loader2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login({ username, password })
      navigate("/")
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="absolute right-4 top-4 md:right-8 md:top-8 z-50">
        <ModeToggle />
      </div>
      
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-sm font-medium text-destructive text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
      
      <div className="hidden bg-muted lg:block relative h-full">
         <img
            src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop"
            alt="Healthy food background"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale-[0.3]"
         />
         <div className="absolute inset-0 bg-black/30" />
         <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
            <div className="flex items-center text-lg font-medium">
                <PieChart className="mr-2 h-6 w-6" />
                Diet Platform Inc
            </div>
            <div className="mt-auto">
                <blockquote className="space-y-2">
                <p className="text-lg font-medium leading-relaxed">
                    &ldquo;This platform has revolutionized how we manage our clinic's diet plans and patient tracking. It is simply the best tool we have used.&rdquo;
                </p>
                <footer className="text-sm">Sofia Davis</footer>
                </blockquote>
            </div>
         </div>
      </div>
    </div>
  )
}
