"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const [activePage, setActivePage] = useState(currentPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page)
      onPageChange(page)
    }
  }

  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={activePage === 1}
          onClick={() => goToPage(activePage - 1)}
        >
          Anterior
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant="outline"
            size="sm"
            className={activePage === page ? "bg-primary text-primary-foreground" : ""}
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={activePage === totalPages}
          onClick={() => goToPage(activePage + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}