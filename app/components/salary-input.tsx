"use client"

import { useLanguage } from "../context/language-context"
import { currencies, Currency } from "../i18n"

interface SalaryInputProps {
  salary: number
  currency: Currency
  onSalaryChange: (value: number) => void
  onCurrencyChange: (currency: Currency) => void
  onStart: () => void
  isReadOnly?: boolean
}

export function SalaryInput({ salary, currency, onSalaryChange, onCurrencyChange, onStart, isReadOnly = false }: SalaryInputProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-card rounded-3xl p-8 shadow-lg border border-border">
      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="salary" className="text-lg font-medium text-foreground flex items-center gap-2">
            {t.salaryLabel}
          </label>
          <div className="flex gap-2">
            <select
              value={currency.code}
              onChange={(e) => {
                const selected = currencies.find(c => c.code === e.target.value)
                if (selected) onCurrencyChange(selected)
              }}
              disabled={isReadOnly}
              className="h-16 px-3 bg-muted border-2 border-border focus:border-primary rounded-2xl font-mono outline-none text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
            <div className="relative flex-1">
              <input
                id="salary"
                type="number"
                placeholder={t.salaryPlaceholder}
                value={salary || ""}
                onChange={(e) => onSalaryChange(Number(e.target.value))}
                disabled={isReadOnly}
                className="w-full text-2xl h-16 px-4 bg-muted border-2 border-border focus:border-primary rounded-2xl font-mono outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{isReadOnly ? "Edita estos valores en la barra lateral" : t.salaryHint}</p>
        </div>

        {/* Giant Start Button */}
        <button
          onClick={onStart}
          disabled={!salary || salary <= 0}
          className="w-full aspect-square max-w-[200px] mx-auto flex flex-col items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-2xl cursor-pointer"
        >
          <span className="text-4xl mb-2">🚽</span>
          <span className="text-center leading-tight whitespace-pre-line">
            {t.startSession}
          </span>
        </button>
      </div>
    </div>
  )
}
