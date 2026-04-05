'use client'

import { Button, IconButton, type ButtonProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

type ConfirmSubmitButtonProps = {
  idleText: string
  pendingText: string
  confirmMessage: string
  children?: ReactNode
  iconOnly?: boolean
} & Omit<ButtonProps, 'children'>

export function ConfirmSubmitButton({
  idleText,
  pendingText,
  confirmMessage,
  children,
  iconOnly = false,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ConfirmSubmitButtonProps) {
  const { pending } = useFormStatus()

  const handleClick: NonNullable<ButtonProps['onClick']> = event => {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault()
      return
    }

    onClick?.(event)
  }

  if (iconOnly) {
    return (
      <IconButton
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        aria-label={ariaLabel ?? idleText}
        onClick={handleClick}
        {...props}>
        {children}
      </IconButton>
    )
  }

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} onClick={handleClick} {...props}>
      {pending ? pendingText : (children ?? idleText)}
    </Button>
  )
}
