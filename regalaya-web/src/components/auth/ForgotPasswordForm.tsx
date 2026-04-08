'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ToastAction } from '@/components/ui/toast';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { forgotPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);

    try {
      await forgotPassword(data.email);

      setIsSuccess(true);
      
      const successToast = toast({
        title: t.common.success,
        description: t.auth.forgotPassword.success,
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
      setIsSuccess(true);

      const errorToast = toast({
        title: t.common.success,
        description: t.auth.forgotPassword.success,
        variant: 'success',
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

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-success/10 text-success p-4 rounded-lg font-body">
          <p className="font-medium">{t.auth.forgotPassword.success}</p>
          <p className="text-xs mt-2 text-success/70">
            {t.common.close}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="text-label-sm text-on-surface-variant mb-2 block">
          {t.auth.forgotPassword.emailLabel}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            {...register('email')}
            type="email"
            placeholder={t.auth.forgotPassword.emailPlaceholder}
            className="bg-surface-container-low border-0 rounded-md pl-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all"
            style={{
              borderBottom: '1px solid rgba(209, 197, 180, 0.2)',
            }}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && (
          <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
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
            {t.auth.forgotPassword.sending}
          </>
        ) : (
          t.auth.forgotPassword.sendButton
        )}
      </Button>
    </form>
  );
}
