import { defineConfig, defineLayerStyles, defineStyle } from '@chakra-ui/react'

const layerStyles = defineLayerStyles({
  container: {
    value: {
      maxWidth: '3xl',
      paddingTop: 10,
    },
  },
  heading: {
    value: {
      color: 'white',
      backgroundColor: 'gray.900',
      padding: 3,
      borderRadius: 'sm',
      borderWidth: 1,
      borderColor: 'black',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: '100%',
    },
  },
  vstack: {
    value: {
      paddingTop: 0,
      borderColor: 'gray.300',
      borderWidth: 1,
      borderRadius: 'sm',
      width: '100%',
      boxShadow: 'lg',
      boxShadowColor: 'gray.900',
    },
  },
})

export const config = defineConfig({
  globalCss: {
    body: {
      background: 'linear-gradient(45deg,rgb(207, 206, 201),rgb(205, 207, 211),rgb(219, 211, 208))',
    },
    html: {
      backgroundColor: 'gray.900',
    },
  },
  theme: {
    layerStyles,
  },
})
