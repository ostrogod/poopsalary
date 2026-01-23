"use client"

import { useState } from "react"
import { requestPasswordReset } from "../lib/supabase-client"
import { useLanguage } from "../context/language-context"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"

interface ForgotPasswordProps {
  onBack: () => void
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email) {
        throw new Error(t.noEmailError)
      }

      await requestPasswordReset(email)
      setSuccess(true)
      setEmail("")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.resetPassword
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-center">{t.emailSentSuccess}</h2>
        <p className="text-center text-gray-600">
          {t.emailSentMessage} <strong>{email}</strong>
        </p>
        <p className="text-center text-sm text-gray-500">
          {t.checkEmail}
        </p>
        <button 
          onClick={() => {
            setSuccess(false)
            onBack()
          }} 
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
        >
          {t.backToLogin}
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.back}
      </button>

      <div>
        <h2 className="text-2xl font-bold">{t.resetPassword}</h2>
        <p className="text-gray-600 text-sm mt-1">
          {t.enterEmail}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-600 flex gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {t.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-2 bg-muted border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200 disabled:opacity-50"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? t.sendingLink : t.sendResetLink}
        </button>
      </form>
    </div>
  )
}
