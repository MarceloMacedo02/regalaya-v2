'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const registered = searchParams.get('registered') === 'true';

  const handleSuccess = () => {
    window.location.href = '/account';
  };

  return (
    <AuthLayout
      title={t.auth.login.title}
      subtitle={t.auth.login.subtitle}
    >
      {registered && (
        <div className="bg-success/10 text-success p-3 rounded-lg mb-6 text-sm font-body">
          {t.auth.login.registeredSuccess}
        </div>
      )}

      <LoginForm onSuccess={handleSuccess} />
      
      <div className="mt-6 text-right">
        <Link href="/forgot-password" className="text-sm text-primary hover:underline font-body">
          {t.auth.login.forgotPassword}
        </Link>
      </div>

      {/* No-Divider: Using spacing instead */}
      <div className="mt-8">
        <p className="text-center text-on-surface-variant font-body">
          {t.auth.login.noAccount}{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            {t.auth.login.createAccount}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
