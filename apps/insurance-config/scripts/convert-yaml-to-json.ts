import { readFile, writeFile, mkdir } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  const environment = process.argv[2] || 'dev'
  const isProduction = environment === 'prod'

  const inputPath = resolve(
    __dirname,
    `../environments/config.${environment}.yaml`
  )
  const outputPath = resolve(
    __dirname,
    '../../multicotador-host/public/config.json'
  )

  try {
    const yamlContent = await readFile(inputPath, 'utf-8')
    const parsedData = yaml.load(yamlContent)

    const jsonContent = isProduction
      ? JSON.stringify(parsedData)
      : JSON.stringify(parsedData, null, 2)

    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, jsonContent, 'utf-8')

    console.log(`[convert] ✅ Conversion successful`)
  } catch (error) {
    console.error('[convert] ❌ Conversion failed:', error)
    process.exit(1)
  }
}

main()
