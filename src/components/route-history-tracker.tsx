'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { trackRouteVisit } from '@/components/docente-route-history'

export function RouteHistoryTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.toString()
    const currentRoute = query ? `${pathname}?${query}` : pathname

    trackRouteVisit(window.sessionStorage, currentRoute)
  }, [pathname, searchParams])

  return null
}
