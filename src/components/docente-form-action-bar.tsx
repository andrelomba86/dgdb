'use client'

import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ComponentProps } from 'react'

import { ActionBar, Button, Text } from '@chakra-ui/react'

import { ConfirmSubmitButton } from '@/components/confirm-submit-button'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { getClientSessionStorage, popPreviousRoute } from '@/lib/route-history'

type DocenteFormActionBarProps = {
  title: string
  submitIdleText: string
  submitPendingText: string
  submitHref?: string
  deleteFormAction?: ComponentProps<typeof ConfirmSubmitButton>['formAction']
  deleteConfirmMessage?: string
  deleteIdleText?: string
  deletePendingText?: string
}

export function DocenteFormActionBar({
  title,
  submitIdleText,
  submitPendingText,
  submitHref,
  deleteFormAction,
  deleteConfirmMessage,
  deleteIdleText = 'Excluir cadastro',
  deletePendingText = 'Excluindo...',
}: DocenteFormActionBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const showDeleteAction = Boolean(deleteFormAction && deleteConfirmMessage)

  function handleBackClick() {
    const storage = getClientSessionStorage()
    const query = searchParams.toString()
    const currentRoute = query ? `${pathname}?${query}` : pathname
    const previousRoute = storage ? popPreviousRoute(storage, currentRoute) : null
    router.push(previousRoute || '/docentes')
  }

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

          {submitHref ? (
            <Button asChild colorPalette="teal" size="sm" rounded="full">
              <NextLink href={submitHref}>{submitIdleText}</NextLink>
            </Button>
          ) : (
            <PendingSubmitButton
              idleText={submitIdleText}
              pendingText={submitPendingText}
              colorPalette="teal"
              size="sm"
              rounded="full"
            />
          )}

          <Button variant="surface" size="sm" rounded="full" colorPalette="gray" onClick={handleBackClick}>
            Voltar
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
