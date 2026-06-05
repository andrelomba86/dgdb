'use client'

import { useCallback, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const ROUTE_STORAGE_KEY = 'dgdb.routeStack'

export function readRouteStack(): string[] {
  try {
    const raw = sessionStorage.getItem(ROUTE_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function writeRouteStack(stack: string[]) {
  sessionStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(stack))
}

export function trackRouteVisit(route: string) {
  const stack = readRouteStack()
  if (stack[stack.length - 1] !== route) {
    stack.push(route)
    writeRouteStack(stack)
  }
}

export function popPreviousRoute(currentRoute: string): string | null {
  const stack = readRouteStack()
  if (stack[stack.length - 1] === currentRoute) {
    stack.pop()
  }
  const previousRoute = stack[stack.length - 1] ?? null
  writeRouteStack(stack)
  return previousRoute
}

export function useRouteTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.toString()
    const route = query ? `${pathname}?${query}` : pathname
    trackRouteVisit(route)
  }, [pathname, searchParams])
}

export function useGoBack(fallbackHref = '/docentes') {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const goBack = useCallback(() => {
    const query = searchParams.toString()
    const currentRoute = query ? `${pathname}?${query}` : pathname
    const previousRoute = popPreviousRoute(currentRoute)
    router.push(previousRoute || fallbackHref)
  }, [pathname, searchParams, router, fallbackHref])

  return goBack
}
