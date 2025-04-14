import { chakra } from '@chakra-ui/react';
import { Stack as ChakraStack } from '@chakra-ui/react';

export const Stack = chakra(
  ChakraStack,
  {},
  {
    defaultProps: {
      width: '100%',
      padding: 6,
      borderWidth: 0,
      borderRadius: 0,
    },
  }
);
