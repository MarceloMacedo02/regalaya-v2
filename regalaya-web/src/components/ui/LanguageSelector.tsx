"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useLanguage, type Language } from "@/hooks/useLanguage"
import { Globe, ChevronDown } from "lucide-react"

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: "pt", label: "Português", flag: "/flag-brazil.png" },
  { value: "es", label: "Español", flag: "/flag-spain.png" },
  { value: "en", label: "English", flag: "/flag-usa.png" },
]

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGUAGES.find((l) => l.value === language)!

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (lang: Language) => {
    setLanguage(lang)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors px-2 py-1 rounded-md"
        aria-label={t.auth.language.label}
      >
        <Globe className="w-4 h-4 shrink-0" />
        <img
          src={current.flag}
          alt={current.label}
          width={24}
          height={16}
          className="rounded-sm object-cover shrink-0 bg-white block"
        />
        <span className="hidden sm:inline text-xs">{current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div className={`absolute right-0 top-full mt-1 bg-surface-container-lowest rounded-lg shadow-lg border border-on-surface-variant/10 transition-all duration-200 z-50 min-w-[160px] ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            type="button"
            onClick={() => handleSelect(lang.value)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
              lang.value === language
                ? "bg-primary/10 text-primary font-medium"
                : "text-on-surface-variant hover:bg-primary/5"
            }`}
          >
            <img
              src={lang.flag}
              alt={lang.label}
              className="w-5 h-3.5 rounded-sm object-cover shrink-0 bg-white"
            />
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
