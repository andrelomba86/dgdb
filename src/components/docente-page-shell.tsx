import NextLink from 'next/link'
import type { ReactNode } from 'react'

import { Box, Container, Flex, Heading, HStack, Link, Text } from '@chakra-ui/react'

import { logoutAction } from '@/actions/auth-actions'
import { PendingSubmitButton } from '@/components/pending-submit-button'

type DocentePageShellProps = {
  badge: string
  title: string
  children: ReactNode
}

export function DocentePageShell({ badge, title, children }: DocentePageShellProps) {
  return (
    <Box
      as="main"
      minH="100vh"
      py={{ base: '15px', md: '32px' }}
      px={{ base: '7px', md: '24px' }}
      bg="radial-gradient(circle at bottom, rgba(20, 184, 166, 0.16), transparent 25%), linear-gradient(180deg, #f5fffa 0%, #e0fef2 100%)">
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
          </Flex>

          {children}
        </Box>
      </Container>
    </Box>
  )
}
