'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useLanguage } from '@/hooks/useLanguage';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleSuccess = () => {
    router.push('/login?registered=true');
  };

  return (
    <AuthLayout
      title={t.auth.register.title}
      subtitle={t.auth.register.subtitle}
    >
      <RegisterForm onSuccess={handleSuccess} />

      <div className="mt-6 text-center">
        <p className="text-on-surface-variant font-body">
          {t.auth.register.hasAccount}{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            {t.auth.register.loginLink}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
