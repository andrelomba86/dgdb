'use client'

import { ChakraProvider, createSystem, defaultConfig, Theme } from '@chakra-ui/react'

import { ProviderProps } from '@/types'
import { config } from './styles'
import { ServiceProvider } from '@/app/context/ServiceContext'
const system = createSystem(defaultConfig, config)

export function Providers({ children }: ProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ServiceProvider>
        <Theme backgroundColor="transparent">{children}</Theme>
      </ServiceProvider>
    </ChakraProvider>
  )
}
