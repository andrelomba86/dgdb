import NextLink from 'next/link'
import type { ReactNode } from 'react'

import { Box, Container, Flex, Heading, HStack, Link, Text } from '@chakra-ui/react'

import { logoutAction } from '@/actions/auth-actions'
import { PendingSubmitButton } from '@/components/pending-submit-button'

type DocentePageShellProps = {
  badge: string
  title: string
  errorMessage?: string
  successMessage?: string
  children: ReactNode
}

export function DocentePageShell({
  badge,
  title,
  errorMessage,
  successMessage,
  children,
}: DocentePageShellProps) {
  return (
    <Box
      as="main"
      minH="100vh"
      py={{ base: '24px', md: '32px' }}
      px={{ base: '12px', md: '24px' }}
      bg="radial-gradient(circle at bottom, rgba(20, 184, 166, 0.16), transparent 25%), linear-gradient(180deg, #f5fffa 0%, #e0fef2 100%)"

      //** */
    >
      <Container maxW="5xl">
        <Box
          bg="white"
          border="1px solid #dbeafe"
          borderRadius="20px"
          boxShadow="0 18px 50px rgba(15, 23, 42, 0.08)"
          p={{ base: '16px', md: '28px' }}>
          <Flex justify="space-between" align="flex-start" gap="16px" wrap="wrap" mb="24px">
            <Box>
              <Text m="0" color="teal.600" fontSize="0.9rem" fontWeight="700">
                {badge}
              </Text>
              <Heading m="8px 0 6px" size="2xl">
                {title}
              </Heading>
            </Box>

            <HStack gap="10px" wrap="wrap">
              <Link
                as={NextLink}
                href="/docentes"
                px="14px"
                py="10px"
                borderRadius="999px"
                textDecoration="none"
                color="#0f172a"
                border="1px solid #cbd5e1">
                Voltar
              </Link>
              <form action={logoutAction}>
                <PendingSubmitButton
                  idleText="Sair"
                  pendingText="Saindo..."
                  style={{
                    padding: '10px 14px',
                    borderRadius: '999px',
                    border: '1px solid #fecaca',
                    background: '#fff1f2',
                    color: '#be123c',
                    cursor: 'pointer',
                  }}
                />
              </form>
            </HStack>
          </Flex>

          {successMessage ? (
            <Box
              p="14px 16px"
              mb="14px"
              bg="#ecfdf5"
              color="#065f46"
              border="1px solid #a7f3d0"
              borderRadius="14px">
              {successMessage}
            </Box>
          ) : null}

          {errorMessage ? (
            <Box
              p="14px 16px"
              mb="14px"
              bg="#fff1f2"
              color="#9f1239"
              border="1px solid #fecdd3"
              borderRadius="14px">
              {errorMessage}
            </Box>
          ) : null}

          {children}
        </Box>
      </Container>
    </Box>
  )
}
