'use client';

import { ReactNode } from 'react';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * The Gilded Editorial - Auth Layout
 * Design System: Premium boutique feel, champagne & gold palette, no-line rule
 */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Animated Background */}
      <div className="auth-background">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Card - Surface Container Lowest with rounded corners */}
        <div 
          className="bg-surface-container-lowest rounded-xl p-8"
          style={{
            boxShadow: '0px 12px 32px rgba(28, 27, 27, 0.08)'
          }}
        >
          {/* Logo inside card */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary font-display">Regalaya</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-body">{t.auth.tagline}</p>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-headline-lg text-foreground font-display">{title}</h2>
            {subtitle && (
              <p className="text-body-md text-on-surface-variant mt-2 font-body">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          {children}

          {/* Footer inside card */}
          <p className="text-center text-xs text-on-surface-variant mt-8 font-body">
            {t.auth.footer}
          </p>
        </div>
      </div>
    </div>
  );
}
