import { Button, Table, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { Cargo } from '@/types'

type DataTableProps = { data: Cargo[] }

//TODO: renomear para CargoTable ou algo assim
export function DataTable({ data }: DataTableProps) {
  const [hidden, setHidden] = useState(true)
  const headers = {
    descricao: 'Descrição',
    funcao: 'Função',
    data_inicio: 'Data Início',
    referencia: 'Referência',
  }
  //TODO: criar tipo para esse formatador
  const formatter = (value: Date | object): string => {
    // console.log(value, value instanceof Date)
    if (value instanceof Date) {
      return (value as Date).toLocaleDateString()
    }
    return value ? String(value) : ''
  }
  return (
    <>
      <Table.Root variant="line" size="sm">
        <Table.Header>
          <Table.Row>
            {Object.values(headers).map((header, index) => (
              <Table.ColumnHeader key={index}>{header}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row: Cargo, rowIndex) => (
            <Table.Row key={rowIndex} hidden={rowIndex > 0 && hidden}>
              {Object.keys(headers).map((key, cellIndex) => (
                <Table.Cell key={cellIndex}>{formatter(row[key as keyof Cargo] as Date | object)}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {data.length > 1 && (
        <Flex textAlign="right">
          <Button colorPalette="orange" variant="ghost" size="2xs" onClick={() => setHidden(!hidden)}>
            {hidden ? 'Mostrar Todos' : 'Mostrar somente o mais recente'}
          </Button>
        </Flex>
      )}
    </>
  )
}
