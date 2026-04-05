import { logoutAction } from '@/actions/auth-actions'
import { Box, Flex, Grid, Heading, Link, Text } from '@chakra-ui/react'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { requireAuthenticatedUser } from '@/lib/auth-guard'
import NextLink from 'next/link'

export default async function HomePage() {
  const user = await requireAuthenticatedUser()

  return (
    <Box
      as="main"
      minH="100vh"
      py={{ base: '24px', md: '32px' }}
      px={{ base: '12px', md: '24px' }}
      bg="radial-gradient(circle at top left, rgba(29, 78, 216, 0.14), transparent 25%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)">
      <Box
        as="section"
        maxW="980px"
        mx="auto"
        bg="#fff"
        border="1px solid #dbeafe"
        borderRadius="24px"
        boxShadow="0 20px 60px rgba(15, 23, 42, 0.1)"
        p={{ base: '16px', md: '28px' }}>
        <Flex as="header" justify="space-between" gap="16px" align="flex-start" wrap="wrap" mb="24px">
          <Box>
            <Text m="0" fontSize="0.92rem" fontWeight="700" color="teal">
              Painel principal
            </Text>
            <Heading m="8px 0 6px" fontSize="2rem">
              DGDB
            </Heading>
            <Text m="0" color="#475569">
              Usuário autenticado: {user.nome}
            </Text>
          </Box>

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
        </Flex>

        <Grid as="section" templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap="16px">
          <Link
            as={NextLink}
            href="/docentes"
            display="block"
            p="22px"
            borderRadius="20px"
            textDecoration="none"
            color="#0f172a"
            border="1px solid #dbeafe"
            bg="linear-gradient(180deg, #ffffff 0%, #effff6 100%)">
            <Text color="teal" fontWeight="700" mb="8px">
              Docentes
            </Text>
            <Text fontSize="1.15rem" fontWeight="700" mb="6px">
              Acessar cadastro de docentes
            </Text>
            <Text color="#475569">
              Consulte, filtre, exporte e mantenha registros com dados relacionados.
            </Text>
          </Link>
        </Grid>
      </Box>
    </Box>
  )
}
