import { useProductForm } from '@/hooks/useProductForm'
import { ProductFormWrapper } from '@/components/ProductFormWrapper'
import { step2Schema, Step2Data } from '@/lib/validation'
import { FormField } from '@/components/FormField'

export default function Step2() {
  const {
    register,
    formState: { errors },
  } = useProductForm<Step2Data>({
    schema: step2Schema,
  })

  const hasErrors = Object.keys(errors).length > 0

  return (
    <ProductFormWrapper hasErrors={hasErrors}>
      <div>
        <label htmlFor="ownershipStatus" className="label">
          Condição do imóvel
        </label>
        <select
          id="ownershipStatus"
          className={`input-field ${errors.ownershipStatus ? 'input-error' : ''}`}
          {...register('ownershipStatus')}
        >
          <option value="">Selecione a condição</option>
          <option value="owner">Proprietário</option>
          <option value="tenant">Inquilino</option>
          <option value="family">Morando com familiares</option>
        </select>
        {errors.ownershipStatus && (
          <p className="error-message">{errors.ownershipStatus.message}</p>
        )}
      </div>

      <FormField
        label="Número de moradores"
        name="numberOfResidents"
        placeholder="4"
        register={register}
        error={errors.numberOfResidents}
        maxLength={2}
      />

      <div>
        <label className="label">Possui animais de estimação?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="yes"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasPets')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="no"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasPets')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.hasPets && (
          <p className="error-message">{errors.hasPets.message}</p>
        )}
      </div>

      <div>
        <label className="label">Residência principal?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="yes"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('isPrimaryResidence')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="no"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('isPrimaryResidence')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.isPrimaryResidence && (
          <p className="error-message">{errors.isPrimaryResidence.message}</p>
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
        <label htmlFor="monthlyIncome" className="label">
          Renda mensal (R$)
        </label>
        <input
          id="monthlyIncome"
          type="text"
          placeholder="5000"
          className={`input-field ${errors.monthlyIncome ? 'input-error' : ''}`}
          {...register('monthlyIncome', {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, '')
            },
          })}
        />
        {errors.monthlyIncome && (
          <p className="error-message">{errors.monthlyIncome.message}</p>
        )}
      </div>
    </ProductFormWrapper>
  )
}
