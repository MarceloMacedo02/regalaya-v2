"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Shield, Lock, TrendingUp, Users } from "lucide-react"
import type { Role } from "@/types/rbac"
import { ROLE_HIERARCHY } from "@/types/rbac"

interface RoleHierarchyProps {
  roles: Role[]
}

export function RoleHierarchy({ roles }: RoleHierarchyProps) {
  const getRoleLevel = (roleId: string) => {
    return ROLE_HIERARCHY.find(h => h.role === roleId)?.level || 0
  }

  const getInheritsFrom = (roleId: string) => {
    return ROLE_HIERARCHY.find(h => h.role === roleId)?.inheritsFrom || []
  }

  const sortedRoles = [...roles].sort((a, b) => {
    return getRoleLevel(b.id) - getRoleLevel(a.id)
  })

  const maxLevel = Math.max(...roles.map(r => getRoleLevel(r.id)))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Hierarquia de Roles
        </CardTitle>
        <CardDescription>
          Visualize a estrutura hierárquica e herança de permissões
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Visual Hierarchy */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute left-8 top-4 bottom-4 w-px bg-border" />
            
            <div className="space-y-6">
              {sortedRoles.map((role, index) => {
                const level = getRoleLevel(role.id)
                const inheritsFrom = getInheritsFrom(role.id)
                const isSystem = role.isSystem || false

                return (
                  <div key={role.id} className="relative flex items-start gap-4">
                    {/* Level Indicator */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg ${
                          level === maxLevel
                            ? "bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-300 text-white"
                            : level === maxLevel - 1
                            ? "bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-300 text-white"
                            : level === maxLevel - 2
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-300 text-white"
                            : "bg-gradient-to-br from-orange-500 to-amber-600 border-orange-300 text-white"
                        }`}
                      >
                        <Shield className="h-7 w-7" />
                      </div>
                      {index < sortedRoles.length - 1 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-px h-6 bg-border" />
                      )}
                    </div>

                    {/* Role Card */}
                    <div className="flex-1 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{role.name}</h4>
                            {isSystem && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Role do sistema - não pode ser excluída</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {role.description}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <Badge variant="outline">
                              Nível {level}
                            </Badge>
                            <Badge variant="secondary">
                              {role.permissions.length} permissões
                            </Badge>
                            {inheritsFrom.length > 0 && (
                              <Badge variant="outline" className="gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Herda: {inheritsFrom.join(", ")}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {role.permissions.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Permissões
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="border-t pt-4 mt-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Legenda
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sortedRoles.map(role => {
                const level = getRoleLevel(role.id)
                return (
                  <div key={role.id} className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        level === maxLevel
                          ? "bg-purple-500"
                          : level === maxLevel - 1
                          ? "bg-blue-500"
                          : level === maxLevel - 2
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                    />
                    <span>{role.name} (Nível {level})</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <h4 className="font-semibold mb-2">Como funciona a hierarquia?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Roles de nível mais alto herdam permissões de níveis inferiores</li>
              <li>• Super Admin (Nível 4) tem acesso a todas as funcionalidades</li>
              <li>• Roles do sistema (cadeado) não podem ser excluídas</li>
              <li>• Você pode criar roles customizadas com permissões específicas</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
