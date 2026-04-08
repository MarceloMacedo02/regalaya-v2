"use client"

import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from "react"
import { pt } from "@/lib/i18n/translations/pt"
import { es } from "@/lib/i18n/translations/es"
import { en } from "@/lib/i18n/translations/en"
import type { Translation } from "@/lib/i18n/translations/pt"

export type Language = "pt" | "es" | "en"

const translations: Record<Language, Translation> = { pt, es, en }
const STORAGE_KEY = "regalaya_language"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && stored in translations) {
      setLanguageState(stored as Language)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, language)
    }
  }, [language, mounted])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const t = translations[language]

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "pt", setLanguage: () => {}, t: pt }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
