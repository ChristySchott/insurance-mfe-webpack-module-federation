import { RemoteSecurityError } from './error'

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

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        'https://cdn.example.com',
        'https://auto-mfe.example.com',
        'https://home-mfe.example.com',
        'https://life-mfe.example.com',
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
      ]

function validateRemoteUrl(url: string): void {
  let parsedUrl: URL

  try {
    parsedUrl = new URL(url)
  } catch {
    throw new RemoteSecurityError(`Invalid URL format: ${url}`, url)
  }

  if (
    process.env.NODE_ENV === 'production' &&
    parsedUrl.protocol !== 'https:'
  ) {
    throw new RemoteSecurityError(
      `HTTPS required in production. Received: ${parsedUrl.protocol}//${parsedUrl.host}`,
      url
    )
  }

  const urlOrigin = `${parsedUrl.protocol}//${parsedUrl.host}`
  const isAllowed = allowedOrigins.some((allowedOrigin) =>
    urlOrigin.startsWith(allowedOrigin)
  )

  if (!isAllowed) {
    throw new RemoteSecurityError(
      `Origin not in allowlist. Received: ${urlOrigin}.`,
      url
    )
  }
}

export function clearRemoteCache(url?: string, scope?: string) {
  if (url && scope) {
    const cacheKey = `${scope}@${url}`

    loadedContainers.delete(cacheKey)
    loadingScripts.delete(cacheKey)

    const scriptAlreadyAddedToDOM = document.querySelector(
      `script[data-scope="${scope}"][data-url="${url}"]`
    )

    if (scriptAlreadyAddedToDOM) {
      scriptAlreadyAddedToDOM.remove()
    }

    return
  }

  loadedContainers.clear()
  loadingScripts.clear()

  document
    .querySelectorAll('script[data-scope][data-url]')
    .forEach((script) => {
      script.remove()
    })
}

async function prepareSharedDependencies() {
  await __webpack_init_sharing__('default')
}

async function tellRemoteContainerAboutSharedDeps(container: RemoteContainer) {
  await prepareSharedDependencies()
  await container.init(__webpack_share_scopes__.default)
}

async function loadRemoteContainer(
  url: string,
  scope: string
): Promise<RemoteContainer> {
  validateRemoteUrl(url)

  const cacheKey = `${scope}@${url}`

  if (loadedContainers.has(cacheKey)) {
    return loadedContainers.get(cacheKey)!
  }

  await loadRemoteScript(url, scope)

  const container = await waitForRemoteContainerToAppearOnWindow(scope)

  if (!container) {
    throw new Error(`Remote container "${scope}" not found at ${url}`)
  }

  await tellRemoteContainerAboutSharedDeps(container)

  loadedContainers.set(cacheKey, container)
  return container
}

function waitForRemoteContainerToAppearOnWindow(
  scope: string
): Promise<RemoteContainer | null> {
  return new Promise((resolve) => {
    let attempts = 0
    const maxAttemptsToCheckIfRemoteContainerExists = 10

    const checkIfContainerExistsOnWindow = () => {
      const container = (window as unknown as Record<string, RemoteContainer>)[
        scope
      ]

      if (container) {
        resolve(container)
        return
      }

      attempts++

      if (attempts >= maxAttemptsToCheckIfRemoteContainerExists) {
        resolve(null)
        return
      }

      setTimeout(checkIfContainerExistsOnWindow, 100) //Polling is necessary because no event tell us when the container is ready
    }

    checkIfContainerExistsOnWindow()
  })
}

function loadRemoteScript(url: string, scope: string): Promise<void> {
  const cacheKey = `${scope}@${url}`

  if (loadingScripts.has(cacheKey)) {
    return loadingScripts.get(cacheKey)!
  }

  const promise = new Promise<void>((resolve, reject) => {
    const scriptAlreadyAddedToDOM = document.querySelector(
      `script[data-scope="${scope}"][data-url="${url}"]`
    )

    if (scriptAlreadyAddedToDOM) {
      resolve()
      return
    }

    // Create and inject script tag
    const script = document.createElement('script')
    script.src = url
    script.type = 'text/javascript'
    script.async = true
    script.setAttribute('data-scope', scope)
    script.setAttribute('data-url', url)

    script.onload = () => {
      resolve() // Script downloaded successfully
    }

    script.onerror = () => {
      loadingScripts.delete(cacheKey)
      script.remove()
      reject(new Error(`Failed to load remote script: ${url}`))
    }

    // Add to DOM and start download
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
    const createModuleFactory = await container.get(options.module)
    const module = createModuleFactory()
    return module as T
  } catch (error) {
    if (error instanceof RemoteSecurityError) {
      console.error('[loadRemoteModule] Security violation:', error.message)
    } else {
      console.error('[loadRemoteModule] Failed to load:', options, error)
    }
    throw error
  }
}
