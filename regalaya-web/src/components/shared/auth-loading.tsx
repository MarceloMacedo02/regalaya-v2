"use client"

import { Loader2 } from "lucide-react"

interface AuthLoadingProps {
  message?: string
}

export function AuthLoading({ message = "Verificando autenticação..." }: AuthLoadingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  )
}
