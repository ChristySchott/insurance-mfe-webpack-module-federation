import { useProductForm } from '@/hooks/useProductForm'
import { ProductFormWrapper } from '@/components/ProductFormWrapper'
import { step3Schema, Step3Data } from '@/lib/validation'
import { FormField } from '@/components/FormField'
import {
  PROPERTY_TYPES,
  CONSTRUCTION_TYPES,
  NEIGHBORHOODS_BY_RISK,
} from '@/lib/data'
import { formatPostalCode } from '@/lib/format'

export default function Step3() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useProductForm<Step3Data>({
    schema: step3Schema,
  })

  const hasErrors = Object.keys(errors).length > 0

  return (
    <ProductFormWrapper hasErrors={hasErrors}>
      <div>
        <label htmlFor="postalCode" className="label">
          CEP do imóvel
        </label>
        <input
          id="postalCode"
          type="text"
          placeholder="01310-100"
          maxLength={9}
          className={`input-field ${errors.postalCode ? 'input-error' : ''}`}
          {...register('postalCode', {
            onChange: (e) => {
              const formatted = formatPostalCode(e.target.value)
              setValue('postalCode', formatted)
            },
          })}
        />
        {errors.postalCode && (
          <p className="error-message">{errors.postalCode.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="propertyType" className="label">
          Tipo de imóvel
        </label>
        <select
          id="propertyType"
          className={`input-field ${errors.propertyType ? 'input-error' : ''}`}
          {...register('propertyType')}
        >
          <option value="">Selecione o tipo</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.propertyType && (
          <p className="error-message">{errors.propertyType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="constructionType" className="label">
          Tipo de construção
        </label>
        <select
          id="constructionType"
          className={`input-field ${errors.constructionType ? 'input-error' : ''}`}
          {...register('constructionType')}
        >
          <option value="">Selecione o tipo</option>
          {CONSTRUCTION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.constructionType && (
          <p className="error-message">{errors.constructionType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Área total (m²)"
          name="totalArea"
          placeholder="120"
          register={register}
          error={errors.totalArea}
          maxLength={5}
        />

        <FormField
          label="Número de cômodos"
          name="numberOfRooms"
          placeholder="8"
          register={register}
          error={errors.numberOfRooms}
          maxLength={2}
        />
      </div>

      <FormField
        label="Ano de construção"
        name="constructionYear"
        placeholder="2015"
        register={register}
        error={errors.constructionYear}
        maxLength={4}
      />

      <div>
        <label htmlFor="neighborhoodRisk" className="label">
          Classificação do bairro
        </label>
        <select
          id="neighborhoodRisk"
          className={`input-field ${errors.neighborhoodRisk ? 'input-error' : ''}`}
          {...register('neighborhoodRisk')}
        >
          <option value="">Selecione a classificação</option>
          {NEIGHBORHOODS_BY_RISK.map((risk) => (
            <option key={risk.value} value={risk.value}>
              {risk.label}
            </option>
          ))}
        </select>
        {errors.neighborhoodRisk && (
          <p className="error-message">{errors.neighborhoodRisk.message}</p>
        )}
      </div>

      <div>
        <label className="label">Possui alarme?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="yes"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasAlarm')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="no"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasAlarm')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.hasAlarm && (
          <p className="error-message">{errors.hasAlarm.message}</p>
        )}
      </div>

      <div>
        <label className="label">Possui câmeras de segurança?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="yes"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasSecurityCameras')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="no"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasSecurityCameras')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.hasSecurityCameras && (
          <p className="error-message">{errors.hasSecurityCameras.message}</p>
        )}
      </div>

      <div>
        <label className="label">Condomínio fechado?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="yes"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('isGatedCommunity')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="no"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('isGatedCommunity')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.isGatedCommunity && (
          <p className="error-message">{errors.isGatedCommunity.message}</p>
        )}
      </div>

      <FormField
        label="Valor estimado do imóvel (R$)"
        name="estimatedValue"
        placeholder="500000"
        register={register}
        error={errors.estimatedValue}
        maxLength={10}
      />
    </ProductFormWrapper>
  )
}
