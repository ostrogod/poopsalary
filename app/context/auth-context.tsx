"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase, getCurrentUser, signUp, signIn, signOut, getUserProfile, createUserProfile, UserProfile, requestPasswordReset } from "../lib/supabase-client"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, currencyCode?: string, annualSalary?: number) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  clearError: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar sesión existente al montar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          const userProfile = await getUserProfile(currentUser.id)
          if (userProfile) {
            setProfile(userProfile)
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Escuchar cambios de autenticación
    const { data } = supabase.auth.onAuthStateChange(async (_event: any, session: Session | null) => {
      setUser(session?.user || null)
      if (session?.user) {
        const userProfile = await getUserProfile(session.user.id)
        setProfile(userProfile)
      } else {
        setProfile(null)
      }
    })

    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe()
      }
    }
  }, [])

  const handleSignUp = async (email: string, password: string, currencyCode: string = "EUR", annualSalary: number = 0) => {
    try {
      setError(null)
      const { user: newUser } = await signUp(email, password)
      if (newUser) {
        setUser(newUser)
        const newProfile = await createUserProfile(newUser.id, email, currencyCode, annualSalary)
        setProfile(newProfile)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al registrarse"
      setError(errorMessage)
      throw err
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { user: signedInUser } = await signIn(email, password)
      if (signedInUser) {
        setUser(signedInUser)
        const userProfile = await getUserProfile(signedInUser.id)
        setProfile(userProfile)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión"
      setError(errorMessage)
      throw err
    }
  }

  const handleSignOut = async () => {
    try {
      setError(null)
      await signOut()
      setUser(null)
      setProfile(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cerrar sesión"
      setError(errorMessage)
      throw err
    }
  }

  const handleRequestPasswordReset = async (email: string) => {
    try {
      setError(null)
      await requestPasswordReset(email)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al solicitar reseteo de contraseña"
      setError(errorMessage)
      throw err
    }
  }

  const clearError = () => setError(null)

  const refreshProfile = async () => {
    if (!user) return
    try {
      const updatedProfile = await getUserProfile(user.id)
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
    } catch (err) {
      console.error("Error refreshing profile:", err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        requestPasswordReset: handleRequestPasswordReset,
        clearError,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
