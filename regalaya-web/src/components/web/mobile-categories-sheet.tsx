'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'

interface MobileCategoriesSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileCategoriesSheet({ isOpen, onClose }: MobileCategoriesSheetProps) {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[#e8e4e0] bg-white px-4 py-3">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Categorias</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <Sidebar />
        </div>
      </div>
    </>
  )
}
