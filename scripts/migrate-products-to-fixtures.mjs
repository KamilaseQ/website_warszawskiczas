#!/usr/bin/env node
/**
 * Skrypt JEDNORAZOWY — ekstrahuje tablicę produktów z `data/mock-products.ts`
 * i zapisuje jako `from-cms/fixtures/products.json`.
 *
 * Założenia:
 * - Tablica `mockProducts` zaczyna się od linii `export const mockProducts: Product[] = [`
 *   i kończy się `]` przed `export function productUrlSlug(...)`.
 * - Dane wewnątrz są kompatybilne z JSON (klucze cytowane, brak trailing comma,
 *   brak literałów JS) — sprawdzone wcześniej.
 *
 * Uruchom: `node scripts/migrate-products-to-fixtures.mjs`
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const srcPath = resolve(root, 'data', 'mock-products.ts')
const outPath = resolve(root, 'from-cms', 'fixtures', 'products.json')

const source = readFileSync(srcPath, 'utf8')

const startMarker = 'export const mockProducts: Product[] = ['
const startIdx = source.indexOf(startMarker)
if (startIdx === -1) {
  console.error(`[migrate] Nie znalazłem markera "${startMarker}" w ${srcPath}`)
  process.exit(1)
}

const arrayStart = startIdx + startMarker.length - 1

let depth = 0
let endIdx = -1
let inString = false
let stringChar = null
let prevChar = ''
for (let i = arrayStart; i < source.length; i++) {
  const ch = source[i]
  if (inString) {
    if (ch === stringChar && prevChar !== '\\') {
      inString = false
      stringChar = null
    }
  } else if (ch === '"' || ch === "'") {
    inString = true
    stringChar = ch
  } else if (ch === '[') {
    depth++
  } else if (ch === ']') {
    depth--
    if (depth === 0) {
      endIdx = i
      break
    }
  }
  prevChar = ch
}

if (endIdx === -1) {
  console.error('[migrate] Nie znalazłem domknięcia tablicy mockProducts')
  process.exit(1)
}

const literal = source.slice(arrayStart, endIdx + 1)

let parsed
try {
  parsed = JSON.parse(literal)
} catch (err) {
  console.error('[migrate] JSON.parse zawiódł — dane nie są czystym JSON-em')
  console.error(err)
  process.exit(1)
}

if (!Array.isArray(parsed)) {
  console.error('[migrate] Sparsowana wartość nie jest tablicą')
  process.exit(1)
}

const outDir = dirname(outPath)
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true })
}

writeFileSync(outPath, JSON.stringify(parsed, null, 2) + '\n', 'utf8')
console.log(`[migrate] OK — wpisów: ${parsed.length}, zapisane do ${outPath}`)
