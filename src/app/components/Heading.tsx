import { chakra } from '@chakra-ui/react'
import { Heading as ChakraHeading } from '@chakra-ui/react'

export const Heading = chakra(
  ChakraHeading,
  {},
  {
    defaultProps: {
      size: 'md',
      padding: 0,
      marginTop: 0,
      marginBottom: 0,
    },
  }
)
