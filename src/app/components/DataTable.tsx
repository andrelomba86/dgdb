import { Button, Table, Flex } from '@chakra-ui/react'
import { Cargo } from '@/types'
import { CopyValue } from './CopyValue'
import { useStateContext } from '@/app/contexts/StateContext'

interface DataTableProps {
  data: Cargo[]
  // showAll: boolean
}

//TODO: renomear para CargoTable ou algo assim
export function DataTable({ data }: DataTableProps) {
  // const [showAll, setShowAll] = useState(true)
  const { state, setState } = useStateContext()

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
            <Table.Row key={rowIndex} hidden={rowIndex > 0 && !state.showAllJobTitles}>
              {Object.keys(headers).map((key, cellIndex) => {
                const value = formatter(row[key as keyof Cargo] as Date | object)
                return (
                  <Table.Cell key={cellIndex} alignItems="center">
                    <Flex alignItems="center">
                      {value}
                      <CopyValue value={value} />
                    </Flex>
                  </Table.Cell>
                )
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {data.length > 1 && (
        <Flex textAlign="right">
          <Button
            colorPalette="orange"
            variant="ghost"
            size="2xs"
            onClick={() => setState({ ...state, showAllJobTitles: !state.showAllJobTitles })}
          >
            {state.showAllJobTitles ? 'Mostrar somente o mais recente' : 'Mostrar Todos'}
          </Button>
        </Flex>
      )}
    </>
  )
}
