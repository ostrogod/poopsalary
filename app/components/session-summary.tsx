"use client"

import { useMemo, useEffect } from "react"
import confetti from "canvas-confetti"
import { useLanguage } from "../context/language-context"

interface SessionSummaryProps {
  elapsedSeconds: number
  earnedMoney: number
  lifetimeEarnings: number
  currencySymbol: string
  onReset: () => void
  isSaving?: boolean
}

export function SessionSummary({ elapsedSeconds, earnedMoney, lifetimeEarnings, currencySymbol, onReset, isSaving }: SessionSummaryProps) {
  const { t } = useLanguage()

  const randomMessage = useMemo(() => {
    const template = t.funnyMessages[Math.floor(Math.random() * t.funnyMessages.length)]
    return template.replace("{X}", `${currencySymbol}${earnedMoney.toFixed(4)}`)
  }, [earnedMoney, t.funnyMessages, currencySymbol])

  const randomTip = useMemo(() => t.funnyTips[Math.floor(Math.random() * t.funnyTips.length)], [t.funnyTips])

  // Disparar confeti al montar el componente
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#8B4513", "#FFA500", "#32CD32", "#FF69B4"],
    })
  }, [])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    if (minutes > 0) {
      return `${minutes} ${t.min} ${seconds} ${t.sec}`
    }
    return `${seconds} ${t.seconds}`
  }

  // Calculate fun stats
  const coffeeEquivalent = (earnedMoney / 3.5).toFixed(2)
  const toiletPaperSheets = Math.floor(elapsedSeconds * 0.5)

  return (
    <div className="bg-card rounded-3xl p-8 shadow-lg border border-border text-center">
      <div className="space-y-6">
        {/* Success Icon */}
        <div className="text-6xl">🎉</div>

        {/* Main Message */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t.sessionComplete}</h2>
          <p className="text-lg text-muted-foreground">{randomMessage}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-2xl p-4">
            <p className="text-3xl mb-1">⏱️</p>
            <p className="text-sm text-muted-foreground">{t.duration}</p>
            <p className="font-bold text-foreground">{formatTime(elapsedSeconds)}</p>
          </div>
          <div className="bg-muted rounded-2xl p-4">
            <p className="text-3xl mb-1">💰</p>
            <p className="text-sm text-muted-foreground">{t.earned}</p>
            <p className="font-bold text-accent">{currencySymbol}{earnedMoney.toFixed(4)}</p>
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">{t.lifetimeTotal}</p>
          <p className="font-bold text-2xl text-primary">{currencySymbol}{lifetimeEarnings.toFixed(4)}</p>
        </div>

        {/* Fun Equivalents */}
        <div className="bg-secondary/30 rounded-2xl p-4 space-y-3">
          <p className="font-semibold text-foreground">{t.equivalent}</p>
          <div className="flex justify-around text-sm">
            <div>
              <p className="text-2xl">☕</p>
              <p className="text-muted-foreground">{coffeeEquivalent} {t.coffees}</p>
            </div>
            <div>
              <p className="text-2xl">🧻</p>
              <p className="text-muted-foreground">{toiletPaperSheets} {t.sheetsUsed}</p>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <p className="text-sm text-muted-foreground italic bg-muted/50 rounded-xl p-3">{randomTip}</p>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={isSaving}
          className="w-full py-4 px-8 bg-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>🔄</span>
          {isSaving ? "Guardando..." : t.newSession}
        </button>
      </div>
    </div>
  )
}
