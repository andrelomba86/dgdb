import { Flex, Text } from '@chakra-ui/react'

interface InfoFieldProps {
  label: string
  value?: string | number | null
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <Flex fontSize={'sm'}>
      <Text fontWeight="bold" color="gray" mr={2}>
        {label}:
      </Text>
      <Text>{value || ''}</Text>
    </Flex>
  )
}
