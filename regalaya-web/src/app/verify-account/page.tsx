'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

enum VerificationState {
  VERIFYING = 'verifying',
  SUCCESS = 'success',
  ERROR = 'error',
}

function VerifyAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [state, setState] = useState<VerificationState>(VerificationState.VERIFYING);
  const [message, setMessage] = useState('');

  const verifyToken = useCallback(async (token: string) => {
    try {
      const result = await authService.validateEmail({
        token,
        email: searchParams.get('email') || '',
      });

      if (result.valid) {
        setState(VerificationState.SUCCESS);
        setMessage(result.message || 'Conta verificada com sucesso!');
        toast({
          title: 'Conta verificada!',
          description: 'Sua conta foi ativada com sucesso.',
        });

        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } else {
        setState(VerificationState.ERROR);
        setMessage(result.message || 'Token de verificação inválido');
      }
    } catch (err) {
      setState(VerificationState.ERROR);
      setMessage('Não foi possível verificar a conta. O token pode estar expirado.');
      toast({
        variant: 'destructive',
        title: 'Erro na verificação',
        description: 'Não foi possível verificar sua conta.',
      });
    }
  }, [searchParams, router, toast]);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setState(VerificationState.ERROR);
      setMessage('Token de verificação não fornecido');
      return;
    }

    verifyToken(token);
  }, [searchParams, verifyToken]);

  return (
    <AuthLayout
      title={t.auth.verifyAccount?.title || 'Verificar Conta'}
      subtitle={t.auth.verifyAccount?.subtitle || 'Confirmando sua conta...'}
    >
      <div className="flex flex-col items-center justify-center py-8">
        {state === VerificationState.VERIFYING && (
          <>
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[var(--regalaya-pink)]/30 border-t-[var(--regalaya-pink)] mb-6" />
            <p className="text-[var(--regalaya-text)] text-center font-body">
              Verificando sua conta...
            </p>
          </>
        )}

        {state === VerificationState.SUCCESS && (
          <>
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 text-center font-body font-medium mb-4">
              {message}
            </p>
            <p className="text-[var(--regalaya-text)] text-sm text-center font-body">
              Redirecionando para o login...
            </p>
          </>
        )}

        {state === VerificationState.ERROR && (
          <>
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 text-center font-body font-medium mb-4">
              {message}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                href="/login"
                className="bg-[var(--regalaya-pink)] text-white px-6 py-3 rounded-full text-xs font-bold uppercase hover:bg-[var(--regalaya-pink)]/90 transition-colors duration-200 text-center"
              >
                Ir para Login
              </Link>
              <Link
                href="/register"
                className="bg-white border border-[var(--surface-dim)] text-[var(--regalaya-dark)] px-6 py-3 rounded-full text-xs font-bold uppercase hover:border-[var(--regalaya-pink)] hover:text-[var(--regalaya-pink)] transition-colors duration-200 text-center"
              >
                Criar Nova Conta
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/login" className="text-sm text-primary hover:underline font-body">
          ← {t.common.back}
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Verificar Conta" subtitle="Confirmando sua conta...">
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--regalaya-pink)]/30 border-t-[var(--regalaya-pink)]" />
        </div>
      </AuthLayout>
    }>
      <VerifyAccountContent />
    </Suspense>
  );
}
