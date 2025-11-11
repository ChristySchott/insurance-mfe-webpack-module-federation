import type { RemoteConfig, RemoteProductConfig } from '@/types/remoteConfig'

const FALLBACK_CONFIG: RemoteConfig = {
  products: [
    {
      id: 'auto',
      name: 'Seguro Auto',
      scope: 'autoMfe',
      url: 'http://localhost:3002/remoteEntry.js',
      enabled: true,
    },
    {
      id: 'home',
      name: 'Seguro Residencial',
      scope: 'homeMfe',
      url: 'http://localhost:3001/remoteEntry.js',
      enabled: true,
    },
  ],
}

let cachedConfig: RemoteConfig | null = null

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    const response = await fetch('/config.json', {
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`Config fetch failed: ${response.status}`)
    }

    const config = (await response.json()) as RemoteConfig
    cachedConfig = config
    return config
  } catch (error) {
    console.warn('[fetchRemoteConfig] Using fallback config:', error)
    cachedConfig = FALLBACK_CONFIG
    return FALLBACK_CONFIG
  }
}

export function getEnabledProducts(
  config: RemoteConfig
): RemoteProductConfig[] {
  return config.products.filter((product) => product.enabled)
}
