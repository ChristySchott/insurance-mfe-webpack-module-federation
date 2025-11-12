import { Suspense } from 'react'
import { useRemoteComponent } from '@/hooks/useRemoteComponent'

type RemoteModule = './Step2' | './Step3'

interface RemoteComponentProps {
  url: string
  scope: string
  module: RemoteModule
}

const Loading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      <p className="text-sm text-gray-600">Carregando componente...</p>
    </div>
  </div>
)

export function RemoteComponent({ url, scope, module }: RemoteComponentProps) {
  const { Component, loading, error, retry } = useRemoteComponent({
    url,
    scope,
    module,
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900">
              Erro ao carregar componente
            </h3>
            <p className="mt-2 text-sm text-red-700">
              Não foi possível apresentar o conteúdo
            </p>
            <button
              onClick={retry}
              className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!Component) {
    return <Loading />
  }

  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}
