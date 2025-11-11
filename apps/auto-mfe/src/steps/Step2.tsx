import { step2Schema, Step2Data } from '@/lib/validation'
import { FormField } from '@/components/FormField'
import { useProductForm } from '@/hooks/useProductForm'
import { ProductFormWrapper } from '@/components/ProductFormWrapper'
import { formatDate } from '@/lib/format'

export default function Step2() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useProductForm<Step2Data>({
    schema: step2Schema,
  })

  const hasErrors = Object.keys(errors).length > 0

  return (
    <ProductFormWrapper hasErrors={hasErrors}>
      <FormField
        label="CNH"
        name="driverLicenseNumber"
        placeholder="12345678901"
        register={register}
        error={errors.driverLicenseNumber}
        maxLength={11}
      />

      <div>
        <label htmlFor="driverLicenseIssueDate" className="label">
          Data de emissão da CNH
        </label>
        <input
          id="driverLicenseIssueDate"
          type="text"
          placeholder="01/01/2020"
          maxLength={10}
          className={`input-field ${errors.driverLicenseIssueDate ? 'input-error' : ''}`}
          {...register('driverLicenseIssueDate', {
            onChange: (e) => {
              const formatted = formatDate(e.target.value)
              setValue('driverLicenseIssueDate', formatted)
            },
          })}
        />
        {errors.driverLicenseIssueDate && (
          <p className="error-message">
            {errors.driverLicenseIssueDate.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="driverLicenseCategory" className="label">
          Categoria da CNH
        </label>
        <select
          id="driverLicenseCategory"
          className={`input-field ${errors.driverLicenseCategory ? 'input-error' : ''}`}
          {...register('driverLicenseCategory')}
        >
          <option value="">Selecione a categoria</option>
          <option value="A">A - Motocicleta</option>
          <option value="B">B - Automóvel</option>
          <option value="AB">AB - Moto e Automóvel</option>
          <option value="C">C - Veículos de carga</option>
          <option value="D">D - Veículos de passageiros</option>
          <option value="E">E - Combinação de veículos</option>
        </select>
        {errors.driverLicenseCategory && (
          <p className="error-message">
            {errors.driverLicenseCategory.message}
          </p>
        )}
      </div>

      <div>
        <label className="label">Principal condutor(a) do veículo?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="yes"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('isMainDriver')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="no"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('isMainDriver')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.isMainDriver && (
          <p className="error-message">{errors.isMainDriver.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="profession" className="label">
          Profissão
        </label>
        <input
          id="profession"
          type="text"
          placeholder="Ex: Engenheiro"
          className={`input-field ${errors.profession ? 'input-error' : ''}`}
          {...register('profession')}
        />
        {errors.profession && (
          <p className="error-message">{errors.profession.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="zipCode" className="label">
          CEP de pernoite do veículo
        </label>
        <input
          id="zipCode"
          type="text"
          placeholder="12345-678"
          maxLength={9}
          className={`input-field ${errors.zipCode ? 'input-error' : ''}`}
          {...register('zipCode', {
            onChange: (e) => {
              let value = e.target.value.replace(/\D/g, '')
              if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5, 8)
              }
              setValue('zipCode', value)
            },
          })}
        />
        {errors.zipCode && (
          <p className="error-message">{errors.zipCode.message}</p>
        )}
      </div>
    </ProductFormWrapper>
  )
}
