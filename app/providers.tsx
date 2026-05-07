'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import type { ReactNode } from 'react'

import { RouteHistoryTracker } from '@/components/route-history-tracker'
import { Toaster } from '@/components/toaster-notifier'

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <RouteHistoryTracker />
      {children}
      <Toaster />
    </ChakraProvider>
  )
}
