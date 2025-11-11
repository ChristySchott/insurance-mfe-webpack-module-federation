# 🏗️ Insurance quote system with dynamic micro frontends

A **Proof of Concept** demonstrating **Webpack 5 Module Federation** with dynamic remote loading for multi‑product insurance quotes. Each product runs as an independent micro frontend (MFE) that can be developed, deployed, and scaled autonomously.

---

## ✨ Key features

### 🔄 Dynamic Module Federation

- **Runtime remote loading** — Add products without rebuilding the host
- **YAML-based configuration** — Centralized product registry (source of truth)
- **Independent deployment** — Deploy products without coordinating releases
- **Automatic discovery** — Products appear in UI based on the config file

### 🏪 State management

- **Redux Toolkit** — Shared state between host and MFEs
- **Singleton pattern** — Single store instance across all applications via Module Federation shared deps
- **Type‑safe** — Full TypeScript support with automatic inference

### 📋 Multi‑step quote flow

1. **Step 1 (Host):** CPF + product selection
2. **Step 2 (Hybrid):** common fields (name, email, phone) + product‑specific fields (remote)
3. **Step 3 (Product MFE):** product‑specific form (remote)
4. **Step 4 (Host):** final summary

### 🦺 Insurance products

- **Auto Insurance** — license plate, driver’s license, vehicle details
- **Home Insurance** — postal code, property type, area, security features
- **Extensible** — add new products via configuration without host rebuild

---

## 🧭 Overview

Multi‑product quote system where each type of insurance (Auto, Home, etc.) is built and deployed independently as a **Microfrontend**. The app works as a single wizard with **4 steps**, where **steps 2 and 3** change according to the selected product. The main idea is to let different teams work on different products without coordinated deploys, and to add new products without touching the host.

---

## ✅ Requirements (summary)

### Functionality

- A **4‑step wizard** with progressive data entry
- **Step 1** is always the same (CPF + product choice)
- **Step 2** has **common fields** at the top and **product‑specific fields** below
- **Step 3** is **completely different** per product
- **Step 4** is always the same (final summary)

### Architecture

- **Each product lives in a separate repository**
- Teams work independently on different products
- A product deploy must **not** affect the others
- We must be able to **add a new product without rebuilding the host**
- Everything happens on **one page**, no route changes

### Technical constraints

- Must use **Webpack (not Vite)**
- **React 18+** stack

---

## 🧱 Architecture

### Host (MFE wrapper)

- Renders the global layout (header, footer, navigation)
- Controls **Step 1** (CPF + product selection)
- Renders **common fields** in **Step 2**
- **Dynamically loads** product components for **Step 2** and **Step 3**
- Controls **Step 4**
- **Exposes `useCotacaoStore`** via Module Federation so MFEs can read/update the global state

### Product MFEs (auto‑mfe, home‑mfe, etc.)

- Own repository and deploy pipeline
- **Expose two components:** `Step2` (hybrid step) and `Step3` (custom step)
- **Consume** `useCotacaoStore` from the host to read/write data

### Config repo

- Maintains **`config.yaml`** as the source of truth
- CI/CD script converts **YAML → JSON**
- Controls which products are available and their URLs

---

## 🔗 Application flow

```
Step 1 (Host)
  ↳ user selects product
Step 2 (Hybrid)
  ↳ host renders common fields (name, email, phone)
  ↳ host dynamically loads product Step 2 (remote) → product fields
Step 3 (MFE)
  ↳ host dynamically loads product Step 3 (remote)
Step 4 (Host)
  ↳ host reads all data (in‑memory Redux store) and renders summary
```

---

## 🧰 Why Webpack + Module Federation (and not single‑spa)

- **Module Federation is native** to Webpack 5. The host can load components from other repos **at runtime**, and each MFE can be developed and deployed independently.
- **Simpler than single‑spa** for this scenario: we have a single page/wizard and **no cross‑MFE routing**. `single‑spa ` would add orchestration complexity.
- **Shared code as singletons** (React, React‑DOM, Redux) to avoid duplication and hook issues. **Lazy loading** ensures we only load a product’s code when it is selected.
- **Trade‑off:** dynamic `remotes` requires a small custom runtime loader fed by a config file.

---

## 🧵 State sharing: Redux Toolkit

We evaluated three approaches before landing on Redux Toolkit.

### What went wrong with Zustand + Webpack

- In Vite, Zustand works great and we validated a full POC (repo: `https://github.com/ChristySchott/insurance-mfe`).
- In **Webpack**, Zustand **does not keep a singleton** across MFEs even when configured in `shared`. Each app instantiates its own store, leading to **duplicated and desynced state** (documented in the [community discussions](https://github.com/pmndrs/zustand/discussions/1881)).

### What went wrong with `sessionStorage` + `BroadcastChannel`

We tried storing state in `sessionStorage` and notifying changes via `BroadcastChannel` / `CustomEvent`:

- **Race conditions** during fast step navigation (reading intermediate/old states)
- **Growing complexity** (flags, timestamp validation, debouncing, origin tracking)
- **Performance & re‑renders** (custom selectors, deep comparisons, manual memoization)
- **Security** (no protection at rest; future encryption would spread logic across reads/writes)
- **Hard debugging** (no native tooling; many ad‑hoc logs)
- Event‑based sync keeps **multiple serialized copies** across apps → **latency, drift, and exposure**.  
  A **shared in‑memory reference** (Redux via Module Federation) ensures a **single**, **instant**, **confined** source of truth.

### The solution: Redux Toolkit

- **Native singleton** under Module Federation when declared in `shared`
- **Centralized and synchronous** state (no async cross‑app messaging → no race conditions)
- **Familiar API** (close to our prior Zustand hooks)
- **Redux DevTools** (inspect state/actions, time‑travel)
- **Optimized performance** (Immer + memoized selectors)
- **Trade‑offs:** ~**+10 kB gz** vs. sessionStorage‑only; a `Provider` in the host; one extra dependency

#### Store (`src/store/cotacaoStore.ts`) — excerpt

```ts
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import type { CotacaoState } from "@/types/cotacao";

const initialState: CotacaoState = {
  currentStep: 1,
  cpf: "",
  productType: null,
  step2Data: {},
  step2IsValid: false,
  step3IsValid: false,
};

const cotacaoSlice = createSlice({
  name: "cotacao",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setCpf: (state, action: PayloadAction<string>) => {
      state.cpf = action.payload;
    },
    setProductType: (state, action: PayloadAction<string | null>) => {
      state.productType = action.payload;
    },
    setStep2Data: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.step2Data = action.payload;
    },
    setStep2IsValid: (state, action: PayloadAction<boolean>) => {
      state.step2IsValid = action.payload;
    },
    reset: (
      _state,
      action: PayloadAction<Partial<CotacaoState> | undefined>
    ) => {
      return { ...initialState, ...action.payload };
    },
  },
});

export const {
  setCurrentStep,
  setCpf,
  setProductType,
  setStep2Data,
  setStep2IsValid,
  reset,
} = cotacaoSlice.actions;

export const store = configureStore({
  reducer: { cotacao: cotacaoSlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ["cotacao/setStep2Data"] },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Hook (`src/hooks/useCotacaoStore.ts`) — excerpt

```ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/cotacaoStore";
import {
  setCurrentStep,
  setCpf,
  setProductType,
  setStep2Data,
  setStep2IsValid,
  reset,
} from "@/store/cotacaoStore";
import type { CotacaoState } from "@/types/cotacao";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useCotacaoStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.cotacao);

  return {
    ...state,
    setCurrentStep: (step: number) => dispatch(setCurrentStep(step)),
    setCpf: (cpf: string) => dispatch(setCpf(cpf)),
    setProductType: (type: string | null) => dispatch(setProductType(type)),
    setStep2Data: (data: Record<string, unknown>) =>
      dispatch(setStep2Data(data)),
    setStep2IsValid: (valid: boolean) => dispatch(setStep2IsValid(valid)),
    reset: (values?: Partial<CotacaoState>) => dispatch(reset(values)),
  };
};
```

#### Usage in host — excerpt

```ts
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/cotacaoStore'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
```

#### Usage in MFEs — excerpt

```ts
import { useCotacaoStore } from 'multicotadorHost/useCotacaoStore'

function Step2() {
  const { productType, step2Data, setStep2Data } = useCotacaoStore()
  // ...
  return <div>{productType}</div>
}
```

---

## 📦 Project structure (current)

```
.
├── apps
│   ├── auto-mfe
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── App.tsx
│   │   │   ├── bootstrap.tsx
│   │   │   ├── components
│   │   │   │   ├── FormField.tsx
│   │   │   │   └── ProductFormWrapper.tsx
│   │   │   ├── hooks
│   │   │   │   └── useProductForm.ts
│   │   │   ├── index.css
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   │   ├── data.ts
│   │   │   │   ├── format.ts
│   │   │   │   └── validation.ts
│   │   │   ├── steps
│   │   │   │   ├── Step2.tsx
│   │   │   │   └── Step3.tsx
│   │   │   └── types
│   │   │       └── remotes.d.ts
│   │   └── webpack.config.ts
│   ├── home-mfe
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── App.tsx
│   │   │   ├── bootstrap.tsx
│   │   │   ├── components
│   │   │   │   ├── FormField.tsx
│   │   │   │   └── ProductFormWrapper.tsx
│   │   │   ├── hooks
│   │   │   │   └── useProductForm.ts
│   │   │   ├── index.css
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   │   ├── data.ts
│   │   │   │   ├── format.ts
│   │   │   │   └── validation.ts
│   │   │   ├── steps
│   │   │   │   ├── Step2.tsx
│   │   │   │   └── Step3.tsx
│   │   │   └── types
│   │   │       └── remotes.d.ts
│   │   └── webpack.config.ts
│   ├── insurance-config
│   │   ├── environments
│   │   │   ├── config.dev.yaml
│   │   │   ├── config.prod.yaml
│   │   │   └── config.qa.yaml
│   │   ├── package.json
│   │   ├── schemas
│   │   │   └── config.schema.ts
│   │   ├── scripts
│   │   │   ├── convert-yaml-to-json.ts
│   │   │   └── validate-config.ts
│   └── multicotador-host
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       ├── src
│       │   ├── App.tsx
│       │   ├── bootstrap.tsx
│       │   ├── components
│       │   │   ├── ErrorBoundary.tsx
│       │   │   ├── LoadingSpinner.tsx
│       │   │   ├── Navigation.tsx
│       │   │   ├── ProductOption.tsx
│       │   │   ├── ProductTypeSelector.tsx
│       │   │   ├── RemoteComponent.tsx
│       │   │   ├── StepProgress.tsx
│       │   │   ├── steps
│       │   │   │   ├── Step1.tsx
│       │   │   │   ├── Step2.tsx
│       │   │   │   ├── Step3.tsx
│       │   │   │   └── Step4.tsx
│       │   │   └── StepWizard.tsx
│       │   ├── config
│       │   │   └── remoteConfig.ts
│       │   ├── hooks
│       │   │   ├── useCotacaoStore.ts
│       │   │   ├── useRemoteComponent.tsx
│       │   │   └── useRemoteProducts.tsx
│       │   ├── index.css
│       │   ├── index.ts
│       │   ├── lib
│       │   │   ├── format.ts
│       │   │   └── loadRemoteModule.ts
│       │   ├── store
│       │   │   └── cotacaoStore.ts
│       │   └── types
│       │       ├── cotacao.ts
│       │       ├── remoteConfig.ts
│       │       └── remotes.d.ts
│       └── webpack.config.ts
├── package.json
├── packages
│   ├── eslint-config
│   └── prettier-config
├── pnpm-workspace.yaml
├── README.md
└── turbo.json
```

---

## ⚙️ Dynamic remotes

Traditionally, Webpack Module Federation requires **static** `remotes` at build time:

```ts
new ModuleFederationPlugin({
  remotes: {
    autoMfe: "autoMfe@http://localhost:3001/remoteEntry.js",
    homeMfe: "homeMfe@http://localhost:3002/remoteEntry.js",
  },
});
```

That would force a host rebuild for every new product.  
**Our solution:** runtime remotes **fed by `config.json`** produced from YAML by CI/CD.

### `config.json` structure

```json
{
  "products": [
    {
      "id": "auto",
      "name": "Seguro Auto",
      "scope": "autoMfe",
      "url": "http://localhost:3002/remoteEntry.js",
      "enabled": true
    },
    {
      "id": "home",
      "name": "Seguro Residencial",
      "scope": "homeMfe",
      "url": "http://localhost:3001/remoteEntry.js",
      "enabled": true
    },
    {
      "id": "life",
      "name": "Seguro de Vida",
      "scope": "lifeMfe",
      "url": "http://localhost:3003/remoteEntry.js",
      "enabled": false
    }
  ]
}
```

- `id`: business identifier
- `name`: UI label
- `scope`: Module Federation container name (**matches `name` in the product’s `webpack.config.ts`**)
- `url`: `remoteEntry.js` endpoint
- `enabled`: feature toggle per product

### `loadRemoteModule.ts` — essentials

```ts
interface RemoteContainer {
  init(shareScope: unknown): Promise<void>;
  get(module: string): Promise<() => unknown>;
}

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: unknown };

const loadedContainers = new Map<string, RemoteContainer>();
const failedScripts = new Set<string>();

async function loadRemoteContainer(
  url: string,
  scope: string
): Promise<RemoteContainer> {
  const cacheKey = `${scope}@${url}`;
  if (loadedContainers.has(cacheKey)) return loadedContainers.get(cacheKey)!;
  if (failedScripts.has(cacheKey))
    throw new Error(`Remote script previously failed to load: ${url}`);

  await loadRemoteScript(url, scope);
  const container = await waitForContainer(scope, url);
  if (!container) {
    failedScripts.add(cacheKey);
    throw new Error(`Remote container "${scope}" not found at ${url}`);
  }

  await __webpack_init_sharing__("default");
  await container.init(__webpack_share_scopes__.default);

  loadedContainers.set(cacheKey, container);
  return container;
}

export async function loadRemoteModule<T = React.ComponentType>(opts: {
  url: string;
  scope: string;
  module: string;
}): Promise<T> {
  const container = await loadRemoteContainer(opts.url, opts.scope);
  const factory = await container.get(opts.module);
  return factory() as T;
}
```

### `remoteConfig.ts` — essentials

```ts
const FALLBACK_CONFIG = {
  /* minimal enabled products for resilience */
};

let cachedConfig: RemoteConfig | null = null;

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  if (cachedConfig) return cachedConfig;
  try {
    const res = await fetch(getConfigUrl(), { cache: "no-cache" });
    if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
    cachedConfig = (await res.json()) as RemoteConfig;
    return cachedConfig;
  } catch {
    console.warn("[fetchRemoteConfig] Using fallback config");
    cachedConfig = FALLBACK_CONFIG;
    return FALLBACK_CONFIG;
  }
}

export function getEnabledProducts(config: RemoteConfig) {
  return config.products.filter((p) => p.enabled);
}
```

### `useRemoteProducts.tsx` — essentials

```ts
export function useRemoteProducts() {
  const [products, setProducts] = useState<RemoteProductConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const cfg = await fetchRemoteConfig();
        setProducts(getEnabledProducts(cfg));
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to load products"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getProduct = (id: string) => products.find((p) => p.id === id);
  return { products, loading, error, getProduct };
}
```

---

## ➕ Adding a new product

1. **Create the MFE** and expose `Step2`/`Step3` in `webpack.config.ts`:

```ts
new ModuleFederationPlugin({
  name: "petMfe", // must match `scope` in config.json
  filename: "remoteEntry.js",
  exposes: { "./Step2": "./src/steps/Step2", "./Step3": "./src/steps/Step3" },
  remotes: {
    multicotadorHost: "multicotadorHost@http://localhost:3000/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.3.1", eager: false },
    "react-dom": { singleton: true, requiredVersion: "^18.3.1", eager: false },
    "@reduxjs/toolkit": {
      singleton: true,
      requiredVersion: "^2.10.1",
      eager: false,
    },
    "react-redux": { singleton: true, requiredVersion: "^9.2.0", eager: false },
  },
});
```

2. **Update `config.yaml`/`config.json`** with the new product and environment URLs

3. **Regenerate config** (CI/CD or locally)

4. **Reload the host** — the product appears automatically in Step 1

---

## 🚀 Getting started

### Prerequisites

- **Node.js ≥ 18.0.0**
- **pnpm ≥ 8.0.0**

### Installation

```bash
git clone git@github.com:ChristySchott/insurance-mfe-webpack-module-federation.git
cd insurance-mfe-webpack
pnpm install
```

### Development (all apps)

```bash
pnpm dev
```

This will:

- Generate `config.json` from YAML (`apps/insurance-config`)
- Start **multicotador-host** (3000), **auto-mfe** (3002), **home-mfe** (3001)  
  Open: <http://localhost:3000>

### Run individually

```bash
# generate config first
cd apps/insurance-config && pnpm build:dev

# then run each app
cd ../multicotador-host && pnpm dev   # 3000
cd ../auto-mfe && pnpm dev            # 3002
cd ../home-mfe && pnpm dev            # 3001
```

---

## 🧾 Production considerations

### Config distribution

- **Dev (locally):** `insurance-config` generates `apps/multicotador-host/public/config.json`
- **Prod (ideal):** CI/CD publishes JSON to a CDN; host fetches from `CONFIG_URL`

```ts
const configUrl = process.env.CONFIG_URL;
```

### Environment‑specific URLs

```yaml
# config.prod.yaml
products:
  - id: auto
    url: https://example/auto-mfe/remoteEntry.js
```
