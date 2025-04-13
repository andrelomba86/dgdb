'use client'

import { ChakraProvider, createSystem, defaultConfig, Theme } from '@chakra-ui/react'

import { ReactNode } from 'react'
import { config } from './styles'

const system = createSystem(defaultConfig, config)

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChakraProvider value={system}>
      <Theme backgroundColor="transparent">{children}</Theme>
    </ChakraProvider>
  )
}
