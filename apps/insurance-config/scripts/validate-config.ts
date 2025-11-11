import { readFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import { configSchema } from '@/schemas/config.schema.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  const environment = process.argv[2] || 'dev'
  const filePath = resolve(
    __dirname,
    `../environments/config.${environment}.yaml`
  )

  try {
    const content = await readFile(filePath, 'utf-8')
    const parsedContent = yaml.load(content)

    const validationResult = configSchema.safeParse(parsedContent)

    if (!validationResult.success) {
      console.error('[validate] ❌ Validation failed:\n')
      console.error(JSON.stringify(validationResult.error.format(), null, 2))
      process.exit(1)
    }

    console.log('[validate] ✅ Configuration is valid')

    const enabledProducts = validationResult.data.products.filter(
      (p) => p.enabled
    )

    enabledProducts.forEach((p) => {
      console.log(`  ✓ ${p.name} (${p.id})`)
    })

    console.log('')
  } catch (error) {
    console.error('[validate] ❌ Error:', error)
    process.exit(1)
  }
}

main()
