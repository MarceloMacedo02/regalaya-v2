'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { useLanguage } from '@/hooks/useLanguage';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { t } = useLanguage();

  const handleSuccess = () => {
    router.push('/login?password-reset=true');
  };

  return (
    <AuthLayout
      title={t.auth.resetPassword.title}
      subtitle={t.auth.resetPassword.subtitle}
    >
      <ResetPasswordForm token={token} onSuccess={handleSuccess} />

      <div className="mt-8 text-center">
        <Link href="/login" className="text-sm text-primary hover:underline font-body">
          ← {t.common.back}
        </Link>
      </div>
    </AuthLayout>
  );
}
