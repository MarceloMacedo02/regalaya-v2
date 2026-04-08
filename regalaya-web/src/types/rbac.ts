// RBAC (Role-Based Access Control) Types

export type PermissionCategory =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "banners"
  | "users"
  | "settings"
  | "reports"

export type PermissionAction = "view" | "create" | "edit" | "delete"

export interface Permission {
  category: PermissionCategory
  action: PermissionAction
  label: string
  description: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem?: boolean // System roles cannot be deleted
  createdAt: string
  updatedAt: string
}

export interface RoleHierarchy {
  role: string
  level: number
  inheritsFrom?: string[]
}

export interface UserPermissionPreview {
  userId: string
  userName: string
  userRole: string
  permissions: Permission[]
  effectivePermissions: Permission[] // Including inherited
}

// Matriz de permissões por role
export interface PermissionMatrix {
  roleId: string
  roleName: string
  permissions: {
    [key in PermissionCategory]?: {
      [key in PermissionAction]?: boolean
    }
  }
}

// Permissões padrão do sistema
export const DEFAULT_PERMISSIONS: Permission[] = [
  // Dashboard
  { category: "dashboard", action: "view", label: "Ver Dashboard", description: "Acessar o dashboard principal" },
  
  // Products
  { category: "products", action: "view", label: "Ver Produtos", description: "Listar e visualizar produtos" },
  { category: "products", action: "create", label: "Criar Produtos", description: "Adicionar novos produtos" },
  { category: "products", action: "edit", label: "Editar Produtos", description: "Modificar produtos existentes" },
  { category: "products", action: "delete", label: "Excluir Produtos", description: "Remover produtos" },
  
  // Categories
  { category: "categories", action: "view", label: "Ver Categorias", description: "Listar e visualizar categorias" },
  { category: "categories", action: "create", label: "Criar Categorias", description: "Adicionar novas categorias" },
  { category: "categories", action: "edit", label: "Editar Categorias", description: "Modificar categorias existentes" },
  { category: "categories", action: "delete", label: "Excluir Categorias", description: "Remover categorias" },
  
  // Orders
  { category: "orders", action: "view", label: "Ver Pedidos", description: "Listar e visualizar pedidos" },
  { category: "orders", action: "create", label: "Criar Pedidos", description: "Adicionar novos pedidos" },
  { category: "orders", action: "edit", label: "Editar Pedidos", description: "Modificar pedidos existentes" },
  { category: "orders", action: "delete", label: "Excluir Pedidos", description: "Cancelar/remover pedidos" },
  
  // Customers
  { category: "customers", action: "view", label: "Ver Clientes", description: "Listar e visualizar clientes" },
  { category: "customers", action: "create", label: "Criar Clientes", description: "Adicionar novos clientes" },
  { category: "customers", action: "edit", label: "Editar Clientes", description: "Modificar dados de clientes" },
  { category: "customers", action: "delete", label: "Excluir Clientes", description: "Remover clientes" },
  
  // Banners
  { category: "banners", action: "view", label: "Ver Banners", description: "Listar e visualizar banners" },
  { category: "banners", action: "create", label: "Criar Banners", description: "Adicionar novos banners" },
  { category: "banners", action: "edit", label: "Editar Banners", description: "Modificar banners existentes" },
  { category: "banners", action: "delete", label: "Excluir Banners", description: "Remover banners" },
  
  // Users
  { category: "users", action: "view", label: "Ver Usuários", description: "Listar e visualizar usuários" },
  { category: "users", action: "create", label: "Criar Usuários", description: "Adicionar novos usuários" },
  { category: "users", action: "edit", label: "Editar Usuários", description: "Modificar usuários existentes" },
  { category: "users", action: "delete", label: "Excluir Usuários", description: "Remover usuários" },
  
  // Settings
  { category: "settings", action: "view", label: "Ver Configurações", description: "Acessar configurações" },
  { category: "settings", action: "edit", label: "Editar Configurações", description: "Modificar configurações do sistema" },
  
  // Reports
  { category: "reports", action: "view", label: "Ver Relatórios", description: "Acessar relatórios" },
]

// Roles padrão do sistema
export const DEFAULT_ROLES: Role[] = [
  {
    id: "superadmin",
    name: "Super Admin",
    description: "Acesso completo a todas as funcionalidades do sistema",
    permissions: DEFAULT_PERMISSIONS,
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "admin",
    name: "Administrador",
    description: "Acesso à maioria das funcionalidades, exceto configurações críticas",
    permissions: DEFAULT_PERMISSIONS.filter(
      p => !(p.category === "settings" && p.action === "edit") && !(p.category === "users" && p.action === "delete")
    ),
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "manager",
    name: "Gerente",
    description: "Gestão de produtos, pedidos e clientes",
    permissions: DEFAULT_PERMISSIONS.filter(
      p => ["dashboard", "products", "categories", "orders", "customers", "banners", "reports"].includes(p.category)
    ),
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "support",
    name: "Suporte",
    description: "Visualização e atendimento a clientes e pedidos",
    permissions: DEFAULT_PERMISSIONS.filter(
      p => ["dashboard", "orders", "customers"].includes(p.category) && ["view", "edit"].includes(p.action)
    ),
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Hierarquia de roles
export const ROLE_HIERARCHY: RoleHierarchy[] = [
  { role: "superadmin", level: 4 },
  { role: "admin", level: 3, inheritsFrom: ["manager"] },
  { role: "manager", level: 2, inheritsFrom: ["support"] },
  { role: "support", level: 1 },
]
