'use client'

import { Button, ButtonProps } from '@chakra-ui/react'
import type { CSSProperties } from 'react'
import { useFormStatus } from 'react-dom'

type PendingSubmitButtonProps = {
  idleText: string
  pendingText: string
  style?: CSSProperties
} & Omit<ButtonProps, 'children' | 'type'>

export function PendingSubmitButton({ idleText, pendingText, ...props }: PendingSubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" loadingText={pendingText} loading={pending} aria-disabled={pending} {...props}>
      {idleText}
    </Button>
  )
}
