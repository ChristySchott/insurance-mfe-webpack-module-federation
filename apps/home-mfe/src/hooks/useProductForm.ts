import { useEffect } from 'react'
import {
  useForm,
  UseFormReturn,
  FieldValues,
  type DefaultValues,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCotacaoStore } from 'multicotadorHost/useCotacaoStore'
import { ZodSchema } from 'zod'

interface UseProductFormProps<T extends FieldValues> {
  schema: ZodSchema<T>
  defaultValues?: DefaultValues<T>
}

export function useProductForm<T extends FieldValues>({
  schema,
  defaultValues,
}: UseProductFormProps<T>): UseFormReturn<T> {
  const { step2Data, setStep2Data, setStep2IsValid, step2IsValid } =
    useCotacaoStore()

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: defaultValues || (step2Data as DefaultValues<T>),
  })

  const { watch, formState } = form
  const { isValid } = formState

  useEffect(() => {
    setStep2IsValid(isValid)
  }, [isValid, setStep2IsValid, step2IsValid])

  useEffect(() => {
    const subscription = watch((formData) => {
      setStep2Data(formData as Record<string, unknown>)
    })

    return () => subscription.unsubscribe()
  }, [watch, setStep2Data])

  return form
}
