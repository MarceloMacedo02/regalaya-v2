'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2 } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [isValidating, setIsValidating] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/forgot-password?error=missing_token');
      return;
    }
    setIsValidating(false);
  }, [token, router]);

  if (isValidating) {
    return (
      <AuthLayout
        title={t.auth.resetPassword.title}
        subtitle={t.auth.resetPassword.subtitle}
      >
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  const handleSuccess = () => {
    router.push('/login?password-reset=true');
  };

  return (
    <AuthLayout
      title={t.auth.resetPassword.title}
      subtitle={t.auth.resetPassword.subtitle}
    >
      <ResetPasswordForm token={token ?? ''} onSuccess={handleSuccess} />

      <div className="mt-8 text-center">
        <Link href="/login" className="text-sm text-primary hover:underline font-body">
          ← {t.common.back}
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="" subtitle="">
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
