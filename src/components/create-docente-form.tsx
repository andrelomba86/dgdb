'use client'

import { useActionState, useEffect } from 'react'

import type { DocenteFormState } from '@/actions/docente-actions'
import { createDocenteAction } from '@/actions/docente-actions'
import { DocenteFormActionBar } from '@/components/docente-form-action-bar'
import { DocenteFormFields } from '@/components/docente-form-fields'
import type { RelatedEntitiesInitialData } from '@/components/docente-related-fields'
import { toaster } from '@/components/toaster-notifier'

const initialState: DocenteFormState = {
  result: {},
}

function enqueueToast(type: 'success' | 'error', description: string) {
  queueMicrotask(() => {
    toaster.create({ type, description })
  })
}

type CreateDocenteFormProps = {
  relatedInitialData?: RelatedEntitiesInitialData
}

export function CreateDocenteForm({ relatedInitialData }: CreateDocenteFormProps) {
  const [state, action, isPending] = useActionState(createDocenteAction, initialState)
  const effectiveRelatedInitialData = state.relatedInitialData ?? relatedInitialData

  useEffect(() => {
    if (state.result.error) {
      enqueueToast('error', state.result.error)
    }
  }, [state.result])

  return (
    <form
      action={action}
      aria-busy={isPending}
      style={{
        display: 'grid',
        gap: '18px',
        paddingBottom: '128px',
        pointerEvents: isPending ? 'none' : 'auto',
        opacity: isPending ? 0.5 : 1,
        transition: 'opacity 0.2s ease',
      }}>
      <DocenteFormFields values={state.formValues} relatedInitialData={effectiveRelatedInitialData} />

      <DocenteFormActionBar
        title="Ações do cadastro"
        submitIdleText="Criar cadastro"
        submitPendingText="Criando..."
      />
    </form>
  )
}
