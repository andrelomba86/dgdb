import { ListCollection, Select as ChakraSelect, CollectionItem } from '@chakra-ui/react'

interface SelectProps {
  listCollection: ListCollection
  selectedId?: number
  onChange: (id: number) => void
}
//TODO: tornar reutilizável
// ------- onChange deve receber TIPO Select<T> ... onChange<T>(...) ??
//value={[selected?.toString() || listCollection.items[0].value]}

export function Select({ listCollection, selectedId, onChange }: SelectProps) {
  const selectedValue = selectedId && selectedId > 0 ? [selectedId.toString()] : undefined
  //selected && selected >= 0 ? selected.toString() : listCollection.items[0]?.value.toString()

  // const selectedValue = selected && selected >= 0 ? selected : listCollection.items[0]?.value
  // let selectedValue
  console.log(selectedValue)
  return (
    <ChakraSelect.Root
      collection={listCollection}
      onValueChange={e => {
        console.log(e)
        const docenteId = parseInt(e.value[0])
        onChange(docenteId)
      }}
      value={selectedValue}
    >
      <ChakraSelect.HiddenSelect />
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
              <ChakraSelect.Item item={item} key={item.value.toString()}>
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
