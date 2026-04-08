'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

/**
 * Schema de validação para troca de senha.
 */
const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória'),

  newPassword: z
    .string()
    .min(1, 'Nova senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[0-9]/, 'Senha deve conter pelo menos 1 número')
    .regex(/[a-z]/, 'Senha deve conter pelo menos 1 letra minúscula')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos 1 letra maiúscula')
    .regex(/[@#$%^&+=!]/, 'Senha deve conter pelo menos 1 caractere especial'),

  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword']
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'Nova senha deve ser diferente da atual',
  path: ['newPassword']
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { changePassword } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);

    try {
      await changePassword(data.currentPassword, data.newPassword);

      const toastResult = toast({
        title: 'Senha alterada com sucesso!',
        description: 'Sua senha foi atualizada com segurança.',
        variant: 'success',
        action: (
          <ToastAction
            altText="Fechar"
            onClick={() => toastResult.dismiss()}
          >
            Fechar
          </ToastAction>
        ),
      });

      // Limpa formulário após sucesso
      reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar senha';

      const errorToast = toast({
        title: 'Erro ao alterar senha',
        description: errorMessage,
        variant: 'destructive',
        action: (
          <ToastAction
            altText="Tentar novamente"
            onClick={() => errorToast.dismiss()}
          >
            Tentar novamente
          </ToastAction>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Password */}
      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            {...register('currentPassword')}
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="Senha atual"
            className="pl-10 pr-10"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-red-600 text-sm mt-1">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            {...register('newPassword')}
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Nova senha"
            className="pl-10 pr-10"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Password Strength Meter */}
      {newPassword && <PasswordStrengthMeter password={newPassword} />}

      {/* Confirm Password */}
      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirme a nova senha"
            className="pl-10 pr-10"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Alterando...' : 'Alterar senha'}
      </Button>
    </form>
  );
}
