"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
  isLast?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items
    if (!pathname) return []

    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    let currentPath = ""
    for (const segment of segments) {
      currentPath += `/${segment}`
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isLast: currentPath === pathname,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length === 0) return null

  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)}>
      <Link
        href="/"
        className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-zinc-400" />
          {crumb.isLast ? (
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
