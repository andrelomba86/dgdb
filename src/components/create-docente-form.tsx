'use client'

import NextLink from 'next/link'
import { useActionState, useEffect } from 'react'

import { HStack, Link } from '@chakra-ui/react'

import type { DocenteFormState } from '@/actions/docente-actions'
import { createDocenteAction } from '@/actions/docente-actions'
import { DocenteFormFields } from '@/components/docente-form-fields'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { toaster } from '@/components/toaster-notifier'

const initialState: DocenteFormState = {
  result: {},
}

function enqueueToast(type: 'success' | 'error', description: string) {
  queueMicrotask(() => {
    toaster.create({ type, description })
  })
}

export function CreateDocenteForm() {
  const [state, action] = useActionState(createDocenteAction, initialState)
  const effectiveRelatedInitialData = state.relatedInitialData

  useEffect(() => {
    if (state.result.error) {
      enqueueToast('error', state.result.error)
    }
  }, [state.result])

  return (
    <form action={action} style={{ display: 'grid', gap: '18px' }}>
      <DocenteFormFields values={state.formValues} relatedInitialData={effectiveRelatedInitialData} />

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
  )
}
