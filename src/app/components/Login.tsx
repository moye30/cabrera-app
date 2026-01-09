import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent } from "@/app/components/ui/card"
import { Label } from "@/app/components/ui/label"
import { toast } from "sonner"
import { Lock, User } from "lucide-react"

interface LoginProps {
  onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de validación
    setTimeout(() => {
      if (username === "admin" && password === "123456") {
        toast.success("Bienvenido a Cabrera Mobiliaria")
        onLogin()
      } else {
        toast.error("Usuario o contraseña incorrectos")
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
      <Card className="w-full max-w-md shadow-xl border-muted">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/logoCabrera.jpeg"
              alt="Cabrera Mobiliaria"
              className="h-20 w-auto"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Cabrera Mobiliaria
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de gestión de rentas
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Validando..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cabrera Mobiliaria
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
