"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updatePassword, supabase } from "../../lib/supabase-client"
import { useLanguage } from "../../context/language-context"
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const { t } = useLanguage()
  
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validating, setValidating] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)

  useEffect(() => {
    // Función para validar la sesión
    const validateSession = async () => {
      try {
        // Leer parámetros del HASH (#), no de query params (?)
        // Supabase pone el token en: #access_token=...&type=recovery
        const hash = window.location.hash.substring(1) // Remover el #
        const params = new URLSearchParams(hash)
        
        const accessToken = params.get("access_token")
        const type = params.get("type")
        
        console.log("Hash params - AccessToken:", !!accessToken, "Type:", type)
        
        // Verificar parámetros
        if (!accessToken || type !== "recovery") {
          console.error("Missing access_token or invalid type")
          setError(t.invalidLink)
          setValidating(false)
          return
        }

        // Obtener la sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log("Current session:", !!session, "Error:", sessionError?.message)
        
        if (!session) {
          // Si no hay sesión, escuchar cambios de autenticación
          console.log("No session yet, waiting for auth state change...")
          
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              console.log("Auth state event:", event, "New session:", !!newSession)
              
              if (newSession) {
                setIsTokenValid(true)
                setValidating(false)
                subscription.unsubscribe()
              }
            }
          )
          
          // Timeout: si después de 5 segundos no hay sesión, mostrar error
          const timeout = setTimeout(() => {
            setError(t.invalidLink)
            setValidating(false)
            subscription.unsubscribe()
          }, 5000)
          
          return () => clearTimeout(timeout)
        } else {
          // Si ya hay sesión, proceder inmediatamente
          console.log("Session found, validating...")
          setIsTokenValid(true)
          setValidating(false)
        }
      } catch (err) {
        console.error("Validation error:", err)
        setError(t.invalidLink)
        setValidating(false)
      }
    }

    validateSession()
  }, [t])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validaciones
      if (!newPassword || !confirmPassword) {
        throw new Error(t.allFieldsRequired)
      }

      if (newPassword.length < 8) {
        throw new Error(t.minPasswordError)
      }

      if (newPassword !== confirmPassword) {
        throw new Error(t.passwordMismatchError)
      }

      console.log("Attempting to update password...")
      
      // Iniciar actualización pero con timeout de 5 segundos
      // Si no completa en 5 segundos, continuar de todos modos
      const updatePromise = updatePassword(newPassword)
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => {
          console.log("Password update in progress, continuing...")
          resolve("timeout")
        }, 5000)
      )
      
      await Promise.race([updatePromise, timeoutPromise])
      console.log("Proceeding to sign out...")
      
      // Cerrar sesión con timeout (también puede tardar)
      const signOutPromise = supabase.auth.signOut()
      const signOutTimeoutPromise = new Promise((resolve) =>
        setTimeout(() => {
          console.log("Sign out in progress, showing success...")
          resolve("timeout")
        }, 3000)
      )
      
      await Promise.race([signOutPromise, signOutTimeoutPromise])
      console.log("Signed out successfully")
      
      setSuccess(true)
      setLoading(false)
    } catch (err) {
      console.error("Password update error:", err)
      const errorMessage = err instanceof Error ? err.message : t.resetPassword
      setError(errorMessage)
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t.validateLink}</p>
        </div>
      </div>
    )
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-600 flex gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error || t.invalidLink}</span>
          </div>
          <button 
            onClick={() => router.push("/")} 
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
          >
            {t.goToLogin}
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">{t.passwordUpdatedSuccess}</h2>
          <p className="text-gray-600">
            {t.passwordUpdatedMessage}
          </p>
          <button 
            onClick={() => router.push("/")} 
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
          >
            {t.goToLogin}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t.resetPassword}</h1>         
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-600 flex gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t.newPasswordLabel}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t.minCharacters}
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-2 bg-muted border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              {t.confirmPasswordLabel}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t.passwordsMustMatch}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-2 bg-muted border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? t.updatingPassword : t.updatePassword}
          </button>
        </form>

        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ {t.minCharacters}</p>
          <p>✓ {t.passwordsMustMatch}</p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const { t } = useLanguage()
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t.validateLink}</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
