'use client';

import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { useLanguage } from '@/hooks/useLanguage';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      title={t.auth.forgotPassword.title}
      subtitle={t.auth.forgotPassword.subtitle}
    >
      <ForgotPasswordForm />

      <div className="mt-8 text-center">
        <Link href="/login" className="text-sm text-primary hover:underline font-body">
          ← {t.common.back}
        </Link>
      </div>
    </AuthLayout>
  );
}
