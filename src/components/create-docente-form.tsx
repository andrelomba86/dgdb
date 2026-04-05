'use client'

import { useActionState, useEffect } from 'react'

import type { DocenteFormState } from '@/actions/docente-actions'
import { createDocenteAction } from '@/actions/docente-actions'
import { DocenteFormActionBar } from '@/components/docente-form-action-bar'
import { DocenteFormFields } from '@/components/docente-form-fields'
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
    <form action={action} style={{ display: 'grid', gap: '18px', paddingBottom: '128px' }}>
      <DocenteFormFields values={state.formValues} relatedInitialData={effectiveRelatedInitialData} />

      <DocenteFormActionBar
        title="Ações do cadastro"
        submitIdleText="Criar cadastro"
        submitPendingText="Criando..."
      />
    </form>
  )
}
