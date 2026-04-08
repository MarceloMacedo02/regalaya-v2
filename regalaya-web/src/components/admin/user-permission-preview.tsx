"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, User as UserIcon, Shield, Check, X } from "lucide-react"
import type { User, UserRole } from "@/types/user"
import type { Role, Permission, PermissionCategory } from "@/types/rbac"
import { DEFAULT_PERMISSIONS } from "@/types/rbac"

interface UserPermissionPreviewProps {
  users: User[]
  roles: Role[]
}

const CATEGORIES: { value: PermissionCategory; label: string }[] = [
  { value: "dashboard", label: "Dashboard" },
  { value: "products", label: "Produtos" },
  { value: "categories", label: "Categorias" },
  { value: "orders", label: "Pedidos" },
  { value: "customers", label: "Clientes" },
  { value: "banners", label: "Banners" },
  { value: "users", label: "Usuários" },
  { value: "settings", label: "Configurações" },
  { value: "reports", label: "Relatórios" },
]

export function UserPermissionPreview({ users, roles }: UserPermissionPreviewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock: Get user permissions based on their role
  const getUserPermissions = (userRole: UserRole): Permission[] => {
    const role = roles.find(r => r.id === userRole)
    return role?.permissions || []
  }

  // Check if user has specific permission
  const hasPermission = (permissions: Permission[], category: PermissionCategory, action: "view" | "create" | "edit" | "delete"): boolean => {
    return permissions.some(p => p.category === category && p.action === action)
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRoleFilter === "all" || user.role === selectedRoleFilter
    return matchesSearch && matchesRole
  })

  // Get effective permissions for selected user
  const selectedUserPermissions = selectedUser ? getUserPermissions(selectedUser.role) : []

  return (
    <div className="space-y-6">
      {/* User Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Preview de Permissões por Usuário
          </CardTitle>
          <CardDescription>
            Selecione um usuário para visualizar suas permissões efetivas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow
                      key={user.id}
                      className={`cursor-pointer hover:bg-muted/50 ${selectedUser?.id === user.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name || "Usuário sem nome"}</p>
                          <p className="text-sm text-muted-foreground">{user.email || user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          {roles.find(r => r.id === user.role)?.name || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={selectedUser?.id === user.id ? "default" : "outline"}
                          size="sm"
                        >
                          {selectedUser?.id === user.id ? "Selecionado" : "Ver Permissões"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Selected User Permissions */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Permissões de {selectedUser.name || selectedUser.phone}
                </CardTitle>
                <CardDescription>
                  Role: <Badge variant="outline">{roles.find(r => r.id === selectedUser.role)?.name}</Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{selectedUserPermissions.length}</div>
                <div className="text-sm text-muted-foreground">Permissões totais</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {CATEGORIES.map(({ value, label }) => {
                const categoryPermissions = DEFAULT_PERMISSIONS.filter(p => p.category === value)
                const userHasView = hasPermission(selectedUserPermissions, value, "view")
                const userHasCreate = hasPermission(selectedUserPermissions, value, "create")
                const userHasEdit = hasPermission(selectedUserPermissions, value, "edit")
                const userHasDelete = hasPermission(selectedUserPermissions, value, "delete")

                return (
                  <div key={value} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{label}</h4>
                      <div className="flex gap-1">
                        <Badge variant={userHasView ? "default" : "outline"} className="text-xs">
                          {userHasView ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          Ver
                        </Badge>
                        <Badge variant={userHasCreate ? "default" : "outline"} className="text-xs">
                          {userHasCreate ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          Criar
                        </Badge>
                        <Badge variant={userHasEdit ? "default" : "outline"} className="text-xs">
                          {userHasEdit ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          Editar
                        </Badge>
                        <Badge variant={userHasDelete ? "destructive" : "outline"} className="text-xs">
                          {userHasDelete ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          Excluir
                        </Badge>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      {categoryPermissions.map(permission => {
                        const isEnabled = selectedUserPermissions.some(
                          p => p.category === permission.category && p.action === permission.action
                        )
                        return (
                          <div
                            key={`${permission.category}-${permission.action}`}
                            className={`flex items-center justify-between p-2 rounded text-sm ${
                              isEnabled ? "bg-green-50 text-green-900" : "bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            <span>{permission.label}</span>
                            {isEnabled ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
