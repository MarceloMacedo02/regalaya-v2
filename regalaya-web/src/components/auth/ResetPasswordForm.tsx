'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);

    try {
      await resetPassword(token, data.password, data.confirmPassword);

      const successToast = toast({
        title: t.auth.resetPassword.success,
        description: t.common.success,
        variant: 'success',
        action: (
          <ToastAction
            altText={t.common.close}
            onClick={() => successToast.dismiss()}
          >
            {t.common.close}
          </ToastAction>
        ),
      });

      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.auth.resetPassword.failed;

      if (errorMessage.toLowerCase().includes('expir')) {
        router.push('/reset-password/error?error=expired_token');
      } else if (errorMessage.toLowerCase().includes('inválid') || errorMessage.toLowerCase().includes('invalid')) {
        router.push('/reset-password/error?error=invalid_token');
      } else {
        router.push('/reset-password/error?error=reset_failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Password */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.resetPassword.passwordLabel}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder={t.auth.resetPassword.passwordPlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 pr-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all"
            style={{
              borderBottom: '1px solid rgba(209, 197, 180, 0.2)',
            }}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/70 transition-colors"
            disabled={isSubmitting}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Password Strength Meter */}
      {password && <PasswordStrengthMeter password={password} />}

      {/* Confirm Password */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.resetPassword.confirmPasswordLabel}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t.auth.resetPassword.passwordPlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 pr-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all"
            style={{
              borderBottom: '1px solid rgba(209, 197, 180, 0.2)',
            }}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/70 transition-colors"
            disabled={isSubmitting}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary text-primary-foreground rounded-full py-3 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.auth.resetPassword.resetting}
          </>
        ) : (
          t.auth.resetPassword.resetButton
        )}
      </Button>
    </form>
  );
}
