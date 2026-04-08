"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown, Shield, Lock, UserCog } from "lucide-react"
import type { Permission, PermissionCategory, Role } from "@/types/rbac"
import { DEFAULT_PERMISSIONS, ROLE_HIERARCHY } from "@/types/rbac"

interface PermissionMatrixProps {
  roles: Role[]
  onPermissionsChange?: (roleId: string, permissions: Permission[]) => void
}

const CATEGORIES: { value: PermissionCategory; label: string; icon: string }[] = [
  { value: "dashboard", label: "Dashboard", icon: "📊" },
  { value: "products", label: "Produtos", icon: "📦" },
  { value: "categories", label: "Categorias", icon: "🏷️" },
  { value: "orders", label: "Pedidos", icon: "🛒" },
  { value: "customers", label: "Clientes", icon: "👥" },
  { value: "banners", label: "Banners", icon: "🖼️" },
  { value: "users", label: "Usuários", icon: "👤" },
  { value: "settings", label: "Configurações", icon: "⚙️" },
  { value: "reports", label: "Relatórios", icon: "📈" },
]

const ACTIONS: { value: "view" | "create" | "edit" | "delete"; label: string; color: string }[] = [
  { value: "view", label: "Ver", color: "bg-blue-100 text-blue-800" },
  { value: "create", label: "Criar", color: "bg-green-100 text-green-800" },
  { value: "edit", label: "Editar", color: "bg-yellow-100 text-yellow-800" },
  { value: "delete", label: "Excluir", color: "bg-red-100 text-red-800" },
]

export function PermissionMatrix({ roles, onPermissionsChange }: PermissionMatrixProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["dashboard"])
  const [selectedRole, setSelectedRole] = useState<string>(roles[0]?.id || "")

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const selectedRoleData = roles.find(r => r.id === selectedRole)
  const selectedRolePermissions = selectedRoleData?.permissions || []

  const hasPermission = (category: PermissionCategory, action: "view" | "create" | "edit" | "delete") => {
    return selectedRolePermissions.some(
      p => p.category === category && p.action === action
    )
  }

  const handlePermissionToggle = (category: PermissionCategory, action: "view" | "create" | "edit" | "delete") => {
    if (!selectedRoleData || !onPermissionsChange) return

    const currentPermission = DEFAULT_PERMISSIONS.find(
      p => p.category === category && p.action === action
    )
    if (!currentPermission) return

    const hasCurrent = hasPermission(category, action)
    const newPermissions = hasCurrent
      ? selectedRolePermissions.filter(
          p => !(p.category === category && p.action === action)
        )
      : [...selectedRolePermissions, currentPermission]

    onPermissionsChange(selectedRole, newPermissions)
  }

  const handleSelectAll = (category: PermissionCategory) => {
    if (!selectedRoleData || !onPermissionsChange) return

    const categoryPermissions = DEFAULT_PERMISSIONS.filter(p => p.category === category)
    const hasAll = ACTIONS.every(({ value }) => hasPermission(category, value))

    const newPermissions = hasAll
      ? selectedRolePermissions.filter(p => p.category !== category)
      : [...selectedRolePermissions.filter(p => p.category !== category), ...categoryPermissions]

    onPermissionsChange(selectedRole, newPermissions)
  }

  const getRoleLevel = (roleId: string) => {
    return ROLE_HIERARCHY.find(h => h.role === roleId)?.level || 0
  }

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Matriz de Permissões
          </CardTitle>
          <CardDescription>
            Selecione uma role para visualizar e editar suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <Button
                key={role.id}
                variant={selectedRole === role.id ? "default" : "outline"}
                onClick={() => setSelectedRole(role.id)}
                className="relative"
              >
                {role.name}
                {role.isSystem && (
                  <Lock className="h-3 w-3 ml-2 opacity-50" />
                )}
                <Badge variant="secondary" className="ml-2 text-xs">
                  Nível {getRoleLevel(role.id)}
                </Badge>
              </Button>
            ))}
          </div>
          {selectedRoleData && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">{selectedRoleData.name}</p>
              <p className="text-sm text-muted-foreground">{selectedRoleData.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">
                  {selectedRolePermissions.length} permissões
                </Badge>
                {selectedRoleData.isSystem && (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Sistema
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Permissões por Categoria</CardTitle>
          <CardDescription>
            Expanda cada categoria para gerenciar permissões específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {CATEGORIES.map(({ value, label, icon }) => {
            const isExpanded = expandedCategories.includes(value)
            const categoryActions = ACTIONS.map(a => ({
              ...a,
              enabled: hasPermission(value, a.value),
            }))
            const allEnabled = ACTIONS.every(({ value: action }) =>
              hasPermission(value, action)
            )

            return (
              <Collapsible
                key={value}
                open={isExpanded}
                onOpenChange={() => toggleCategory(value)}
              >
                <div className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{icon}</span>
                        <span className="font-medium">{label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {categoryActions.filter(a => a.enabled).length}/{ACTIONS.length}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectAll(value)
                          }}
                          className="text-xs h-7"
                        >
                          {allEnabled ? "Desmarcar Todas" : "Marcar Todas"}
                        </Button>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Permissão</TableHead>
                          {ACTIONS.map(({ value, label, color }) => (
                            <TableHead key={value} className="text-center">
                              <Badge className={color}>{label}</Badge>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {DEFAULT_PERMISSIONS.filter(p => p.category === value).map(permission => (
                          <TableRow key={`${permission.category}-${permission.action}`}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{permission.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {permission.description}
                                </p>
                              </div>
                            </TableCell>
                            {ACTIONS.map(({ value: action }) => {
                              const isEnabled = hasPermission(permission.category, action)
                              const isSystemLocked = selectedRoleData?.isSystem && 
                                !DEFAULT_PERMISSIONS.some(
                                  p => p.category === permission.category && p.action === action
                                ) && selectedRoleData.permissions.some(
                                  p => p.category === permission.category && p.action === action
                                )

                              return (
                                <TableCell key={action} className="text-center">
                                  <div className="flex justify-center">
                                    <Switch
                                      checked={isEnabled}
                                      onCheckedChange={() => handlePermissionToggle(permission.category, action)}
                                      disabled={isSystemLocked}
                                    />
                                  </div>
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
