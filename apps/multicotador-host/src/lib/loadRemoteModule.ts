interface RemoteContainer {
  init(shareScope: unknown): Promise<void>
  get(module: string): Promise<() => unknown>
}

interface LoadRemoteModuleOptions {
  url: string
  scope: string
  module: string
}

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>
declare const __webpack_share_scopes__: { default: unknown }

const loadedContainers = new Map<string, RemoteContainer>()
const loadingScripts = new Map<string, Promise<void>>()

async function loadRemoteContainer(
  url: string,
  scope: string
): Promise<RemoteContainer> {
  const cacheKey = `${scope}@${url}`

  if (loadedContainers.has(cacheKey)) {
    return loadedContainers.get(cacheKey)!
  }

  await loadRemoteScript(url, scope)

  const container = await waitForContainer(scope)

  if (!container) {
    throw new Error(`Remote container "${scope}" not found at ${url}`)
  }

  await __webpack_init_sharing__('default')
  await container.init(__webpack_share_scopes__.default)

  loadedContainers.set(cacheKey, container)
  return container
}

function waitForContainer(scope: string): Promise<RemoteContainer | null> {
  return new Promise((resolve) => {
    let attempts = 0

    const checkContainer = () => {
      const container = (window as unknown as Record<string, RemoteContainer>)[
        scope
      ]

      if (container) {
        resolve(container)
        return
      }

      attempts++

      if (attempts >= 10) {
        resolve(null)
        return
      }

      setTimeout(checkContainer, 100)
    }

    checkContainer()
  })
}

function loadRemoteScript(url: string, scope: string): Promise<void> {
  const cacheKey = `${scope}@${url}`

  if (loadingScripts.has(cacheKey)) {
    return loadingScripts.get(cacheKey)!
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[data-scope="${scope}"][data-url="${url}"]`
    )

    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = url
    script.type = 'text/javascript'
    script.async = true
    script.setAttribute('data-scope', scope)
    script.setAttribute('data-url', url)

    script.onload = () => {
      resolve()
    }

    script.onerror = () => {
      loadingScripts.delete(cacheKey)
      reject(new Error(`Failed to load remote script: ${url}`))
    }

    document.head.appendChild(script)
  })

  loadingScripts.set(cacheKey, promise)

  promise.finally(() => {
    setTimeout(() => loadingScripts.delete(cacheKey), 1000)
  })

  return promise
}

export async function loadRemoteModule<T = React.ComponentType>(
  options: LoadRemoteModuleOptions
): Promise<T> {
  try {
    const container = await loadRemoteContainer(options.url, options.scope)
    const factory = await container.get(options.module)
    const module = factory()
    return module as T
  } catch (error) {
    console.error('[loadRemoteModule] Failed to load:', options, error)
    throw error
  }
}
