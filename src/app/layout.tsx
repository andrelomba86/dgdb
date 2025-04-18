//TODO: mudar fontes?

// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from './providers'

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

// export const metadata: Metadata = {
//   title: 'DGDB',
//   description: 'Banco de Dados do DG',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}> */}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
