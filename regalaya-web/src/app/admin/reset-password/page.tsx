'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2, Shield } from 'lucide-react';

function AdminResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [isValidating, setIsValidating] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/admin/forgot-password?error=missing_token');
      return;
    }
    setIsValidating(false);
  }, [token, router]);

  if (isValidating) {
    return (
      <AuthLayout title="" subtitle="">
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  const handleSuccess = () => {
    router.push('/admin/login?password-reset=true');
  };

  return (
    <AuthLayout
      title="Redefinir Senha Admin"
      subtitle="Crie uma nova senha para sua conta administrativa"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
      </div>

      <ResetPasswordForm token={token ?? ''} onSuccess={handleSuccess} />

      <div className="mt-8 text-center">
        <Link href="/admin/login" className="text-sm text-primary hover:underline font-body">
          ← Voltar ao Login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="" subtitle="">
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    }>
      <AdminResetPasswordContent />
    </Suspense>
  );
}
