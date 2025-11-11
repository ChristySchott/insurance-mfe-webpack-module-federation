import { ReactNode } from 'react'

interface ProductFormWrapperProps {
  children: ReactNode
  hasErrors: boolean
}

export function ProductFormWrapper({
  children,
  hasErrors,
}: ProductFormWrapperProps) {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>

      {hasErrors && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Preencha todos os campos obrigatórios para continuar.
          </p>
        </div>
      )}
    </form>
  )
}
