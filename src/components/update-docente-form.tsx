'use client'

import { useActionState, useEffect, useRef } from 'react'

import type { DocenteFormState } from '@/actions/docente-actions'
import { deleteDocenteAction, updateDocenteAction } from '@/actions/docente-actions'
import { DocenteFormActionBar } from '@/components/docente-form-action-bar'
import type { DocenteFormValues } from '@/components/docente-form-fields'
import { DocenteFormFields } from '@/components/docente-form-fields'
import type { RelatedEntitiesInitialData } from '@/components/docente-related-fields'
import { enqueueToast } from '@/components/toaster-notifier'

type UpdateDocenteFormProps = {
  id: number
  initialValues: DocenteFormValues
  relatedInitialData: RelatedEntitiesInitialData
  initialSuccessMessage?: string
}

const formState: DocenteFormState = {
  result: {},
}

export function UpdateDocenteForm({
  id,
  initialValues,
  relatedInitialData,
  initialSuccessMessage,
}: UpdateDocenteFormProps) {
  const [state, action, isPending] = useActionState(updateDocenteAction, formState)
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
      <input type="hidden" name="id" value={id} />

      <DocenteFormFields
        values={initialValues}
        relatedInitialData={effectiveRelatedInitialData}
        formPendingValues={state.formValues}
      />

      <DocenteFormActionBar
        title="Ações do registro"
        submitIdleText="Atualizar cadastro"
        submitPendingText="Atualizando..."
        deleteFormAction={deleteDocenteAction.bind(null, id)}
        deleteConfirmMessage={`Excluir ${initialValues.nome}? Esta ação remove permanentemente o cadastro e os vínculos relacionados.`}
      />
    </form>
  )
}
