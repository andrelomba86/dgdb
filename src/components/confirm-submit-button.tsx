'use client'

import { Button } from '@chakra-ui/react'
import type { CSSProperties } from 'react'
import { useFormStatus } from 'react-dom'

type ConfirmSubmitButtonProps = {
  idleText: string
  pendingText: string
  confirmMessage: string
  style?: CSSProperties
}

export function ConfirmSubmitButton({
  idleText,
  pendingText,
  confirmMessage,
  style,
}: ConfirmSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="button"
      disabled={pending}
      aria-disabled={pending}
      onClick={event => {
        if (!window.confirm(confirmMessage)) {
          return
        }

        event.currentTarget.form?.requestSubmit()
      }}
      style={style}>
      {pending ? pendingText : idleText}
    </Button>
  )
}
