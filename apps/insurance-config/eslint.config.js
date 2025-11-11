import reactConfig from '@insurance-mfe/eslint-config/react'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['dist', 'node_modules', 'routeTree.gen.ts'],
  },
  ...reactConfig,
])
