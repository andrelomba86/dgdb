import { Box } from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import { Copy } from 'lucide-react'
import './css/CopyValue.css'

export function CopyValue({ value }: { value?: string | number }) {
  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value.toString())
      toaster.create({ title: 'Área de transferência', description: `"${value}" copiado para a área de transferência` })
    }
  }
  if (!value) return <></>
  return (
    <Box ml={2} className="button">
      {value && <Copy size={12} color="#F53" strokeWidth={3} onClick={handleCopy} />}
    </Box>
  )
}
