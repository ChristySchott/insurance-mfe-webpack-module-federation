import { step3Schema, Step3Data } from '../lib/validation'
import { FormField } from '@/components/FormField'
import { useProductForm } from '@/hooks/useProductForm'
import { ProductFormWrapper } from '@/components/ProductFormWrapper'
import { BRANDS, MODELS_BY_BRAND, FUEL_TYPES } from '../lib/data'
import { formatPlate } from '../lib/format'

export default function Step3() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useProductForm<Step3Data>({
    schema: step3Schema,
  })

  const watchedBrand = watch('brand')
  const hasErrors = Object.keys(errors).length > 0

  return (
    <ProductFormWrapper hasErrors={hasErrors}>
      <div>
        <label htmlFor="plate" className="label">
          Placa do veículo
        </label>
        <input
          id="plate"
          type="text"
          placeholder="ABC-1234"
          maxLength={8}
          className={`input-field ${errors.plate ? 'input-error' : ''}`}
          {...register('plate', {
            onChange: (e) => {
              const formatted = formatPlate(e.target.value)
              setValue('plate', formatted)
            },
          })}
        />
        {errors.plate && (
          <p className="error-message">{errors.plate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="brand" className="label">
          Marca
        </label>
        <select
          id="brand"
          className={`input-field ${errors.brand ? 'input-error' : ''}`}
          {...register('brand', {
            onChange: () => {
              setValue('model', '')
            },
          })}
        >
          <option value="">Selecione a marca</option>
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        {errors.brand && (
          <p className="error-message">{errors.brand.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="model" className="label">
          Modelo
        </label>
        <select
          id="model"
          disabled={!watchedBrand}
          className={`input-field ${errors.model ? 'input-error' : ''}`}
          {...register('model')}
        >
          <option value="">
            {watchedBrand ? 'Selecione o modelo' : 'Selecione a marca primeiro'}
          </option>
          {watchedBrand &&
            MODELS_BY_BRAND[watchedBrand]?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
        </select>
        {errors.model && (
          <p className="error-message">{errors.model.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Ano de fabricação"
          name="manufacturingYear"
          placeholder="2023"
          register={register}
          error={errors.manufacturingYear}
          maxLength={4}
        />

        <FormField
          label="Ano do modelo"
          name="modelYear"
          placeholder="2024"
          register={register}
          error={errors.modelYear}
          maxLength={4}
        />
      </div>

      <div>
        <label htmlFor="fuelType" className="label">
          Tipo de combustível
        </label>
        <select
          id="fuelType"
          className={`input-field ${errors.fuelType ? 'input-error' : ''}`}
          {...register('fuelType')}
        >
          <option value="">Selecione o combustível</option>
          {FUEL_TYPES.map((fuel) => (
            <option key={fuel.value} value={fuel.value}>
              {fuel.label}
            </option>
          ))}
        </select>
        {errors.fuelType && (
          <p className="error-message">{errors.fuelType.message}</p>
        )}
      </div>

      <FormField
        label="Quilometragem atual"
        name="currentMileage"
        placeholder="50000"
        register={register}
        error={errors.currentMileage}
        maxLength={7}
      />

      <div>
        <label className="label">Possui rastreador?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="yes"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasTracker')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="no"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasTracker')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.hasTracker && (
          <p className="error-message">{errors.hasTracker.message}</p>
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
        <label htmlFor="vehicleUsage" className="label">
          Uso do veículo
        </label>
        <select
          id="vehicleUsage"
          className={`input-field ${errors.vehicleUsage ? 'input-error' : ''}`}
          {...register('vehicleUsage')}
        >
          <option value="">Selecione o uso</option>
          <option value="personal">Particular</option>
          <option value="business">Comercial</option>
          <option value="taxi">Táxi/App</option>
          <option value="rental">Aluguel</option>
        </select>
        {errors.vehicleUsage && (
          <p className="error-message">{errors.vehicleUsage.message}</p>
        )}
      </div>
    </ProductFormWrapper>
  )
}
