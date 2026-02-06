import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

function expectedBinaryPath() {
  const dist = path.join('node_modules', 'electron', 'dist')
  switch (process.platform) {
    case 'win32':
      return path.join(dist, 'electron.exe')
    case 'darwin':
      return path.join(dist, 'Electron.app')
    default:
      return path.join(dist, 'electron')
  }
}

function runInstall(env) {
  const installScript = path.join('node_modules', 'electron', 'install.js')
  if (!fs.existsSync(installScript)) {
    return { ok: false, reason: `missing ${installScript}` }
  }

  const r = spawnSync(process.execPath, [installScript], {
    env,
    stdio: 'inherit',
  })
  return { ok: r.status === 0 }
}

const bin = expectedBinaryPath()
if (fs.existsSync(bin)) {
  process.exit(0)
}

// Electron's own postinstall sometimes fails due to network/proxy restrictions.
// If the binary isn't present, retry with a mirror fallback.
const baseEnv = { ...process.env }
baseEnv.ELECTRON_CACHE ??= path.resolve('.cache', 'electron')

let res = runInstall(baseEnv)
if (res.ok) process.exit(0)

// Respect user-specified mirror; otherwise apply a well-known mirror.
const fallbackEnv = { ...baseEnv }
fallbackEnv.ELECTRON_MIRROR ??= 'https://npmmirror.com/mirrors/electron/'

res = runInstall(fallbackEnv)
if (!res.ok) {
  console.error(`\nFailed to install Electron binary. Expected at: ${bin}`)
  console.error(`Try setting ELECTRON_MIRROR and re-running npm install.`)
  process.exit(1)
}

