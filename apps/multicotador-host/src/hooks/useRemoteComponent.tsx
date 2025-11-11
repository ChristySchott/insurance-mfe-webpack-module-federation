import { useState, useEffect, useCallback } from 'react'
import type { RemoteComponentModule } from '@/types/remoteConfig'
import { loadRemoteModule } from '@/lib/loadRemoteModule'

interface UseRemoteComponentOptions {
  url: string
  scope: string
  module: string
}

interface UseRemoteComponentReturn {
  Component: React.ComponentType | null
  loading: boolean
  error: Error | null
  retry: () => void
}

export function useRemoteComponent(
  options: UseRemoteComponentOptions | null
): UseRemoteComponentReturn {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadComponent = useCallback(async () => {
    if (!options) {
      setComponent(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const module = await loadRemoteModule<RemoteComponentModule>(options)
      setComponent(() => module.default)
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Unknown error loading remote component')
      setError(error)
      console.error('[useRemoteComponent] Load failed:', options, error)
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    loadComponent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retry = useCallback(() => {
    loadComponent()
  }, [loadComponent])

  return { Component, loading, error, retry }
}
