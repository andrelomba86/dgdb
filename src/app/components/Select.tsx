import { ListCollection, Select as ChakraSelect } from '@chakra-ui/react'

export function Select({
  listCollection,
  onChange,
}: {
  listCollection: ListCollection
  onChange: (id: number) => void
}) {
  return (
    <ChakraSelect.Root
      collection={listCollection}
      onValueChange={e => {
        const docenteId = parseInt(e.value[0])
        onChange(docenteId)
      }}
    >
      <ChakraSelect.Label>Docente:</ChakraSelect.Label>
      <ChakraSelect.Control>
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText placeholder="Selecione" />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          {/* <ChakraSelect.ClearTrigger /> */}
          <ChakraSelect.Indicator />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
      <ChakraSelect.Positioner>
        <ChakraSelect.Content>
          <ChakraSelect.ItemGroup>
            {listCollection.items.map((item: CollectionItem) => (
              <ChakraSelect.Item item={item} key={item.value}>
                {item.label}
                <ChakraSelect.ItemIndicator />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.ItemGroup>
        </ChakraSelect.Content>
      </ChakraSelect.Positioner>
    </ChakraSelect.Root>
  )
}
