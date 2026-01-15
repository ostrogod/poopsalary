"use client"

import { useState, useEffect, useCallback } from "react"
import { SalaryInput } from "./salary-input"
import { SessionTimer } from "./session-timer"
import { SessionSummary } from "./session-summary"
import { LanguageSelector } from "./language-selector"
import { useLanguage } from "../context/language-context"
import { currencies, Currency } from "../i18n"

type AppState = "input" | "session" | "summary"

const STORAGE_KEY = "poop-salary-lifetime"

export function PoopSalaryApp() {
  const { t } = useLanguage()
  const [appState, setAppState] = useState<AppState>("input")
  const [annualSalary, setAnnualSalary] = useState<number>(0)
  const [currency, setCurrency] = useState<Currency>(currencies[0])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [earnedMoney, setEarnedMoney] = useState(0)
  const [lifetimeEarnings, setLifetimeEarnings] = useState(0)

  // Cargar lifetime del localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setLifetimeEarnings(parseFloat(stored))
    }
  }, [])

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

  const handleEndSession = useCallback(() => {
    // Guardar en lifetime y localStorage
    const newLifetime = lifetimeEarnings + earnedMoney
    setLifetimeEarnings(newLifetime)
    localStorage.setItem(STORAGE_KEY, newLifetime.toString())
    setAppState("summary")
  }, [lifetimeEarnings, earnedMoney])

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
