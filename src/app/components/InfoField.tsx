import { Flex, Text } from '@chakra-ui/react'
import { CopyValue } from './CopyValue'

interface InfoFieldProps {
  label: string
  value?: string | number
  // toast?: any
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <Flex fontSize={'sm'} alignItems="center">
      <Text fontWeight="bold" color="gray" mr={2}>
        {label}:
      </Text>
      <Text>{value || ''}</Text>
      <CopyValue value={value} />
    </Flex>
  )
}
