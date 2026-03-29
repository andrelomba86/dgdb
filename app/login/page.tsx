import { redirect } from 'next/navigation'

import { Box, Heading, Input, Stack, Text } from '@chakra-ui/react'

import { loginAction } from '@/actions/auth-actions'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { getAuthenticatedUser } from '@/lib/auth-guard'

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getAuthenticatedUser()

  if (user) {
    redirect('/')
  }

  const resolvedSearchParams = await searchParams
  const error = resolvedSearchParams.erro
  const errorMessage = Array.isArray(error) ? error[0] : error

  return (
    <Box
      as="main"
      minH="100vh"
      display="grid"
      placeItems="center"
      p="24px"
      bg="radial-gradient(circle at top, rgba(20, 184, 166, 0.16), transparent 25%), linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%)">
      <Box
        as="section"
        w="100%"
        maxW="460px"
        bg="#fff"
        border="1px solid #dbeafe"
        borderRadius="24px"
        boxShadow="0 20px 60px rgba(15, 23, 42, 0.1)"
        p={{ base: '18px', md: '28px' }}>
        <Text m="0" color="#0f766e" fontSize="0.92rem" fontWeight="700">
          Acesso interno
        </Text>
        <Heading m="8px 0 6px" fontSize="2rem">
          DGDB
        </Heading>
        <Text m="0" color="#475569">
          Faça login para acessar o painel de cadastro e gestão de docentes.
        </Text>

        {errorMessage ? (
          <Box
            mt="18px"
            p="14px 16px"
            borderRadius="14px"
            bg="#fff1f2"
            border="1px solid #fecdd3"
            color="#9f1239">
            {errorMessage}
          </Box>
        ) : null}

        <form action={loginAction}>
          <Stack gap="16px" mt="22px">
            <Box>
              <label htmlFor="login" style={{ fontWeight: 600 }}>
                Login
              </label>
              <Input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                required
                w="100%"
                p="11px 12px"
                border="1px solid #cbd5e1"
                borderRadius="12px"
                mt="6px"
              />
            </Box>

            <Box>
              <label htmlFor="senha" style={{ fontWeight: 600 }}>
                Senha
              </label>
              <Input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                w="100%"
                p="11px 12px"
                border="1px solid #cbd5e1"
                borderRadius="12px"
                mt="6px"
              />
            </Box>

            <PendingSubmitButton
              idleText="Entrar"
              pendingText="Entrando..."
              style={{
                padding: '12px 16px',
                border: 'none',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 14px 32px rgba(20, 184, 166, 0.24)',
              }}
            />
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
