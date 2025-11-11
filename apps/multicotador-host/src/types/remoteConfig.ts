export interface RemoteProductConfig {
  id: string
  name: string
  scope: string
  url: string
  enabled: boolean
}

export interface RemoteConfig {
  products: RemoteProductConfig[]
}

export interface RemoteComponentModule {
  default: React.ComponentType
}
