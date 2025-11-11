import { UseFormRegisterReturn } from 'react-hook-form'
import type { RemoteProductConfig } from '@/types/remoteConfig'

interface ProductOptionProps {
  product: RemoteProductConfig
  isSelected: boolean
  register: UseFormRegisterReturn
}

export function ProductOption({
  product,
  isSelected,
  register,
}: ProductOptionProps) {
  return (
    <label
      className={`
        relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
        ${
          isSelected
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <input
        type="radio"
        value={product.id}
        className="sr-only"
        {...register}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            {product.name}
          </span>

          {isSelected && (
            <svg
              className="w-6 h-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </label>
  )
}
