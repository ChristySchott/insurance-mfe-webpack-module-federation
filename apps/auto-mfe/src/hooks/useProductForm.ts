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
  const { productData, setProductData, setIsCurrentStepValid } =
    useCotacaoStore()

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: defaultValues || (productData as DefaultValues<T>),
  })

  const { formState, watch } = form
  const { isValid } = formState

  useEffect(() => {
    setIsCurrentStepValid(isValid)
  }, [isValid, setIsCurrentStepValid])

  useEffect(() => {
    const subscription = watch((formData) => {
      setProductData((prev) => ({
        ...prev,
        ...(formData as Record<string, unknown>),
      }))
    })

    return () => subscription.unsubscribe()
  }, [watch, setProductData])

  return form
}
