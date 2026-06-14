'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const PREVIOUS_STORAGE_KEY = 'dgdb.previousPages'

function readPreviousPages(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(PREVIOUS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writePreviousPages(obj: Record<string, string>) {
  sessionStorage.setItem(PREVIOUS_STORAGE_KEY, JSON.stringify(obj))
}

export function setPrevious(actionKey: string, route: string) {
  const pages = readPreviousPages()
  pages[actionKey] = route
  writePreviousPages(pages)
}

export function getPrevious(actionKey: string): string | null {
  const pages = readPreviousPages()
  return pages[actionKey] ?? null
}

export function clearPrevious(actionKey?: string) {
  if (!actionKey) {
    try {
      sessionStorage.removeItem(PREVIOUS_STORAGE_KEY)
    } catch {
      // ignore
    }
    return
  }
  const pages = readPreviousPages()
  if (pages && Object.prototype.hasOwnProperty.call(pages, actionKey)) {
    delete pages[actionKey]
    writePreviousPages(pages)
  }
}

export function useRegisterPrevious(actionKey: string) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return useCallback(() => {
    try {
      const query = searchParams.toString()
      const route = query ? `${pathname}?${query}` : pathname
      setPrevious(actionKey, route)
    } catch {
      // noop
    }
  }, [actionKey, pathname, searchParams])
}

export function useGoBack(actionKey?: string, fallbackHref = '/docentes') {
  const router = useRouter()

  const goBack = useCallback(() => {
    try {
      const previous = actionKey ? getPrevious(actionKey) : null
      if (previous) {
        clearPrevious(actionKey)
        router.push(previous)
      } else {
        router.push(fallbackHref)
      }
    } catch {
      router.push(fallbackHref)
    }
  }, [router, actionKey, fallbackHref])

  return goBack
}
