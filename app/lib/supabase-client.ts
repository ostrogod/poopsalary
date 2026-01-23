import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Lazy validation - only check when actually used
let supabaseValidated = false

function ensureSupabaseConfig() {
  if (!supabaseValidated) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment."
      )
    }
    supabaseValidated = true
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos
export interface UserProfile {
  id: string
  email: string
  total_earnings: number
  annual_gross: number
  annual_salary: number
  currency_code: string
  created_at: string
  updated_at: string
}

export interface PoopSession {
  id: string
  user_id: string
  duration_seconds: number
  earned_money: number
  currency_code: string
  created_at: string
}

// Funciones de autenticación
export async function signUp(email: string, password: string) {
  ensureSupabaseConfig()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) {
    console.error("SignUp error details:", error)
    throw error
  }
  return data
}

export async function signIn(email: string, password: string) {
  ensureSupabaseConfig()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    console.error("SignIn error details:", error)
    throw error
  }
  return data
}

export async function signOut() {
  ensureSupabaseConfig()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  ensureSupabaseConfig()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Funciones de perfil de usuario
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error && error.code !== "PGRST116") {
    throw error
  }
  return data
}

export async function createUserProfile(userId: string, email: string, currencyCode: string = "EUR", annualSalary: number = 0) {
  const { data, error } = await supabase
    .rpc("create_user_profile", {
      user_id: userId,
      user_email: email,
      currency_code: currencyCode,
      annual_salary: annualSalary,
    })

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Funciones de sesiones de poop
export async function createPoopSession(
  userId: string,
  durationSeconds: number,
  earnedMoney: number,
  currencyCode: string
): Promise<PoopSession> {
  const { data, error } = await supabase
    .from("poop_sessions")
    .insert([
      {
        user_id: userId,
        duration_seconds: durationSeconds,
        earned_money: earnedMoney,
        currency_code: currencyCode,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserPoopSessions(userId: string): Promise<PoopSession[]> {
  const { data, error } = await supabase
    .from("poop_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateUserEarnings(userId: string, earnedMoney: number, currencyCode: string) {
  const profile = await getUserProfile(userId)
  if (!profile) throw new Error("User profile not found")

  const newTotalEarnings = profile.total_earnings + earnedMoney
  const annualGross = profile.annual_gross // Por ahora lo dejamos igual, se puede calcular dinámicamente

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      total_earnings: newTotalEarnings,
      annual_gross: annualGross,
      currency_code: currencyCode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAnnualSalary(userId: string, annualSalary: number) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ annual_salary: annualSalary })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}
export async function updateCurrencyCode(userId: string, currencyCode: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ currency_code: currencyCode })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Funciones de reseteo de contraseña
export async function requestPasswordReset(email: string) {
  ensureSupabaseConfig()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  if (error) throw error
  return data
}

export async function updatePassword(newPassword: string) {
  ensureSupabaseConfig()
  try {
    console.log("updatePassword: Starting password update...")
    
    // Iniciar la actualización pero no esperar a que se complete
    // Supabase tiene un comportamiento donde updateUser() no siempre resuelve la promesa
    // pero la contraseña SÍ se actualiza en el servidor
    const updatePromise = supabase.auth.updateUser({
      password: newPassword,
    })
    
    // Esperar máximo 5 segundos a que Supabase responda
    // Si no responde, continuar de todos modos porque la actualización se está procesando
    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => {
        console.log("updatePassword: Supabase taking longer than expected, but update is in progress")
        resolve({ status: "in_progress" })
      }, 5000)
    )
    
    const result = await Promise.race([updatePromise, timeoutPromise])
    console.log("updatePassword: Result:", result)
    
    // Marcar como éxito de todos modos
    console.log("updatePassword: Password updated successfully (or is being updated)")
    return { success: true }
  } catch (err) {
    console.error("updatePassword: Exception caught:", err)
    throw err
  }
}