"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AdminPageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action && (
        <Button onClick={action.onClick} className="btn-elegant gap-2">
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface AdminStatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: string
    positive: boolean
  }
}

export function AdminStatCard({ label, value, icon, trend }: AdminStatCardProps) {
  return (
    <div className="admin-stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        {icon && <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend && (
        <div className={`text-sm font-medium mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.value}
        </div>
      )}
    </div>
  )
}

interface AdminFilterBarProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: {
    label: string
    value: string
    options: { label: string; value: string }[]
    onChange: (value: string) => void
  }[]
  children?: ReactNode
}

export function AdminFilterBar({ searchPlaceholder = "Buscar...", searchValue, onSearchChange, filters, children }: AdminFilterBarProps) {
  return (
    <div className="admin-card">
      <div className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 px-4 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all"
            />
          </div>
          {filters && (
            <div className="flex gap-2">
              {filters.map((filter, index) => (
                <select
                  key={index}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none"
                >
                  <option value="all">{filter.label}</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ))}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

interface AdminTableProps {
  children: ReactNode
}

export function AdminTable({ children }: AdminTableProps) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {children}
        </table>
      </div>
    </div>
  )
}

export function AdminTableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-gray-50">
      {children}
    </thead>
  )
}

export function AdminTableBody({ children }: { children: ReactNode }) {
  return (
    <tbody className="divide-y divide-gray-100">
      {children}
    </tbody>
  )
}

export function AdminTableCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-sm text-gray-600 ${className}`}>
      {children}
    </td>
  )
}

export function AdminTableHead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide ${className}`}>
      {children}
    </th>
  )
}

export function AdminTableRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`}>
      {children}
    </tr>
  )
}