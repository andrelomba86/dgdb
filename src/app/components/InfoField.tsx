import { Flex, Text } from '@chakra-ui/react'

interface InfoFieldProps {
  label: string
  value?: string | number | null
  formatter?: (value: any) => string
}

export function InfoField({ label, value, formatter }: InfoFieldProps) {
  const displayValue = formatter ? formatter(value) : value

  return (
    <Flex fontSize={'sm'}>
      <Text fontWeight="bold" color="gray" mr={2}>
        {label}:
      </Text>
      <Text>{displayValue || ''}</Text>
    </Flex>
  )
}
