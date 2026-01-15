"use client"

import { useLanguage } from "../context/language-context"

interface SessionTimerProps {
  elapsedSeconds: number
  earnedMoney: number
  currencySymbol: string
  onEnd: () => void
}

export function SessionTimer({ elapsedSeconds, earnedMoney, currencySymbol, onEnd }: SessionTimerProps) {
  const { t } = useLanguage()

  const handleEnd = () => {
    const audio = new Audio("/assets/toilet-flush.mp3")
    audio.play().catch(() => {})
    onEnd()
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const centiseconds = Math.floor((totalSeconds % 1) * 100)
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      centiseconds: centiseconds.toString().padStart(2, "0"),
    }
  }

  const time = formatTime(elapsedSeconds)

  return (
    <div className="bg-card rounded-3xl p-8 shadow-lg border border-border text-center">
      <div className="space-y-8">
        {/* Animated Poop */}
        <div className="text-6xl animate-bounce">💩</div>

        {/* Timer */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm uppercase tracking-wider">{t.timeOnThrone}</p>
          <div className="font-mono text-5xl md:text-6xl font-bold text-foreground tabular-nums">
            {time.minutes}:{time.seconds}
            <span className="text-3xl text-muted-foreground">.{time.centiseconds}</span>
          </div>
        </div>

        {/* Money Counter */}
        <div className="space-y-2 bg-muted rounded-2xl p-6">
          <p className="text-muted-foreground text-sm uppercase tracking-wider">{t.moneyEarned}</p>
          <div className="font-mono text-4xl md:text-5xl font-bold text-accent tabular-nums">
            {currencySymbol}{earnedMoney.toFixed(4)}
          </div>
        </div>

        {/* End Button */}
        <button
          onClick={handleEnd}
          className="w-full py-4 px-8 bg-secondary text-secondary-foreground font-bold text-xl rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="text-2xl">🧻</span>
          {t.finished}
        </button>
      </div>
    </div>
  )
}
