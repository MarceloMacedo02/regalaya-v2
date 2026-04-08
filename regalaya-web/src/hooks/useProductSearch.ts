"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { productsService, type Product } from "@/services/products.service"

interface UseProductSearchOptions {
  debounceMs?: number
  minCharacters?: number
  maxResults?: number
}

interface UseProductSearchResult {
  query: string
  setQuery: (query: string) => void
  results: Product[]
  isLoading: boolean
  isSearching: boolean
  showDropdown: boolean
  setShowDropdown: (show: boolean) => void
  clearSearch: () => void
}

export function useProductSearch(
  options: UseProductSearchOptions = {}
): UseProductSearchResult {
  const {
    debounceMs = 300,
    minCharacters = 2,
    maxResults = 5,
  } = options

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minCharacters) {
        setResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setIsSearching(true)

      try {
        const suggestions = await productsService.getSuggestions(searchQuery)
        setResults(suggestions.slice(0, maxResults))
        setShowDropdown(true)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [minCharacters, maxResults]
  )

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (query.length === 0) {
      setResults([])
      setShowDropdown(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    debounceTimerRef.current = setTimeout(() => {
      performSearch(query)
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, debounceMs, performSearch])

  const clearSearch = useCallback(() => {
    setQuery("")
    setResults([])
    setShowDropdown(false)
    setIsSearching(false)
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    isSearching,
    showDropdown,
    setShowDropdown,
    clearSearch,
  }
}
