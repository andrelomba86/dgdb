import { Button, Table, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { Cargo } from '@/types/docente'

type DataTableProps = { data: Cargo[] }
type KeyOfCargo = keyof Cargo
export function DataTable({ data }: DataTableProps) {
  const [hidden, setHidden] = useState(true)
  const headers = {
    descricao: 'Descrição',
    funcao: 'Função',
    data_inicio: 'Data Início',
    referencia: 'Referência',
  }
  const formatter = (value: any) => {
    console.log(value, value instanceof Date)
    if (value instanceof Date) {
      return value.toLocaleDateString()
    }
    return value
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
          {data.map((row, rowIndex) => (
            <Table.Row key={rowIndex} hidden={rowIndex > 0 && hidden}>
              {Object.keys(headers).map((key: string, cellIndex) => (
                <Table.Cell key={cellIndex}>{formatter(row['data_inicio'] as Date)}</Table.Cell>
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
