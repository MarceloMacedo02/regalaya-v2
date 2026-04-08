import { z } from 'zod';

/**
 * Schema de validação para registro de usuário.
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  
  lastName: z
    .string()
    .min(1, 'Sobrenome é obrigatório')
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(100, 'Sobrenome deve ter no máximo 100 caracteres'),
  
  phoneCountryCode: z
    .string()
    .min(1, 'Código do país é obrigatório')
    .regex(/^\d{1,3}$/, 'Código do país deve ter 1 a 3 dígitos'),
  
  phoneAreaCode: z
    .string()
    .min(1, 'DDD é obrigatório')
    .regex(/^\d{2}$/, 'DDD deve ter 2 dígitos'),
  
  phoneNumber: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\d{8,9}$/, 'Telefone deve ter 8 ou 9 dígitos'),
  
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ser válido'),
  
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[0-9]/, 'Senha deve conter pelo menos 1 número')
    .regex(/[a-z]/, 'Senha deve conter pelo menos 1 letra minúscula')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos 1 letra maiúscula')
    .regex(/[@#$%^&+=!]/, 'Senha deve conter pelo menos 1 caractere especial'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword']
});

/**
 * Schema de validação para login.
 */
export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email ou telefone é obrigatório'),
  
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
});

/**
 * Schema de validação para forgot password.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ser válido')
});

/**
 * Schema de validação para reset password.
 */
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[0-9]/, 'Senha deve conter pelo menos 1 número')
    .regex(/[a-z]/, 'Senha deve conter pelo menos 1 letra minúscula')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos 1 letra maiúscula')
    .regex(/[@#$%^&+=!]/, 'Senha deve conter pelo menos 1 caractere especial'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword']
});

/**
 * Schema de validação para update de conta.
 */
export const updateAccountSchema = z.object({
  username: z
    .string()
    .min(1, 'Username é obrigatório')
    .min(3, 'Username deve ter no mínimo 3 caracteres')
    .max(50, 'Username deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e underscore'),
  
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
});

// Types inferidos dos schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;
