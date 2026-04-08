'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, User, Phone, Loader2, Lock } from 'lucide-react';
import { useValidationSchemas, type RegisterFormData } from '@/hooks/useValidationSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ToastAction } from '@/components/ui/toast';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { registerSchema } = useValidationSchemas();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      lastName: '',
      phoneCountryCode: '',
      phoneAreaCode: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      await registerUser({
        name: data.name,
        lastName: data.lastName,
        phoneCountryCode: data.phoneCountryCode,
        phoneAreaCode: data.phoneAreaCode,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
        confirmPassword: data.password,
      });

      const successToast = toast({
        title: t.auth.register.registeredSuccessTitle,
        description: t.auth.register.welcomeMessage,
        variant: 'success',
        action: (
          <ToastAction
            altText={t.auth.register.close}
            onClick={() => successToast.dismiss()}
          >
            {t.auth.register.close}
          </ToastAction>
        ),
      });

      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.auth.register.registerFailed;

      const errorToast = toast({
        title: t.auth.register.registerFailed,
        description: errorMessage,
        variant: 'destructive',
        action: (
          <ToastAction
            altText={t.auth.register.tryAgain}
            onClick={() => errorToast.dismiss()}
          >
            {t.auth.register.tryAgain}
          </ToastAction>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.register.nameLabel}
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('name')}
            type="text"
            placeholder={t.auth.register.namePlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 transition-all"
            style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
            disabled={isSubmitting}
          />
        </div>
        {errors.name && (
          <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.register.lastNameLabel}
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('lastName')}
            type="text"
            placeholder={t.auth.register.lastNamePlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 transition-all"
            style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
            disabled={isSubmitting}
          />
        </div>
        {errors.lastName && (
          <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Phone - Separated fields */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.register.phoneLabel}
        </label>
        <div className="flex gap-2">
          {/* Country Code */}
          <div className="relative w-20">
            <Input
              {...register('phoneCountryCode')}
              type="text"
              placeholder={t.auth.register.phoneCountryCodePlaceholder}
              className="bg-surface-container-low border-0 rounded-md pl-3 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 text-center"
              style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
              disabled={isSubmitting}
            />
          </div>
          
          {/* DDD */}
          <div className="relative w-20">
            <Input
              {...register('phoneAreaCode')}
              type="text"
              placeholder={t.auth.register.phoneAreaCodePlaceholder}
              className="bg-surface-container-low border-0 rounded-md pl-3 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 text-center"
              style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Phone Number */}
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              {...register('phoneNumber')}
              type="tel"
              placeholder={t.auth.register.phoneNumberPlaceholder}
              className="bg-surface-container-low border-0 rounded-md pl-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 transition-all"
              style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
              disabled={isSubmitting}
            />
          </div>
        </div>
        {(errors.phoneCountryCode || errors.phoneAreaCode || errors.phoneNumber) && (
          <p className="text-destructive text-sm mt-1">
            {errors.phoneCountryCode?.message || errors.phoneAreaCode?.message || errors.phoneNumber?.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.register.emailLabel}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('email')}
            type="email"
            placeholder={t.auth.register.emailPlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 transition-all"
            style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && (
          <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.register.passwordLabel}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder={t.auth.register.passwordPlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 pr-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 transition-all"
            style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
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

      {password && <PasswordStrengthMeter password={password} />}

      {/* Confirm Password */}
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.register.confirmPasswordLabel}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t.auth.register.passwordPlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 pr-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 transition-all"
            style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
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
            {t.auth.register.registering}
          </>
        ) : (
          t.auth.register.registerButton
        )}
      </Button>
    </form>
  );
}
