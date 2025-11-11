import { z } from 'zod'

const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  scope: z.string().min(1),
  url: z.string().url(),
  enabled: z.boolean(),
})

export const configSchema = z.object({
  products: z.array(productSchema).min(1),
})

export type ConfigSchema = z.infer<typeof configSchema>
export type ProductConfig = z.infer<typeof productSchema>
