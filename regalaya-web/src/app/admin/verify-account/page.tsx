'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Loader2, Shield, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';

function AdminVerifyAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Token ou email ausente.');
      return;
    }

    const verify = async () => {
      try {
        await authService.validateEmail({ token, email });
        setStatus('success');
        setMessage('Conta verificada com sucesso!');
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Falha na verificação.');
      }
    };

    verify();
  }, [token, email]);

  if (status === 'loading') {
    return (
      <AuthLayout title="Verificando Conta" subtitle="Aguarde...">
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={status === 'success' ? 'Conta Verificada' : 'Falha na Verificação'}
      subtitle={message}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          status === 'success' ? 'bg-success/10' : 'bg-destructive/10'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="w-8 h-8 text-success" />
          ) : (
            <XCircle className="w-8 h-8 text-destructive" />
          )}
        </div>

        <div className="flex flex-col w-full space-y-3">
          <Link
            href="/admin/login"
            className="w-full bg-primary text-primary-foreground rounded-full py-3 text-center font-medium hover:bg-primary/90 transition-colors"
          >
            Ir para Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function AdminVerifyAccountPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="" subtitle="">
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    }>
      <AdminVerifyAccountContent />
    </Suspense>
  );
}
