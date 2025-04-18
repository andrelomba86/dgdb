import { Flex, Text, Box } from '@chakra-ui/react'
import { Copy } from 'lucide-react'
import './css/InfoField.css'
import { toaster } from '@/components/ui/toaster'

interface InfoFieldProps {
  label: string
  value?: string | number | null
  // toast?: any
}

export function InfoField({ label, value }: InfoFieldProps) {
  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value.toString())
      toaster.create({ title: 'Área de transferência', description: `"${value}" copiado para a área de transferência` })
    }
  }

  return (
    <Flex fontSize={'sm'} className="btnParent" alignItems="center">
      <Text fontWeight="bold" color="gray" mr={2}>
        {label}:
      </Text>
      <Text>{value || ''}</Text>
      <Box ml={2}>
        {value && <Copy size={12} color="#F53" strokeWidth={3} onClick={handleCopy} className="button" />}
      </Box>
    </Flex>
  )
}
