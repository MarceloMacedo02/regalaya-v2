"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Users, UserCheck, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { usersService, type AdminUser } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<AdminUser[] | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await usersService.getAll({ size: 100 })
      setUsers(data.content)
    } catch (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults(null)
      return
    }
    
    try {
      setIsSearching(true)
      const results = await usersService.search(query)
      setSearchResults(results)
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar os usuários.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }, [toast])

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, handleSearch])

  const displayUsers = searchResults !== null ? searchResults : users

  const filteredUsers = displayUsers.filter(user => {
    const nameMatch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    const emailMatch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    const phoneMatch = user.phone?.includes(searchQuery) ?? false
    const matchesSearch = nameMatch || emailMatch || phoneMatch
    const matchesRole = roleFilter === "all" || user.role.toUpperCase() === roleFilter.toUpperCase()
    return matchesSearch && matchesRole
  })

  const getRoleLabel = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": return "Administrador"
      case "MANAGER": return "Gerente"
      case "USER": return "Usuário"
      default: return role
    }
  }

  const getRoleStyle = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": return "bg-purple-100 text-purple-700"
      case "MANAGER": return "bg-blue-100 text-blue-700"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  const adminCount = users.filter(u => u.role?.toUpperCase() === "ADMIN").length
  const managerCount = users.filter(u => u.role?.toUpperCase() === "MANAGER").length
  const userCount = users.filter(u => u.role?.toUpperCase() === "USER").length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie usuários e permissões do sistema</p>
        </div>
        <Button className="btn-elegant gap-2">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total de Usuários</span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Administradores</span>
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600">{adminCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gerentes</span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold">★</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">{managerCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clientes</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{userCount}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 px-4 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none"
            >
              <option value="all">Todos os Roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="MANAGER">Gerente</option>
              <option value="USER">Usuário</option>
            </select>
            {searchResults !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSearchResults(null)
                }}
              >
                Limpar busca
              </Button>
            )}
          </div>
          {searchResults !== null && (
            <p className="text-sm text-muted-foreground mt-2">
              {searchResults.length} resultado(s) encontrado(s)
            </p>
          )}
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Usuário</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Telefone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Criado em</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <Users className="h-10 w-10 mx-auto mb-2" />
                    <p>Nenhum usuário encontrado</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#003566] to-[#00A8E8] flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">{user.name || "Sem nome"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{user.phone || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleStyle(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {user.createdAt ? formatDate(user.createdAt) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#003566]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
