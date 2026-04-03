import NextLink from 'next/link'

import { HStack, Link } from '@chakra-ui/react'

import { createDocenteAction } from '@/actions/docente-actions'
import { DocenteFormFields } from '@/components/docente-form-fields'
import { DocentePageShell } from '@/components/docente-page-shell'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { requireAuthenticatedUser } from '@/lib/auth-guard'

type NovoDocentePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function NovoDocentePage({ searchParams }: NovoDocentePageProps) {
  const user = await requireAuthenticatedUser()
  const resolvedParams = await searchParams
  const errorMessage = getFirstParam(resolvedParams.erro)

  return (
    <DocentePageShell badge="Novo cadastro" title="Cadastrar docente" errorMessage={errorMessage}>
      <form action={createDocenteAction} style={{ display: 'grid', gap: '18px' }}>
        <DocenteFormFields />

        <HStack gap="10px" wrap="wrap">
          <PendingSubmitButton
            idleText="Criar docente"
            pendingText="Criando..."
            style={{
              padding: '11px 18px',
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              boxShadow: '0 12px 30px rgba(20, 184, 166, 0.22)',
            }}
          />
          <Link
            as={NextLink}
            href="/docentes"
            px="18px"
            py="11px"
            color="#334155"
            textDecoration="none"
            borderRadius="999px"
            border="1px solid #cbd5e1"
            display="inline-flex"
            alignItems="center">
            Cancelar
          </Link>
        </HStack>
      </form>
    </DocentePageShell>
  )
}
