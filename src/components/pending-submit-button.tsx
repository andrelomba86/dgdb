'use client'

import { Button } from '@chakra-ui/react'
import type { CSSProperties } from 'react'
import { useFormStatus } from 'react-dom'

type PendingSubmitButtonProps = {
  idleText: string
  pendingText: string
  style?: CSSProperties
}

export function PendingSubmitButton({ idleText, pendingText, style }: PendingSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} style={style}>
      {pending ? pendingText : idleText}
    </Button>
  )
}
