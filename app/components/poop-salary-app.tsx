"use client"

import { useState, useEffect, useCallback } from "react"
import { SalaryInput } from "./salary-input"
import { SessionTimer } from "./session-timer"
import { SessionSummary } from "./session-summary"
import { LanguageSelector } from "./language-selector"
import { useLanguage } from "../context/language-context"
import { useAuth } from "../context/auth-context"
import { currencies, Currency } from "../i18n"
import { createPoopSession, updateUserEarnings } from "../lib/supabase-client"

type AppState = "input" | "session" | "summary"

const STORAGE_KEY = "poop-salary-lifetime"

export function PoopSalaryApp() {
  const { t } = useLanguage()
  const { user, profile, refreshProfile } = useAuth()
  const [appState, setAppState] = useState<AppState>("input")
  const [annualSalary, setAnnualSalary] = useState<number>(0)
  const [currency, setCurrency] = useState<Currency>(currencies[0])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [earnedMoney, setEarnedMoney] = useState(0)
  const [lifetimeEarnings, setLifetimeEarnings] = useState(0)
  const [savingSession, setSavingSession] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setLifetimeEarnings(parseFloat(stored))
    }

    // Si hay usuario autenticado, usar su moneda y datos del perfil
    if (user && profile) {
      const userCurrency = currencies.find((c) => c.code === profile.currency_code) || currencies[0]
      setCurrency(userCurrency)
      setLifetimeEarnings(profile.total_earnings)
      
      // Cargar el salario anual del perfil si existe
      if (profile.annual_salary && profile.annual_salary > 0) {
        setAnnualSalary(profile.annual_salary)
      }
    }
  }, [user, profile])

  // Calculate per-second rate (2080 work hours/year = 7,488,000 seconds)
  const perSecondRate = annualSalary / (2080 * 60 * 60)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (appState === "session") {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newSeconds = prev + 0.01
          setEarnedMoney(newSeconds * perSecondRate)
          return newSeconds
        })
      }, 10)
    }

    return () => clearInterval(interval)
  }, [appState, perSecondRate])

  const handleStartSession = useCallback(() => {
    if (annualSalary > 0) {
      setElapsedSeconds(0)
      setEarnedMoney(0)
      setAppState("session")
    }
  }, [annualSalary])

  const handleEndSession = useCallback(async () => {
    const newLifetime = lifetimeEarnings + earnedMoney
    setLifetimeEarnings(newLifetime)
    localStorage.setItem(STORAGE_KEY, newLifetime.toString())

    // Guardar en Supabase si el usuario está autenticado
    if (user && profile) {
      setSavingSession(true)
      try {
        await createPoopSession(
          user.id,
          elapsedSeconds,
          earnedMoney,
          profile.currency_code
        )
        await updateUserEarnings(user.id, earnedMoney, profile.currency_code)
        await refreshProfile()
      } catch (error) {
        console.error("Error saving session to Supabase:", error)
      } finally {
        setSavingSession(false)
      }
    }

    setAppState("summary")
  }, [lifetimeEarnings, earnedMoney, user, profile, elapsedSeconds, refreshProfile])

  const handleReset = useCallback(() => {
    setAppState("input")
    setElapsedSeconds(0)
    setEarnedMoney(0)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative">
      {/* Language Selector */}
      <LanguageSelector />

      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-2">
          <span className="inline-block animate-bounce">💩</span> {t.title}
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">{t.subtitle}</p>
        {user && (
          <p className="text-sm text-muted-foreground mt-2">
            {t.loggedInAs} {user.email}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        {appState === "input" && (
          <SalaryInput 
            salary={annualSalary} 
            currency={currency}
            onSalaryChange={setAnnualSalary} 
            onCurrencyChange={setCurrency}
            onStart={handleStartSession}
            isReadOnly={!!user}
          />
        )}

        {appState === "session" && (
          <SessionTimer 
            elapsedSeconds={elapsedSeconds} 
            earnedMoney={earnedMoney} 
            currencySymbol={currency.symbol}
            onEnd={handleEndSession} 
          />
        )}

        {appState === "summary" && (
          <SessionSummary 
            elapsedSeconds={elapsedSeconds} 
            earnedMoney={earnedMoney} 
            lifetimeEarnings={lifetimeEarnings}
            currencySymbol={currency.symbol}
            onReset={handleReset} 
            isSaving={savingSession}
          />
        )}
      </div>

      {/* Footer */}
      <p className="mt-12 text-sm text-muted-foreground text-center">
        {t.footer}
      </p>
    </div>
  )
}
