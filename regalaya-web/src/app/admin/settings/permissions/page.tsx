"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, TrendingUp, UserCog, Save, Plus, Edit, Trash2 } from "lucide-react"
import { PermissionMatrix } from "@/components/admin/permission-matrix"
import { RoleHierarchy } from "@/components/admin/role-hierarchy"
import { UserPermissionPreview } from "@/components/admin/user-permission-preview"
import { DEFAULT_ROLES, type Role, type Permission } from "@/types/rbac"
import { useToast } from "@/hooks/use-toast"
import { users } from "@/lib/mock-data"

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES)
  const { toast } = useToast()

  const handlePermissionsChange = (roleId: string, newPermissions: Permission[]) => {
    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.id === roleId
          ? { ...role, permissions: newPermissions, updatedAt: new Date().toISOString() }
          : role
      )
    )
  }

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: "Permissões salvas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7" />
            Gestão de Permissões (RBAC)
          </h1>
          <p className="text-muted-foreground">
            Gerencie roles, permissões e hierarquia de acesso
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Controle de Acesso Baseado em Roles</h3>
              <p className="text-sm text-blue-700 mt-1">
                O sistema RBAC permite gerenciar permissões de forma granular, atribuindo-as a roles
                que são então associadas aos usuários. Isso facilita a administração de acesso em larga escala.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="matrix" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="matrix" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Matriz de Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Hierarquia de Roles</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Preview por Usuário</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Matriz de Permissões */}
        <TabsContent value="matrix" className="space-y-4">
          <PermissionMatrix
            roles={roles}
            onPermissionsChange={handlePermissionsChange}
          />
        </TabsContent>

        {/* Tab: Hierarquia de Roles */}
        <TabsContent value="hierarchy" className="space-y-4">
          <RoleHierarchy roles={roles} />
          
          {/* Create New Role Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criar Nova Role
              </CardTitle>
              <CardDescription>
                Crie uma role customizada com permissões específicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 space-y-2 w-full">
                  <p className="text-sm text-muted-foreground">
                    Roles customizadas permitem criar perfis de acesso específicos para suas necessidades.
                    Você pode definir exatamente quais permissões cada role terá.
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Role Customizada
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Preview por Usuário */}
        <TabsContent value="preview" className="space-y-4">
          <UserPermissionPreview users={users} roles={roles} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
