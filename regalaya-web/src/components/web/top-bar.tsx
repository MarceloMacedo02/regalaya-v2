'use client';

import Link from 'next/link';
import { MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function TopBar() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);

  const handleSelectLang = (lang: (typeof languages)[0]) => {
    setCurrentLang(lang);
    setIsLangOpen(false);
  };

  return (
    <div className="border-b border-[#e8e4e0] bg-[#f6f3f2]">
      <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs">
        {/* Left side */}
        <div className="flex items-center gap-4 text-[#788090]">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">São Paulo, SP - Brasil</span>
            <span className="sm:hidden">São Paulo, SP</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-[#be7374]"
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label="Selecionar idioma"
              aria-expanded={isLangOpen}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div
                className="absolute left-0 top-full z-50 mt-1 w-36 rounded-md border border-[#e8e4e0] bg-white py-1 shadow-lg"
                role="listbox"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={lang.code === currentLang.code}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[#fed2cc]/60 ${
                      lang.code === currentLang.code ? 'text-[#be7374]' : 'text-[#788090]'
                    }`}
                    onClick={() => handleSelectLang(lang)}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-4 text-[#788090] md:flex">
          <Link href="/login" className="hover:text-[#be7374]">
            Entrar / Cadastrar
          </Link>
          <span className="h-3 w-px bg-[#e8e4e0]" />
          <Link href="/about" className="hover:text-[#be7374]">
            Sobre Nós
          </Link>
          <span className="h-3 w-px bg-[#e8e4e0]" />
          <Link href="/track" className="hover:text-[#be7374]">
            Rastrear Pedido
          </Link>
          <span className="h-3 w-px bg-[#e8e4e0]" />
          <Link href="/faq" className="hover:text-[#be7374]">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
