import { chakra } from '@chakra-ui/react'
import { Tabs as ChakraTabs } from '@chakra-ui/react'

export const Tabs = {
  ...ChakraTabs,
  Root: chakra(
    ChakraTabs.Root,
    {},
    {
      defaultProps: {
        width: '100%',
      },
    }
  ),
  Content: chakra(
    ChakraTabs.Content,
    {},
    {
      defaultProps: {
        padding: 0,
        margin: 0,
      },
    }
  ),
}
//chakra<T extends ElementType, P extends RecipeVariantRecord>(component: T, recipe: RecipeDefinition<P>, options?: JsxFactoryOptions<Assign<ComponentProps<T>, RecipeSelection<P>>>): JsxElement<T, RecipeSelection<P>>
