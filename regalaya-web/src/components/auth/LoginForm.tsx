'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useValidationSchemas, type LoginFormData } from '@/hooks/useValidationSchemas';
import { ToastAction } from '@/components/ui/toast';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { loginSchema } = useValidationSchemas();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      const userData = await loginWithPassword(data.emailOrPhone, data.password);

      const successToast = toast({
        title: t.auth.login.loginSuccess,
        description: t.auth.login.welcomeBack,
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
      const errorMessage = err instanceof Error ? err.message : t.auth.login.invalidCredentials;

      const errorToast = toast({
        title: t.auth.login.loginFailed,
        description: errorMessage,
        variant: 'destructive',
        action: (
          <ToastAction
            altText={t.common.close}
            onClick={() => errorToast.dismiss()}
          >
            {t.common.close}
          </ToastAction>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.login.emailLabel}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('emailOrPhone')}
            type="email"
            placeholder={t.auth.login.emailPlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all"
            style={{
              borderBottom: '1px solid rgba(209, 197, 180, 0.2)',
            }}
            disabled={isSubmitting}
            onChange={(e) => setValue('emailOrPhone', e.target.value, { shouldValidate: true })}
          />
        </div>
        {errors.emailOrPhone && (
          <p className="text-destructive text-sm mt-1">{errors.emailOrPhone.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.login.passwordLabel}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder={t.auth.login.passwordPlaceholder}
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

      {/* Remember Me */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember-me"
          className="w-4 h-4 rounded border-primary/30 bg-surface-container-lowest text-primary focus:ring-primary focus:ring-offset-0"
        />
        <label htmlFor="remember-me" className="text-sm text-on-surface-variant cursor-pointer select-none">
          {t.auth.login.rememberMe}
        </label>
      </div>

      {/* Submit Button - Primary with gradient gold */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary text-primary-foreground rounded-full py-3 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.common.loading}
          </>
        ) : (
          t.auth.login.loginButton
        )}
      </Button>
    </form>
  );
}
