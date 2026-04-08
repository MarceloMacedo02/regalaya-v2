'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SecurityPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const securityTips = [
    {
      icon: Lock,
      title: 'Senha Forte',
      description: 'Use pelo menos 8 caracteres com letras, números e símbolos',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: AlertCircle,
      title: 'Não Compartilhe',
      description: 'Nunca compartilhe sua senha com outras pessoas',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: CheckCircle,
      title: 'Atualize Regularmente',
      description: 'Troque sua senha a cada 3-6 meses',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Segurança da Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas configurações de segurança e senha
        </p>
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Status de Segurança</CardTitle>
              <CardDescription>
                Sua conta está protegida com autenticação tradicional
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Conta segura</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Última verificação: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Key className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Atualize sua senha para manter sua conta segura
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <CardTitle>Dicas de Segurança</CardTitle>
              <CardDescription>
                Melhores práticas para proteger sua conta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {securityTips.map((tip) => (
              <div
                key={tip.title}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-full ${tip.bgColor} flex items-center justify-center mb-3`}>
                  <tip.icon className={`h-5 w-5 ${tip.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais e preferências
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{user?.username || 'Não informado'}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline" asChild>
                <Link href="/account/profile">
                  Editar Perfil
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
