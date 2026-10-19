// Export native alpha or apply an imagegen cutout mask to original official pixels.
import { createRequire } from 'node:module'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const require = createRequire(import.meta.url)
let sharp
try { sharp = require('sharp') } catch {
  sharp = createRequire(path.join(process.env.MLBB_SHARP_ROOT || '/tmp/mlbb-cutout-export', 'package.json'))('sharp')
}
const [inventoryPath, id, input, method] = process.argv.slice(2)
if (!inventoryPath || !id || !input || !['official-alpha', 'background-removal'].includes(method)) {
  throw new Error('Usage: node scripts/save-mlbb-cutout.mjs inventory.json hero-id image-path official-alpha|background-removal')
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'))
const hero = inventory.find(item => item.id === Number(id))
const output = path.join(root, 'public/images/mlbb-cutouts', `hero-${id}.webp`)
await mkdir(path.dirname(output), { recursive: true })
let image = sharp(input).ensureAlpha()
if (method === 'background-removal') {
  const source = sharp(hero.path)
  const { width, height } = await source.metadata()
  const alpha = await image.extractChannel(3).resize(width, height, { fit: 'fill' }).raw().toBuffer()
  // Keep original RGB, not the generative tool's repainted character pixels.
  const rgb = await source.removeAlpha().raw().toBuffer()
  image = sharp(rgb, { raw: { width, height, channels: 3 } }).joinChannel(alpha, { raw: { width, height, channels: 1 } })
}
await image.webp({ lossless: true, effort: 6 }).toFile(output)
const stats = await sharp(output).stats()
if (stats.channels[3]?.min !== 0 || stats.channels[3]?.max !== 255) throw new Error(`Missing transparency: ${hero.name}`)
const manifestPath = path.join(root, 'data/mlbbArtwork.json')
let manifest
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')) } catch { manifest = {} }
manifest[id] = { name: hero.name, image: `/images/mlbb-cutouts/hero-${id}.webp`, source: hero.source, method, originalPixels: true }
await writeFile(manifestPath, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort((a, b) => Number(a[0]) - Number(b[0]))), null, 2) + '\n')
console.log(`Saved ${hero.name}`)
