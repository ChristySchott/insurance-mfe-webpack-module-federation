import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCotacaoStore } from '@/hooks/useCotacaoStore'
import { formatCpf } from '@/lib/format'
import { ProductTypeSelector } from '@/components/ProductTypeSelector'

const step1Schema = z.object({
  cpf: z
    .string()
    .min(11, 'CPF deve ter pelo menos 11 caracteres')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF com formato inválido'),
  productType: z
    .string({
      invalid_type_error: 'Por favor, selecione um tipo válido de seguro',
      required_error: 'Por favor, selecione um tipo de seguro',
    })
    .nullable(),
})

type Step1FormData = z.infer<typeof step1Schema>

export function Step1() {
  const { productType, setProductType, reset, setCpf, cpf } = useCotacaoStore()

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      cpf: cpf,
      productType: productType,
    },
  })

  const selectedProductType = watch('productType')

  const handleProductTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newProductType = event.target.value

    setProductType(newProductType)

    reset({
      cpf,
      productType: newProductType,
    })
  }

  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(event.target.value)
    setValue('cpf', formatted)
    setCpf(event.target.value)
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Inicie a cotação
        </h2>
        <p className="text-gray-600">
          Preencha as suas informações para seguir com a cotação
        </p>
      </header>

      <form className="space-y-6">
        <div>
          <label htmlFor="cpf" className="label">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            maxLength={14}
            className={`input-field ${errors.cpf ? 'input-error' : ''}`}
            {...register('cpf', {
              onChange: handleCpfChange,
            })}
          />
          {errors.cpf && <p className="error-message">{errors.cpf.message}</p>}
        </div>

        <ProductTypeSelector
          selectedProductType={selectedProductType}
          register={register('productType', {
            onChange: handleProductTypeChange,
          })}
          error={errors.productType?.message}
        />
      </form>
    </div>
  )
}
