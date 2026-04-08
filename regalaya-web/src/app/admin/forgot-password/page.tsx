'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ToastAction } from '@/components/ui/toast';
import { authService } from '@/services/auth.service';

function AdminForgotPasswordContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsSubmitting(true);

    try {
      await authService.forgotPassword(data);
      setIsSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar solicitação';

      const errorToast = toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
        action: (
          <ToastAction altText="Fechar" onClick={() => errorToast.dismiss()}>
            Fechar
          </ToastAction>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Email Enviado"
        subtitle="Se o email existir, você receberá as instruções."
      >
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={() => router.push('/admin/login')}
            className="w-full bg-primary text-primary-foreground rounded-full py-3"
          >
            Voltar ao Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Recuperar Senha Admin"
      subtitle="Digite seu email para receber as instruções"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-label-sm text-on-surface-variant mb-2 block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              {...register('email', { required: 'Email é obrigatório' })}
              type="email"
              placeholder="admin@regalaya.com"
              className="bg-surface-container-low border-0 rounded-md pl-10 py-3 text-foreground placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all"
              style={{ borderBottom: '1px solid rgba(209, 197, 180, 0.2)' }}
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
              Enviando...
            </>
          ) : (
            'Enviar Instruções'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/admin/login" className="text-sm text-primary hover:underline font-body">
          ← Voltar ao Login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function AdminForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    }>
      <AdminForgotPasswordContent />
    </Suspense>
  );
}
