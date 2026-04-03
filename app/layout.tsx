import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'DGDB',
  description: 'Sistema interno de cadastro de docentes.',
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body style={{ margin: 0, minHeight: '100vh', background: '#f3f4f6', color: '#111827' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
