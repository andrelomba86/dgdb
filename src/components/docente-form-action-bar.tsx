'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'

import { ActionBar, Button, Text } from '@chakra-ui/react'

import { ConfirmSubmitButton } from '@/components/confirm-submit-button'
import { PendingSubmitButton } from '@/components/pending-submit-button'

type DocenteFormActionBarProps = {
  title: string
  submitIdleText: string
  submitPendingText: string
  cancelHref?: string
  deleteFormAction?: ComponentProps<typeof ConfirmSubmitButton>['formAction']
  deleteConfirmMessage?: string
  deleteIdleText?: string
  deletePendingText?: string
}

export function DocenteFormActionBar({
  title,
  submitIdleText,
  submitPendingText,
  cancelHref = '/docentes',
  deleteFormAction,
  deleteConfirmMessage,
  deleteIdleText = 'Excluir cadastro',
  deletePendingText = 'Excluindo...',
}: DocenteFormActionBarProps) {
  const showDeleteAction = Boolean(deleteFormAction && deleteConfirmMessage)

  return (
    <ActionBar.Root open autoFocus={false} closeOnEscape={false} closeOnInteractOutside={false}>
      <ActionBar.Positioner padding={{ base: '12px', md: '16px' }}>
        <ActionBar.Content
          gap="12px"
          flexWrap="wrap"
          justifyContent="center"
          px={{ base: '12px', md: '16px' }}
          py="12px"
          borderRadius="999px"
          border="1px solid"
          borderColor="blue.100"
          bg="rgba(255, 255, 255, 0.96)"
          boxShadow="0 18px 40px rgba(15, 23, 42, 0.5)">
          <Text fontWeight="700" color="gray.600" px="4">
            {title}
          </Text>
          <ActionBar.Separator />

          <PendingSubmitButton
            idleText={submitIdleText}
            pendingText={submitPendingText}
            colorPalette="teal"
            size="sm"
            rounded="full"
          />

          <Button asChild variant="surface" size="sm" rounded="full" colorPalette="gray">
            <NextLink href={cancelHref}>Voltar</NextLink>
          </Button>

          {showDeleteAction ? (
            <>
              <ActionBar.Separator />
              <ConfirmSubmitButton
                idleText={deleteIdleText}
                pendingText={deletePendingText}
                confirmMessage={deleteConfirmMessage!}
                formAction={deleteFormAction}
                variant="outline"
                colorPalette="red"
                size="sm"
                rounded="full"
              />
            </>
          ) : null}
        </ActionBar.Content>
      </ActionBar.Positioner>
    </ActionBar.Root>
  )
}
