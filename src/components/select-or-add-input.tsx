'use client'

import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import { Field, HStack, IconButton, Input, NativeSelect } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'

type SelectOption = {
  value: string
  label: string
}

type InputOption = string | SelectOption

type SelectOrAddInputProps = {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  onRegisterOption?: (value: string) => void
  options: InputOption[]
  customInputPlaceholder?: string
  // cancelToValue: string
  // cancelAriaLabel?: string
  // addAriaLabel?: string
}
//TODO: verificar se é necessário mesmo utilizar array e como objeto para options, ou se é possível simplificar para apenas um formato. Atualmente a implementação suporta ambos os formatos, mas talvez seja mais simples padronizar para apenas um (somente array, que é o realmente utilizado atualmente).
export function SelectOrAddInput({
  id,
  label,
  value,
  onValueChange,
  onRegisterOption,
  options,
  customInputPlaceholder,
  // cancelToValue,
  // cancelAriaLabel = 'Cancelar',
  // addAriaLabel = 'Confirmar valor',
}: SelectOrAddInputProps) {
  const mergedOptions = useMemo(() => {
    const normalize = (opt: InputOption): SelectOption =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt

    const seen = new Set<string>()
    const result: SelectOption[] = []

    const add = (option: SelectOption) => {
      const key = option.value.toLocaleLowerCase('pt-BR')
      if (!seen.has(key)) {
        seen.add(key)
        result.push(option)
      }
    }

    options.forEach(o => add(normalize(o)))

    return result
  }, [options])

  const [manualCustomMode, setManualCustomMode] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const handleOpenAddMode = () => {
    setManualCustomMode(true)
    setCustomValue('')
  }

  const currentOrDefaultValue = value || mergedOptions[0]?.value

  const handleConfirmCustom = () => {
    const trimmedValue = customValue.trim()

    setManualCustomMode(false)

    if (trimmedValue.length > 0) {
      onRegisterOption?.(trimmedValue)
      onValueChange(trimmedValue)
      return
    }

    onValueChange(currentOrDefaultValue)
  }

  const handleCancelCustom = () => {
    setManualCustomMode(false)
    onValueChange(currentOrDefaultValue)
  }

  return (
    <Field.Root>
      <Field.Label htmlFor={id}>{label}</Field.Label>

      {manualCustomMode ? (
        <HStack gap="0" w="100%">
          <Input
            id={id}
            type="text"
            value={customValue}
            placeholder={customInputPlaceholder}
            onChange={event => setCustomValue(event.target.value)}
            p="10px 12px"
          />
          <IconButton
            type="button"
            title="Confirmar valor personalizado"
            variant="surface"
            rounded="none"
            colorPalette="blue"
            onClick={handleConfirmCustom}>
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            type="button"
            title="Cancelar valor personalizado"
            variant="surface"
            rounded="none"
            borderEndRadius="sm"
            colorPalette="red"
            onClick={handleCancelCustom}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </HStack>
      ) : (
        <HStack gap="0" w="100%">
          <NativeSelect.Root flex="1">
            <NativeSelect.Field
              id={id}
              value={currentOrDefaultValue}
              onChange={event => onValueChange(event.target.value)}
              p="10px 12px">
              {mergedOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <IconButton
            type="button"
            title="Adicionar valor personalizado"
            variant="outline"
            colorPalette="blue"
            onClick={handleOpenAddMode}>
            <AddIcon fontSize="small" />
          </IconButton>
        </HStack>
      )}
    </Field.Root>
  )
}
