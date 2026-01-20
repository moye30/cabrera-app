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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, oklch(28.2% 0.091 267.935), oklch(22% 0.06 267.935))",
      }}
    >
      <Card className="w-full max-w-md shadow-2xl border border-white/10 bg-white">
        <CardContent className="p-10 space-y-8">
          {/* LOGO + TITULO */}
          <div className="flex flex-col items-center gap-4">
            <img
              src="/logoCabrera.jpeg"
              alt="Cabrera Mobiliaria"
              className="h-20 w-auto"
            />

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold tracking-wide text-neutral-900">
                Cabrera Mobiliaria
              </h1>
              <p className="text-sm text-neutral-500">
                Sistema de gestión de rentas y pedidos
              </p>
            </div>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label className="text-sm text-neutral-700">
                Usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  className="pl-9 h-11"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-neutral-700">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  type="password"
                  className="pl-9 h-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* BOTÓN */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-medium"
              style={{
                background:
                  "oklch(57.7% 0.245 27.325)",
                color: "white",
              }}
            >
              {loading ? "Validando..." : "Iniciar sesión"}
            </Button>
          </form>

          {/* FOOTER */}
          <div className="text-center text-xs text-neutral-400 pt-2">
            © {new Date().getFullYear()} Cabrera Mobiliaria
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
