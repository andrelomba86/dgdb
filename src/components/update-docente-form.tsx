'use client'

import NextLink from 'next/link'
import { useActionState, useEffect, useRef } from 'react'

import { HStack, Link } from '@chakra-ui/react'

import type { DocenteFormState } from '@/actions/docente-actions'
import { updateDocenteAction } from '@/actions/docente-actions'
import type { DocenteFormValues } from '@/components/docente-form-fields'
import { DocenteFormFields } from '@/components/docente-form-fields'
import type { RelatedEntitiesInitialData } from '@/components/docente-related-fields'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { toaster } from '@/components/toaster-notifier'

type UpdateDocenteFormProps = {
  id: number
  initialValues: DocenteFormValues
  relatedInitialData: RelatedEntitiesInitialData
  initialSuccessMessage?: string
}

const formState: DocenteFormState = {
  result: {},
}

function enqueueToast(type: 'success' | 'error', description: string) {
  queueMicrotask(() => {
    toaster.create({ type, description })
  })
}

export function UpdateDocenteForm({
  id,
  initialValues,
  relatedInitialData,
  initialSuccessMessage,
}: UpdateDocenteFormProps) {
  const [state, action] = useActionState(updateDocenteAction, formState)
  const hasShownInitialSuccess = useRef(false)
  const effectiveRelatedInitialData = state.relatedInitialData ?? relatedInitialData

  useEffect(() => {
    if (initialSuccessMessage && !hasShownInitialSuccess.current) {
      enqueueToast('success', initialSuccessMessage)
      hasShownInitialSuccess.current = true
    }
  }, [initialSuccessMessage])

  useEffect(() => {
    if (state.result.error) {
      enqueueToast('error', state.result.error)
    } else if (state.result.success) {
      enqueueToast('success', state.result.success)
    }
  }, [state.result])

  return (
    <form action={action} style={{ display: 'grid', gap: '18px' }}>
      <input type="hidden" name="id" value={id} />

      <DocenteFormFields
        values={initialValues}
        relatedInitialData={effectiveRelatedInitialData}
        formPendingValues={state.formValues}
      />

      <HStack gap="10px" wrap="wrap">
        <PendingSubmitButton
          idleText="Atualizar docente"
          pendingText="Atualizando..."
          style={{
            padding: '11px 18px',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #38bdf8 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
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
