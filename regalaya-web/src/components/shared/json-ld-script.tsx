'use client'

import type { JSX } from 'react'

interface JsonLdScriptProps<T> {
  schema: T
}

/**
 * Componente JSON-LD para inserção no head
 * Gera uma tag script com schema.org JSON-LD
 */
export function JsonLdScript<T>({ schema }: JsonLdScriptProps<T>): JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
