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

type SelectOrAddInputProps = {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  onRegisterOption?: (value: string) => void
  options: SelectOption[]
  defaultOptions?: SelectOption[]
  customInputPlaceholder?: string
  cancelToValue: string
  cancelAriaLabel?: string
  addAriaLabel?: string
}

export function SelectOrAddInput({
  id,
  label,
  value,
  onValueChange,
  onRegisterOption,
  options,
  defaultOptions = [],
  customInputPlaceholder,
  cancelToValue,
  cancelAriaLabel = 'Cancelar',
  addAriaLabel = 'Confirmar valor',
}: SelectOrAddInputProps) {
  const mergedOptions = useMemo(() => {
    const seen = new Set<string>()
    const result: SelectOption[] = []

    const add = (option: SelectOption) => {
      const key = option.value.toLocaleLowerCase('pt-BR')
      if (!seen.has(key)) {
        seen.add(key)
        result.push(option)
      }
    }

    defaultOptions.forEach(add)
    options.forEach(add)

    return result
  }, [defaultOptions, options])

  const selectableValuesLower = useMemo(
    () => new Set(mergedOptions.map(o => o.value.toLocaleLowerCase('pt-BR'))),
    [mergedOptions],
  )

  const isValueInList = (v: string) => selectableValuesLower.has(v.toLocaleLowerCase('pt-BR'))

  const [isCustomMode, setIsCustomMode] = useState(value.length > 0 && !isValueInList(value))

  useEffect(() => {
    if (value.length > 0 && !isValueInList(value)) {
      setIsCustomMode(true)
      return
    }

    if (isValueInList(value)) {
      setIsCustomMode(false)
    }
  }, [value, selectableValuesLower])

  const handleSelectChange = (nextValue: string) => {
    onValueChange(nextValue)
  }

  const handleOpenAddMode = () => {
    setIsCustomMode(true)
    onValueChange('')
  }

  const handleConfirmCustom = () => {
    const trimmedValue = value.trim()

    setIsCustomMode(false)

    if (trimmedValue.length > 0) {
      onRegisterOption?.(trimmedValue)
      onValueChange(trimmedValue)
      return
    }

    onValueChange(cancelToValue)
  }

  const handleCancelCustom = () => {
    setIsCustomMode(false)
    onValueChange(cancelToValue)
  }

  return (
    <Field.Root>
      <Field.Label htmlFor={id}>{label}</Field.Label>

      {isCustomMode ? (
        <HStack gap="0" w="100%">
          <Input
            id={id}
            type="text"
            value={value}
            placeholder={customInputPlaceholder}
            onChange={event => onValueChange(event.target.value)}
            p="10px 12px"
          />
          <IconButton
            type="button"
            aria-label={addAriaLabel}
            title={addAriaLabel}
            variant="surface"
            rounded="none"
            colorPalette="blue"
            onClick={handleConfirmCustom}>
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            type="button"
            aria-label={cancelAriaLabel}
            title={cancelAriaLabel}
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
              value={value || cancelToValue}
              onChange={event => handleSelectChange(event.target.value)}
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
            aria-label="Adicionar valor personalizado"
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
