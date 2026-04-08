'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const errorMessages: Record<string, { title: string; description: string }> = {
  missing_token: {
    title: 'Token ausente',
    description: 'O token de recuperação não foi fornecido. Solicite um novo link de recuperação de senha.',
  },
  expired_token: {
    title: 'Token expirado',
    description: 'O link de recuperação de senha expirou. Solicite um novo link.',
  },
  invalid_token: {
    title: 'Token inválido',
    description: 'O link de recuperação de senha é inválido. Solicite um novo link.',
  },
  reset_failed: {
    title: 'Falha na recuperação',
    description: 'Não foi possível redefinir sua senha. Tente novamente ou entre em contato com o suporte.',
  },
};

function ResetPasswordErrorContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const error = searchParams.get('error') || 'reset_failed';

  const message = errorMessages[error] || errorMessages.reset_failed;

  return (
    <AuthLayout
      title={message.title}
      subtitle={message.description}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-on-surface">
            {message.title}
          </h2>
          <p className="text-on-surface-variant text-sm">
            {message.description}
          </p>
        </div>

        <div className="flex flex-col w-full space-y-3">
          <Link
            href="/forgot-password"
            className="w-full bg-primary text-primary-foreground rounded-full py-3 text-center font-medium hover:bg-primary/90 transition-colors"
          >
            {'Solicitar novo link'}
          </Link>

          <Link
            href="/login"
            className="w-full border border-outline rounded-full py-3 text-center font-medium text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.common.back}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordErrorPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="" subtitle="">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthLayout>
    }>
      <ResetPasswordErrorContent />
    </Suspense>
  );
}
