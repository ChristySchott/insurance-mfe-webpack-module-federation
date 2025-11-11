import { useState, useEffect } from 'react'
import { fetchRemoteConfig, getEnabledProducts } from '@/config/remoteConfig'
import type { RemoteProductConfig } from '@/types/remoteConfig'

interface UseRemoteProductsReturn {
  products: RemoteProductConfig[]
  loading: boolean
  error: Error | null
  getProduct: (id: string) => RemoteProductConfig | undefined
}

export function useRemoteProducts(): UseRemoteProductsReturn {
  const [products, setProducts] = useState<RemoteProductConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const config = await fetchRemoteConfig()
        const enabledProducts = getEnabledProducts(config)
        setProducts(enabledProducts)
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to load products')
        setError(error)
        console.error('[useRemoteProducts] Failed:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const getProduct = (id: string) => products.find((p) => p.id === id)

  return { products, loading, error, getProduct }
}
