"use client"

import { useLanguage } from "../context/language-context"
import { Language } from "../i18n"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="absolute top-4 right-4">
      <div className="flex gap-2 bg-card border border-border rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setLanguage("es")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
            language === "es" 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-muted text-foreground"
          }`}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-sm overflow-hidden">
            <rect width="20" height="14" fill="#AA151B"/>
            <rect y="3.5" width="20" height="7" fill="#F1BF00"/>
          </svg>
          <span className="text-sm font-medium">ES</span>
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
            language === "en" 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-muted text-foreground"
          }`}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-sm overflow-hidden">
            <rect width="20" height="14" fill="#012169"/>
            <path d="M0,0 L20,14 M20,0 L0,14" stroke="#FFF" strokeWidth="2.5"/>
            <path d="M0,0 L20,14 M20,0 L0,14" stroke="#C8102E" strokeWidth="1.5"/>
            <path d="M10,0 V14 M0,7 H20" stroke="#FFF" strokeWidth="4"/>
            <path d="M10,0 V14 M0,7 H20" stroke="#C8102E" strokeWidth="2.5"/>
          </svg>
          <span className="text-sm font-medium">EN</span>
        </button>
      </div>
    </div>
  )
}
