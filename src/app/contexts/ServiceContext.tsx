'use client'
import { createContext, useContext } from 'react'
import { ProfessorService } from '@/app/services/ProfessorService'
import { ProviderProps } from '@/types'

const ServiceContext = createContext<ProfessorService | null>(null)

export function ServiceProvider({ children }: ProviderProps) {
  // const professorService = useMemo(() => new ProfessorService(), [])
  const professorService = new ProfessorService()
  return <ServiceContext.Provider value={professorService}>{children}</ServiceContext.Provider>
}

export function useProfessorService() {
  const context = useContext(ServiceContext)
  if (!context) throw new Error('useProfessorService must be used within a ServiceProvider')
  return context
}
