'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { getClientSessionStorage, setPreviousRoute } from '@/lib/route-history'

export function RouteHistoryTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastRouteRef = useRef<string | null>(null)

  useEffect(() => {
    const storage = getClientSessionStorage()
    if (!storage) {
      return
    }

    const query = searchParams.toString()
    const currentRoute = query ? `${pathname}?${query}` : pathname

    if (lastRouteRef.current && lastRouteRef.current !== currentRoute) {
      setPreviousRoute(storage, lastRouteRef.current)
    }

    lastRouteRef.current = currentRoute
  }, [pathname, searchParams])

  return null
}
