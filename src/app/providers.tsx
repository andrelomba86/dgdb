'use client'

import { ChakraProvider, createSystem, defaultConfig, Theme } from '@chakra-ui/react'

import { ProviderProps } from '@/types'
import { config } from './styles'
import { ServiceProvider, StateProvider } from '@/app/contexts'

const system = createSystem(defaultConfig, config)

export function Providers({ children }: ProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ServiceProvider>
        <StateProvider>
          <Theme backgroundColor="transparent">{children}</Theme>/
        </StateProvider>
      </ServiceProvider>
    </ChakraProvider>
  )
}
