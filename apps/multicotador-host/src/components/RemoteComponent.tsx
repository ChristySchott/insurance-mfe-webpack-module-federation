import { Suspense } from 'react'
import { useRemoteComponent } from '@/hooks/useRemoteComponent'

type RemoteModule = './Step2' | './Step3'

interface RemoteComponentProps {
  url: string
  scope: string
  module: RemoteModule
}

export function RemoteComponent({ url, scope, module }: RemoteComponentProps) {
  const { Component, loading, error, retry } = useRemoteComponent({
    url,
    scope,
    module,
  })

  if (loading) {
    return <div>Carregando componente...</div>
  }

  if (error) {
    return (
      <div role="alert" style={{ padding: '20px', color: 'red' }}>
        <h3>Erro ao carregar componente</h3>
        <p>{error.message}</p>
        <button onClick={retry}>Tentar Novamente</button>
      </div>
    )
  }

  if (!Component) {
    return <div>Carregando componente...</div>
  }

  return (
    <Suspense fallback={<div>Carregando componente...</div>}>
      <Component />
    </Suspense>
  )
}
