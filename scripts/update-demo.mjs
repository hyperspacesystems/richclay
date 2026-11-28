#!/usr/bin/env node

// Points the public demo (panphora.hyperclay.com/demos/richclay.html) at the
// version just published. Runs as `postpublish`, after npm has the new version,
// so the demo never loads a version the CDN does not serve yet. On 2026-11-27 a
// post announced checklists while the demo still loaded 0.6.1, which had none.
//
// `--check` writes nothing and exits 1 when the demo pins another version.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const demoFile = path.join(rootDir, '..', 'LOCAL_APPS', 'demos', 'richclay.html')
const { version } = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))
const pin = /richclay@\d+\.\d+\.\d+/g

if (!fs.existsSync(demoFile)) {
  console.error(`Error: demo not found at ${demoFile}. Update scripts/update-demo.mjs if it moved.`)
  process.exit(1)
}

const html = fs.readFileSync(demoFile, 'utf8')
const pins = html.match(pin) || []

if (!pins.length) {
  console.error(`Error: no richclay@x.y.z pin found in ${demoFile}.`)
  process.exit(1)
}

const stale = [...new Set(pins.filter(found => found !== `richclay@${version}`))]

if (process.argv.includes('--check')) {
  if (stale.length) {
    console.error(`✗ demo pins ${stale.join(', ')}, package is ${version}`)
    process.exit(1)
  }
  console.log(`✓ demo pins richclay@${version}`)
  process.exit(0)
}

fs.writeFileSync(demoFile, html.replace(pin, `richclay@${version}`), 'utf8')
console.log(stale.length ? `✓ demo now pins richclay@${version} (was ${stale.join(', ')})` : `✓ demo already pins richclay@${version}`)
