'use client';

import { useMemo } from 'react';
import { z } from 'zod';
import { useLanguage } from './useLanguage';

// Types
export type RegisterFormData = {
  name: string;
  lastName: string;
  phoneCountryCode: string;
  phoneAreaCode: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormData = {
  emailOrPhone: string;
  password: string;
};

export type ForgotPasswordFormData = {
  email: string;
};

export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

/**
 * Hook que retorna todos os schemas de validação no idioma atual
 */
export function useValidationSchemas() {
  const { t } = useLanguage();

  const schemas = useMemo(() => {
    // Helper para acessar traduções com fallback
    const v = (key: string, fallback: string) =>
      t.auth.validation?.[key as keyof typeof t.auth.validation] || fallback;

    // Schema de registro
    const registerSchema = z.object({
      name: z
        .string()
        .min(1, v('nameRequired', 'Nome é obrigatório'))
        .min(2, v('nameMinLength', 'Nome deve ter no mínimo 2 caracteres'))
        .max(50, v('nameMaxLength', 'Nome deve ter no máximo 50 caracteres')),

      lastName: z
        .string()
        .min(1, v('lastNameRequired', 'Sobrenome é obrigatório'))
        .min(2, v('lastNameMinLength', 'Sobrenome deve ter no mínimo 2 caracteres'))
        .max(100, v('lastNameMaxLength', 'Sobrenome deve ter no máximo 100 caracteres')),

      phoneCountryCode: z
        .string()
        .min(1, v('phoneCountryCodeRequired', 'Código do país é obrigatório'))
        .regex(/^\d{1,3}$/, v('phoneCountryCodeInvalid', 'Código do país deve ter 1 a 3 dígitos')),

      phoneAreaCode: z
        .string()
        .min(1, v('phoneAreaCodeRequired', 'DDD é obrigatório'))
        .regex(/^\d{2}$/, v('phoneAreaCodeInvalid', 'DDD deve ter 2 dígitos')),

      phoneNumber: z
        .string()
        .min(1, v('phoneNumberRequired', 'Telefone é obrigatório'))
        .regex(/^\d{8,9}$/, v('phoneNumberInvalid', 'Telefone deve ter 8 ou 9 dígitos')),

      email: z
        .string()
        .min(1, v('emailRequired', 'Email é obrigatório'))
        .email(v('emailInvalid', 'Email deve ser válido')),

      password: z
        .string()
        .min(1, v('passwordRequired', 'Senha é obrigatória'))
        .min(8, v('passwordMinLength', 'Senha deve ter no mínimo 8 caracteres'))
        .regex(/[0-9]/, v('passwordNumber', 'Senha deve conter pelo menos 1 número'))
        .regex(/[a-z]/, v('passwordLowercase', 'Senha deve conter pelo menos 1 letra minúscula'))
        .regex(/[A-Z]/, v('passwordUppercase', 'Senha deve conter pelo menos 1 letra maiúscula'))
        .regex(/[@#$%^&+=!]/, v('passwordSpecial', 'Senha deve conter pelo menos 1 caractere especial')),

      confirmPassword: z
        .string()
        .min(1, v('confirmPasswordRequired', 'Confirmação de senha é obrigatória')),
    }).refine((data) => data.password === data.confirmPassword, {
      message: v('passwordMismatch', 'Senhas não conferem'),
      path: ['confirmPassword'],
    });

    // Schema de login
    const loginSchema = z.object({
      emailOrPhone: z
        .string()
        .min(1, v('emailOrPhoneRequired', 'Email ou telefone é obrigatório')),
      password: z
        .string()
        .min(1, v('passwordRequired', 'Senha é obrigatória')),
    });

    // Schema de forgot password
    const forgotPasswordSchema = z.object({
      email: z
        .string()
        .min(1, v('emailRequired', 'Email é obrigatório'))
        .email(v('emailInvalid', 'Email deve ser válido')),
    });

    // Schema de reset password
    const resetPasswordSchema = z.object({
      password: z
        .string()
        .min(1, v('passwordRequired', 'Senha é obrigatória'))
        .min(8, v('passwordMinLength', 'Senha deve ter no mínimo 8 caracteres'))
        .regex(/[0-9]/, v('passwordNumber', 'Senha deve conter pelo menos 1 número'))
        .regex(/[a-z]/, v('passwordLowercase', 'Senha deve conter pelo menos 1 letra minúscula'))
        .regex(/[A-Z]/, v('passwordUppercase', 'Senha deve conter pelo menos 1 letra maiúscula'))
        .regex(/[@#$%^&+=!]/, v('passwordSpecial', 'Senha deve conter pelo menos 1 caractere especial')),

      confirmPassword: z
        .string()
        .min(1, v('confirmPasswordRequired', 'Confirmação de senha é obrigatória')),
    }).refine((data) => data.password === data.confirmPassword, {
      message: v('passwordMismatch', 'Senhas não conferem'),
      path: ['confirmPassword'],
    });

    return {
      register: registerSchema,
      login: loginSchema,
      forgotPassword: forgotPasswordSchema,
      resetPassword: resetPasswordSchema,
    };
  }, [t]); // Recalcula quando o idioma muda

  return {
    registerSchema: schemas.register,
    loginSchema: schemas.login,
    forgotPasswordSchema: schemas.forgotPassword,
    resetPasswordSchema: schemas.resetPassword,
  };
}
