'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { type ReactNode, Suspense } from 'react'

import { useRouteTracking } from '@/hooks/use-back-navigation'
import { Toaster } from '@/components/toaster-notifier'

function RouteTracker() {
  useRouteTracking()
  return null
}

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <Suspense>
        <RouteTracker />
      </Suspense>
      {children}
      <Toaster />
    </ChakraProvider>
  )
}
