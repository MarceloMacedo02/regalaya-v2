'use client';

import { Check, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface PasswordStrengthMeterProps {
  password: string;
}

/**
 * Componente que mostra a força da senha em tempo real.
 */
export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { t } = useLanguage();

  const requirements = [
    { label: t.auth.validation.passwordMinLengthShort, met: password.length >= 8 },
    { label: t.auth.validation.passwordRequiresNumber, met: /[0-9]/.test(password) },
    { label: t.auth.validation.passwordRequiresLowercase, met: /[a-z]/.test(password) },
    { label: t.auth.validation.passwordRequiresUppercase, met: /[A-Z]/.test(password) },
    { label: t.auth.validation.passwordRequiresSpecial, met: /[@#$%^&+=!]/.test(password) },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const strength = metCount / requirements.length;

  const getStrengthColor = () => {
    if (strength === 1) return 'bg-green-500';
    if (strength >= 0.8) return 'bg-yellow-500';
    if (strength >= 0.6) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthLabel = () => {
    if (strength === 1) return t.auth.validation.passwordStrengthVeryStrong;
    if (strength >= 0.8) return t.auth.validation.passwordStrengthStrong;
    if (strength >= 0.6) return t.auth.validation.passwordStrengthMedium;
    if (strength >= 0.4) return t.auth.validation.passwordStrengthWeak;
    return t.auth.validation.passwordStrengthVeryWeak;
  };

  return (
    <div className="space-y-3">
      {/* Barra de força */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{t.auth.validation.passwordStrength}</span>
          <span className={`font-medium ${
            strength === 1 ? 'text-green-600' :
            strength >= 0.8 ? 'text-yellow-600' :
            strength >= 0.6 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength * 100}%` }}
          />
        </div>
      </div>

      {/* Requisitos */}
      <div className="grid grid-cols-2 gap-2">
        {requirements.map((req) => (
          <div
            key={req.label}
            className={`flex items-center gap-2 text-sm ${
              req.met ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {req.met ? (
              <Check className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
