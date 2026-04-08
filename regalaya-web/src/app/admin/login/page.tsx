'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { Shield } from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';

  const handleSuccess = () => {
    window.location.href = from;
  };

  return (
    <AuthLayout
      title="Admin Login"
      subtitle="Acesso restrito ao painel administrativo"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
      </div>

      <LoginForm onSuccess={handleSuccess} />

      <div className="mt-6 text-center">
        <Link href="/admin/forgot-password" className="text-sm text-primary hover:underline font-body">
          Esqueceu a senha?
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
