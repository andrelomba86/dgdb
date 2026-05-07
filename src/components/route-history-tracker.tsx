'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { getClientSessionStorage, trackRouteVisit } from '@/lib/route-history'

export function RouteHistoryTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const storage = getClientSessionStorage()
    if (!storage) {
      return
    }

    const query = searchParams.toString()
    const currentRoute = query ? `${pathname}?${query}` : pathname

    trackRouteVisit(storage, currentRoute)
  }, [pathname, searchParams])

  return null
}
