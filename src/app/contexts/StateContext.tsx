import { createContext, useContext, useState } from 'react'
import { ProfessorData, ProviderProps, SelectProps } from '@/types'
import { createListCollection, ListCollection } from '@chakra-ui/react'

interface StateProps {
  showAllJobTitles: boolean
  selectedProfessorID: number
  professorData: ProfessorData
  professorList: ListCollection<SelectProps>
}
interface StateContextProps {
  state: StateProps
  setState: (state: StateProps) => void
  setProp: (key: keyof StateProps) => (value: StateProps[keyof StateProps]) => void
}

const initialState = {
  showAllJobTitles: false,
  selectedProfessorID: -1,
  professorData: { name: '' },
  professorList: createListCollection<SelectProps>({ items: [] }),
}
const StateContext = createContext<StateContextProps | null>(null)

export function StateProvider({ children }: ProviderProps) {
  const [state, setState] = useState<StateProps>(initialState)
  // const setProp = (key: keyof StateProps, value: StateProps[keyof StateProps]) => {
  //   setState(prevState => ({ ...prevState, [key]: value }))
  // }
  const setProp = (key: keyof StateProps) => (value: StateProps[keyof StateProps]) => {
    setState(prevState => ({ ...prevState, [key]: value }))
  }

  return <StateContext.Provider value={{ state, setState, setProp }}>{children}</StateContext.Provider>
}

export function useStateContext() {
  const context = useContext(StateContext)
  if (!context) throw new Error('useProfessorService must be used within a ServiceProvider')
  return context
}
